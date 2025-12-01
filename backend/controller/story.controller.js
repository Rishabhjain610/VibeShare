import User from "../models/user.model.js";
import Story from "../models/story.model.js";
const uploadsStory=async(req,res)=>{
  try {
    const user=await User.findById(req.userId);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    if(user.story){
      const previousStory=await Story.findById(user.story);
      return res.status(400).json({message:"Story already exists"});
    }
  } catch (error) {
    
  }
}