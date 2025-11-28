import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
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
const editProfile=async(req,res)=>{
  try {
    const {name,username,bio,profession,gender}=req.body;
    const user=await User.findById(req.userId);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const userNameExists=await User.findOne({userName:username});
    if(userNameExists && userNameExists._id.toString()!==req.userId){
      return res.status(400).json({message:"Username already taken"});
    }
    let profileImage
    if(req.file){ 
      profileImage = await uploadOnCloudinary(req.file.path);
    }
    user.name = name;
    user.userName = username;
    user.profileImage = profileImage;
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;
    user.profileImage = profileImage
    await user.save();
    return res.status(200).json({message:"Profile updated successfully", user});
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({message:"Internal server error"});
    
  }
}
const getprofile=async(req,res)=>{
  try {
    const username=await req.params.username;
    const user=await User.findOne({userName:username}).select("-password");
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
}




export { getCurrentUser, otherUser,editProfile,getprofile };
