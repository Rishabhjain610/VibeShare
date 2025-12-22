import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const consversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupAdmins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chatSummary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Conversation = model("Conversation", consversationSchema);
export default Conversation;
