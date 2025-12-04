import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("posts reels saved saved.author");
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const otherUser = async (req, res) => {
  try {
    const otheruser = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json({ otheruser });
  } catch (error) {
    console.error("Error fetching other users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession, gender } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userName && userName !== user.userName) {
      const userNameExists = await User.findOne({ userName: userName });
      if (userNameExists) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    if (req.file) {
      const profilePicUrl = await uploadOnCloudinary(req.file.path);
      if (profilePicUrl) {
        user.profileImage = profilePicUrl;
      }
    }

    if (name) user.name = name;
    if (userName) user.userName = userName;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;
    if (gender) {
      user.gender = gender.charAt(0).toUpperCase() + gender.slice(1);
    }

    await user.save();

    const updatedUser = await User.findById(req.userId).select("-password");

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getprofile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ userName: username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.userId;
    if (!currentUserId || !targetUserId) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);
    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUserId === targetUserId) {
      return res
        .status(400)
        .json({ message: "Users cannot follow themselves" });
    }
    if (currentUser.following.includes(targetUserId)) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }
    await currentUser.save();
    await targetUser.save();
    return res
      .status(200)
      .json({
        message: "Follow status updated successfully",
        currentUser,
        targetUser,
      });
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getCurrentUser, otherUser, editProfile, getprofile, follow };
