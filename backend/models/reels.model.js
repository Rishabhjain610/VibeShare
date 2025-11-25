import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const reelSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    thumbnail: {
      type: String,
    },
    reels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Reel = model("Reel", reelSchema);
export default Reel;
