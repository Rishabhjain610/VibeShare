import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const postSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const Post = model("Post", postSchema);
export default Post;
