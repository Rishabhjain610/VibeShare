import Reel from "../models/reels.model.js";
import User from "../models/user.model.js";
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
    const populatedReel= await Reel.findById(newReel._id).populate(
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
    const reels=await Reel.find({}).populate(
      "author",
      "name userName profileImage"
    ).populate("comments.author","name userName profileImage");
    return res.status(200).json(reels);
    
  } catch (error) {
    console.error("Error fetching reels:", error);
    return res.status(500).json({ message: "getallreels error" });
  }
}

const likes=async(req,res)=>{
  try {
    const reelId=req.params.reelId;
    const reel=await Reel.findById(reelId);
    if(!reel){
      return res.status(404).json({message: "Reel not found"});
    }
    if(reel.likes.includes(req.userId)){
      reel.likes.pull(req.userId);
    }else{
      reel.likes.push(req.userId);
    }
    await reel.save();
    return res.status(200).json(reel);
  } catch (error) {
    console.error("Error updating likes:", error);
    return res.status(500).json({ message: "Like update error" });
  }
}




const commentOnReel=async(req,res)=>{
  try {
    const reelId=req.params.reelId;
    const {comment}=req.body;
    const reel=await Reel.findById(reelId);

    if(!reel){
      return res.status(400).json({message:"Reel ID is required"});
    }
    const user=await User.findById(req.userId);
    reel.comments.push({
      author: user._id,
      comment: comment,
    });

    await reel.save();
    reel.populate("author", "name userName profileImage");
    reel.populate("comments.author");
    return res.status(200).json(reel);
  } catch (error) {
    console.error("Error commenting on reel:", error);
    return res.status(500).json({ message: "Comment update error" });
  }
}





export { uploadReel, getAllReels, likes, commentOnReel};