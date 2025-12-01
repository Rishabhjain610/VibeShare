import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const storySchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 24 * 60 * 60, // Story expires after 24 hours
    },
  },
  {
    timestamps: true,
  }
);
const Story = model("Story", storySchema);
export default Story;
