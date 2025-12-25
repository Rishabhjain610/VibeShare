import express from "express";
import {
  sendMessage,
  getMessages,
  getPrevUserChats,
  createGroupChat,
  sendmessageingrp,
  renameGroup,
  removeUserFromGroup,
  getGroupMessages,
  promoteToAdmin,
  demoteAdmin,
  leaveGroup,
  deletegrp,
} from "../controller/message.contoller.js";
import isAuth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const MessageRouter = express.Router();

// Direct Messages
MessageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("images"),
  sendMessage
); // Send a direct message
MessageRouter.get("/messages/:receiver", isAuth, getMessages); // Get messages with a specific user
MessageRouter.get("/chats", isAuth, getPrevUserChats); // Get previous user chats

// Group Chats
MessageRouter.post("/groups", isAuth, createGroupChat); // Create a new group chat
MessageRouter.post(
  "/groups/:groupId/messages",
  isAuth,
  upload.single("images"),
  sendmessageingrp
); // Send a message in a group
MessageRouter.get("/groups/:groupId/messages", isAuth, getGroupMessages); // Get all messages in a group
MessageRouter.patch("/groups/:groupId/name", isAuth, renameGroup); // Rename a group
MessageRouter.post(
  "/groups/:groupId/members/remove",
  isAuth,
  removeUserFromGroup
); // Remove a user from a group
MessageRouter.post("/groups/:groupId/admins/promote", isAuth, promoteToAdmin); // Promote a user to admin
MessageRouter.post("/groups/:groupId/admins/demote", isAuth, demoteAdmin); // Demote an admin
MessageRouter.post("/groups/:groupId/leave", isAuth, leaveGroup); // Leave a group
MessageRouter.delete("/groups/:groupId", isAuth, deletegrp); // Delete a group

export default MessageRouter;
