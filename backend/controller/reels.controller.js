import Notification from "../models/notifaction.model.js";
import Reel from "../models/reels.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadReel = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      const mediaUrl = await uploadOnCloudinary(req.file.path);
      media = mediaUrl;
    }
    if (!media) {
      return res.status(400).json({ message: "Reel must have media" });
    }
    const newReel = await Reel.create({
      media,
      caption,
      author: req.userId,
    });
    const user = await User.findById(req.userId);
    user.reels.push(newReel._id);
    await user.save();
    const populatedReel = await Reel.findById(newReel._id).populate(
      "author",
      "name userName profileImage"
    );
    return res.status(201).json(populatedReel);
  } catch (error) {
    return res.status(500).json({ message: "upload reel error" });
  }
};

const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");
    return res.status(200).json(reels);
  } catch (error) {
    console.error("Error fetching reels:", error);
    return res.status(500).json({ message: "getallreels error" });
  }
};

const likes = async (req, res) => {
  try {
    const reelId = req.params.reelId;
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return res.status(404).json({ message: "Reel not found" });
    }
    if (reel.likes.includes(req.userId)) {
      reel.likes.pull(req.userId);
    } else {
      reel.likes.push(req.userId);
      if (reel.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: reel.author._id,
          type: "like",
          message: "liked your reel",
          reel: reel._id,
        });
        const populatedNotification = await Notification.findById(
          notification._id
        )
          .populate("sender", "name userName profileImage")
          .populate("receiver", "name userName profileImage").populate("reel","media caption author");
        const receiverSocketId = getSocketId(reel.author._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }
    await reel.save();
    io.emit("reelLiked", { reelId: reel._id, likes: reel.likes.length });
    return res.status(200).json(reel);
  } catch (error) {
    console.error("Error updating likes:", error);
    return res.status(500).json({ message: "Like update error" });
  }
};

const commentOnReel = async (req, res) => {
  try {
    const reelId = req.params.reelId;
    const { comment } = req.body;
    const reel = await Reel.findById(reelId);

    if (!reel) {
      return res.status(400).json({ message: "Reel ID is required" });
    }
    const user = await User.findById(req.userId);
    reel.comments.push({
      author: user._id,
      comment: comment,
    });
    if (reel.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: reel.author._id,
        type: "comment",
        message: "commented on your reel",
        reel: reel._id,
      });
      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate("sender", "name userName profileImage")
        .populate("receiver", "name userName profileImage").populate("reel","media caption author");
      const receiverSocketId = getSocketId(reel.author._id.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }
    await reel.save();
    const populatedReel = await Reel.findById(reelId)
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");
    io.emit("reelCommented", {
      reelId: reel._id,
      comments: reel.comments.length,
    });
    return res.status(200).json(populatedReel);
  } catch (error) {
    console.error("Error commenting on reel:", error);
    return res.status(500).json({ message: "Comment update error" });
  }
};

export { uploadReel, getAllReels, likes, commentOnReel };
