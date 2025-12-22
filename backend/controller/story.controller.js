import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const uploadsStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.story) {
      const previousStory = await Story.findById(user.story);
      if (previousStory) {
        await Story.findByIdAndDelete(previousStory._id);
      }
      user.story = null;
      await user.save();
    }
    const { mediaType } = req.body;
    let media;
    if (req.file) {
      const mediaUrl = await uploadOnCloudinary(req.file.path);
      media = mediaUrl;
    } else {
      return res.status(400).json({ message: "Story must have media" });
    }
    const story = await Story.create({
      author: req.userId,
      media,
      mediaType,
    });
    user.story = story._id;

    await user.save();
    const populateStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(201).json(populateStory);
  } catch (error) {
    console.error("Error uploading story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (
      story.author.toString() !== req.userId &&
      !story.viewers.includes(req.userId)
    ) {
      story.viewers.push(req.userId);
      await story.save();
    }
    const populateStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(200).json(populateStory);
  } catch (error) {
    console.error("Error viewing story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likeStory=async(req,res)=>{
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if(story.author.toString()===req.userId){
      return res.status(400).json({ message: "Author cannot like their own story" });
    }
    else{
    if(story.likes.includes(req.userId)){
      story.likes.pull(req.userId);
    }
    else{
      story.likes.push(req.userId);
    }
    await story.save();
    const populateStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("likes", "name userName profileImage");
    return res.status(200).json(populateStory);
  }
  } catch (error) {
    console.error("Error liking story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const getStoryByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.story) {
      return res.status(404).json({ message: "Story not found" });
    }
    const story = await Story.findById(user.story);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    const populateStory = await Story.findById(user.story)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(200).json(populateStory);
  } catch (error) {
    console.error("Error fetching story:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getFollowedStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const followedUserIds = currentUser.following;
    const stories = await Story.find({ author: { $in: followedUserIds } })
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");
    return res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching followed stories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { uploadsStory, viewStory, getStoryByUsername, getFollowedStories, likeStory };
