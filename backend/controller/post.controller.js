import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const uploadPost = async (req, res) => {
  try {
    const { mediaType, caption } = req.body;
    let media;
    if (req.file) {
      const mediaUrl = await uploadOnCloudinary(req.file.path);
      media = mediaUrl;
    }
    if (!media) {
      return res
        .status(400)
        .json({ message: "Post must have media or caption" });
    }
    const newPost = await Post.create({
      mediaType,
      media,
      caption,
      author: req.userId,
      likes: [],
    });
    const user = await User.findById(req.userId);
    user.posts.push(newPost._id);
    await user.save();
    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name userName profileImage"
    );
    //     {
    //   "media": "some_url",
    //   "caption": "My first post!",
    //   "author": "60c72b2f9b1d8c001f8e4b22" // Just an ID
    // } this will be converted to
    // {
    //   "media": "some_url",
    //   "caption": "My first post!",
    //   "author": { // The ID is replaced with the user object
    //     "name": "John Doe",
    //     "userName": "johndoe",
    //     "profileImage": "http://..."
    //   }
    // } to this using populate
    return res
      .status(201)
      .json({ message: "Post uploaded successfully", post: populatedPost });
  } catch (error) {
    console.error("Error uploading post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });
      posts.forEach((post) => {
      if (!post.likes) {
        post.likes = [];
      }
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(req.userId)) {
      post.likes.pull(req.userId);
    } else {
      post.likes.push(req.userId);
    }
    await post.save();
    return res
      .status(200)
      .json({ message: "Post like status updated", post: post });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    const post = await Post.findById(postId);
    const user = await User.findById(req.userId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ author: req.userId, comment });
    await post.save();
    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author");
    return res
      .status(200)
      .json({ message: "Comment added successfully", post: post });
  } catch (error) {
    console.error("Error commenting on post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const savedPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.saved.includes(postId)) {
      user.saved.pull(postId);
    } else {
      user.saved.push(postId);
    }
    await user.save();
    const populatedUser = await User.findById(req.userId).populate({
      path: "saved",
      select: "media caption author",
      populate: {
        path: "author",
        select: "name userName profileImage",
      },
    });
    return res
      .status(200)
      .json({ message: "Saved posts updated successfully", user: populatedUser });
  } catch (error) {
    console.error("Error updating saved posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { uploadPost, getAllPosts, likes, commentOnPost, savedPosts };
