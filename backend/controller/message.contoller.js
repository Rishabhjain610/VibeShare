import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";
const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;
    let images;

    if (req.file) {
      const url = await uploadOnCloudinary(req.file.path);
      images = [url];
    }

    // Require at least text or image
    if ((!message || !message.trim()) && !images?.length) {
      return res.status(400).json({ message: "Provide text or an image." });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
      isGroupChat: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        isGroupChat: false,
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message: message || "",
      images: images || [],
    });
    await newMessage.populate("sender", "name userName profileImage");
    await newMessage.populate("receiver", "name userName profileImage");
    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;
    await conversation.save();
    const receiverSocketId = getSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Notify
      // }receiver in real-time
    }
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
      isGroupChat: false,
    }).populate({
      path: "messages",
      populate: [
        { path: "sender", select: "name userName profileImage" },
        { path: "receiver", select: "name userName profileImage" },
      ],
      options: { sort: { createdAt: 1 } },
    });

    if (!conversation) {
      return res.status(200).json({ newMessage: [] });
    }

    res.status(200).json({ newMessage: conversation.messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "name userName profileImage")
      .populate("lastMessage", "sender message createdAt")
      .sort({ updatedAt: -1 })
      .limit(20);

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== currentUserId
      );
    });

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("getPrevUserChats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const { groupName, participants = [] } = req.body;
    const admin = req.userId;

    if (!groupName) {
      return res
        .status(400)
        .json({ message: "Group name and participants are required" });
    }
    const allParticipants = [...new Set([admin, ...participants])];
    if (allParticipants.length < 2) {
      return res.status(400).json({
        message:
          "At least two participants are required to create a group chat",
      });
    }
    const newGroupChat = await Conversation.create({
      groupName: groupName,
      isGroupChat: true,
      participants: allParticipants,
      groupAdmins: [admin],
    });
    await newGroupChat.populate("participants", "name userName profileImage");
    await newGroupChat.populate("groupAdmins", "name userName profileImage");
    return res.status(201).json({
      message: "Group chat created successfully",
      groupChat: newGroupChat,
    });
  } catch (error) {
    console.error("createGroupChat error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const isMember = (conv, userId) =>
  conv.participants.some((p) => p.toString() === userId);
const isAdmin = (conv, userId) =>
  conv.groupAdmins.some((a) => a.toString() === userId);

const sendmessageingrp = async (req, res) => {
  try {
    const sender = req.userId;
    const { groupId } = req.params;
    const { message } = req.body;
    let images;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isMember(conversation, sender)) {
      return res.status(403).json({ message: "Not a group member." });
    }
    if (req.file) {
      const url = await uploadOnCloudinary(req.file.path);
      images = [url];
    }
    if ((!message || !message.trim()) && !images?.length) {
      return res.status(400).json({ message: "Provide text or an image." });
    }
    const newMessage = await Message.create({
      sender,
      message: message || "",
      images: images || [],
    });
    await newMessage.populate("sender", "name userName profileImage");
    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    console.error("sendImageingrp error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const renameGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const { newName } = req.body;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isAdmin(conversation, userId)) {
      return res
        .status(403)
        .json({ message: "Only group admins can rename the group." });
    }
    conversation.groupName = newName;
    await conversation.save();
    res
      .status(200)
      .json({ message: "Group renamed successfully", conversation });
  } catch (error) {
    console.error("renameGroup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userName } = req.body;
    const adminId = req.userId;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isAdmin(conversation, adminId)) {
      return res
        .status(403)
        .json({ message: "Only group admins can remove users." });
    }
    const userToRemove = await User.findOne({ userName: userName });
    if (!userToRemove) {
      return res.status(404).json({ message: "User not found" });
    }
    conversation.participants = conversation.participants.filter(
      (participant) => participant.toString() !== userToRemove._id.toString()
    );
    conversation.groupAdmins = conversation.groupAdmins.filter(
      (a) => a.toString() !== userToRemove._id.toString()
    );
    await conversation.save();
    res
      .status(200)
      .json({ message: "User removed from group successfully", conversation });
  } catch (error) {
    console.error("removeUserFromGroup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const conversation = await Conversation.findById(groupId).populate({
      path: "messages",
      populate: [
        { path: "sender", select: "name userName profileImage" },
        { path: "receiver", select: "name userName profileImage" },
      ],
      options: { sort: { createdAt: 1 } },
    });
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isMember(conversation, userId)) {
      return res.status(403).json({ message: "Not a group member." });
    }
    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("getGroupMessages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userName } = req.body;
    const adminId = req.userId;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isAdmin(conversation, adminId)) {
      return res
        .status(403)
        .json({ message: "Only group admins can promote users." });
    }
    const userToPromote = await User.findOne({ userName: userName });
    if (!userToPromote) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!isMember(conversation, userToPromote._id.toString())) {
      return res.status(400).json({ message: "User is not a group member." });
    }
    if (isAdmin(conversation, userToPromote._id.toString())) {
      return res.status(400).json({ message: "User is already an admin." });
    }
    conversation.groupAdmins.push(userToPromote._id);
    await conversation.save();
    res
      .status(200)
      .json({ message: "User promoted to admin successfully", conversation });
  } catch (error) {
    console.error("promoteToAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const demoteAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userName } = req.body;
    const adminId = req.userId;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isAdmin(conversation, adminId)) {
      return res
        .status(403)
        .json({ message: "Only group admins can demote users." });
    }
    if (conversation.groupAdmins.length <= 1) {
      return res
        .status(400)
        .json({ message: "At least one admin is required in the group." });
    }
    const userToDemote = await User.findOne({ userName: userName });
    if (!userToDemote) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!isAdmin(conversation, userToDemote._id.toString())) {
      return res.status(400).json({ message: "User is not an admin." });
    }
    conversation.groupAdmins = conversation.groupAdmins.filter(
      (a) => a.toString() !== userToDemote._id.toString()
    );
    await conversation.save();
    res
      .status(200)
      .json({ message: "User demoted from admin successfully", conversation });
  } catch (error) {
    console.error("demoteAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isMember(conversation, userId)) {
      return res.status(403).json({ message: "Not a group member." });
    }
    conversation.participants = conversation.participants.filter(
      (participant) => participant.toString() !== userId
    );
    conversation.groupAdmins = conversation.groupAdmins.filter(
      (a) => a.toString() !== userId
    );
    await conversation.save();
    res.status(200).json({ message: "Left group successfully", conversation });
  } catch (error) {
    console.error("leaveGroup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletegrp = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const conversation = await Conversation.findById(groupId);
    if (!conversation || !conversation.isGroupChat) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!isAdmin(conversation, userId)) {
      return res
        .status(403)
        .json({ message: "Only group admins can delete the group." });
    }
    await Message.deleteMany({ _id: { $in: conversation.messages } });
    await Conversation.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("deletegrp error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
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
};
