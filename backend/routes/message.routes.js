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

const MessageRouter = express.Router();

// Direct Messages
MessageRouter.post("/send/:receiver", sendMessage); // Send a direct message
MessageRouter.get("/messages/:receiver", getMessages); // Get messages with a specific user
MessageRouter.get("/chats", getPrevUserChats); // Get previous user chats

// Group Chats
MessageRouter.post("/groups", createGroupChat); // Create a new group chat
MessageRouter.post("/groups/:groupId/messages", sendmessageingrp); // Send a message in a group
MessageRouter.get("/groups/:groupId/messages", getGroupMessages); // Get all messages in a group
MessageRouter.patch("/groups/:groupId/name", renameGroup); // Rename a group
MessageRouter.post("/groups/:groupId/members/remove", removeUserFromGroup); // Remove a user from a group
MessageRouter.post("/groups/:groupId/admins/promote", promoteToAdmin); // Promote a user to admin
MessageRouter.post("/groups/:groupId/admins/demote", demoteAdmin); // Demote an admin
MessageRouter.post("/groups/:groupId/leave", leaveGroup); // Leave a group
MessageRouter.delete("/groups/:groupId", deletegrp); // Delete a group

export default MessageRouter;