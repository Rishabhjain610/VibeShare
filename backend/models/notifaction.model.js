import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const notificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment", "message"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    post:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    reel:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Notification = model("Notification", notificationSchema);
export default Notification;
