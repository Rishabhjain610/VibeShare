import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    post:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }
    ],
    saved:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }
    ],
    story:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    }
  },
  {
    timestamps: true,
  }
);
const User = model("User", userSchema);
export default User;
