import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    message: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: true }
);
const Message = model("Message", messageSchema);
export default Message;
