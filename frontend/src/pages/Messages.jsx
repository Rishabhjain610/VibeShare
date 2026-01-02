
import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Send,
  Users,
  Plus,
  Settings,
  Crown,
  UserMinus,
  LogOut,
  Trash2,
  Edit,
  Smile,
  Image as ImageIcon,
  X,
} from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AuthDataContext } from "../context/AuthContext";
import { setSelectedUser, setMessages } from "../redux/messageSlice";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import EmojiPicker from "emoji-picker-react";
import { SocketDataContext } from "../context/SocketContext";

const Conversation = ({ conversation, isOnline, onSelect, isSelected }) => {
  const participant = conversation.isGroupChat
    ? {
        name: conversation.groupName || "Unnamed Group",
        profileImage: "https://via.placeholder.com/50?text=G",
        userName: "",
      }
    : conversation.participants[0];
  if (!participant) return null;

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-purple-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelect(conversation)}
    >
      <div className="relative flex-shrink-0">
        <img
          src={participant.profileImage || "https://via.placeholder.com/50"}
          alt={`${participant.userName}'s profile`}
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && !conversation.isGroupChat && (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
        )}
        {conversation.isGroupChat && (
          <Users className="absolute bottom-0 right-0 w-4 h-4 text-purple-500 bg-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {participant.name}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {conversation.lastMessage?.message || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [userToManage, setUserToManage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentGroupRef = useRef(null);
  const messagesRef = useRef([]);

  const onlineUsers = useSelector((state) => state.socket.onlineUsers) || [];
  const userData = useSelector((state) => state.user.userData);
  const messages = useSelector((state) => state.message.messages) || [];
  const otherUsers = useSelector((state) => state.user.otherUsers);
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketDataContext);
  const isCurrentUserOnline =
  selectedConversation && !selectedConversation.isGroupChat
    ? onlineUsers.includes(selectedConversation.participants[0]?._id)
    : false;
  // keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/message/chats`, {
          withCredentials: true,
        });
        if (res.data && res.data.conversations) {
          setConversations(res.data.conversations);
          setFilteredConversations(res.data.conversations);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [serverUrl]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }
    const filtered = conversations.filter((conv) => {
      if (conv.isGroupChat) {
        return conv.groupName?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return conv.participants[0]?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  // Robust socket handler: append only relevant messages and scroll
  useEffect(() => {
    if (!socket) return;
    const handler = (mess) => {
      // group payloads from backend should include isGroupChat and groupId
      if (mess.isGroupChat) {
        if (
          selectedConversation?.isGroupChat &&
          String(selectedConversation._id) === String(mess.groupId)
        ) {
          const newList = [...(messagesRef.current || []), mess];
          messagesRef.current = newList;
          dispatch(setMessages(newList));
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
        }
      } else {
        // direct message -> append if this DM is open
        if (!selectedConversation?.isGroupChat) {
          const otherId = selectedConversation?.participants?.[0]?._id;
          if (!otherId) return;
          const senderId = mess.sender?._id || mess.sender;
          const receiverId = mess.receiver?._id || mess.receiver;
          if (
            String(senderId) === String(otherId) ||
            String(receiverId) === String(otherId)
          ) {
            const newList = [...(messagesRef.current || []), mess];
            messagesRef.current = newList;
            dispatch(setMessages(newList));
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
          }
        }
      }
    };
    socket.on("newMessage", handler);
    return () => {
      socket.off("newMessage", handler);
    };
  }, [socket, selectedConversation, dispatch]);

  // fetch messages when conversation selected and join/leave group rooms
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      try {
        let res;
        if (selectedConversation.isGroupChat) {
          res = await axios.get(
            `${serverUrl}/api/message/groups/${selectedConversation._id}/messages`,
            { withCredentials: true }
          );
          const list = res.data.messages || [];
          dispatch(setMessages(list));
          messagesRef.current = list;
          // join group room
          if (socket) {
            if (currentGroupRef.current && currentGroupRef.current !== selectedConversation._id) {
              socket.emit("leaveGroup", currentGroupRef.current);
            }
            socket.emit("joinGroup", selectedConversation._id);
            currentGroupRef.current = selectedConversation._id;
          }
        } else {
          const otherUser = selectedConversation.participants[0];
          dispatch(setSelectedUser(otherUser));
          res = await axios.get(
            `${serverUrl}/api/message/messages/${otherUser._id}`,
            { withCredentials: true }
          );
          const list = res.data.newMessage || [];
          dispatch(setMessages(list));
          messagesRef.current = list;
          // leave any group room when opening DM
          if (socket && currentGroupRef.current) {
            socket.emit("leaveGroup", currentGroupRef.current);
            currentGroupRef.current = null;
          }
        }
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedConversation, serverUrl, dispatch, socket]);

  // cleanup leave room on unmount
  useEffect(() => {
    return () => {
      if (socket && currentGroupRef.current) {
        socket.emit("leaveGroup", currentGroupRef.current);
        currentGroupRef.current = null;
      }
    };
  }, [socket]);

  const handleBack = () => {
    if (selectedConversation) {
      setSelectedConversation(null);
      setShowGroupSettings(false);
      setShowEmojiPicker(false);
      setSelectedImage(null);
      setImagePreview(null);
      dispatch(setSelectedUser(null));
    } else {
      navigate(-1);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (groupParticipants.length < 1) {
      alert("Please select at least one participant");
      return;
    }
    try {
      await axios.post(
        `${serverUrl}/api/message/groups`,
        { groupName, participants: groupParticipants },
        { withCredentials: true }
      );
      setShowGroupModal(false);
      setGroupName("");
      setGroupParticipants([]);
      const convRes = await axios.get(`${serverUrl}/api/message/chats`, {
        withCredentials: true,
      });
      setConversations(convRes.data.conversations);
      setFilteredConversations(convRes.data.conversations);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create group");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

    const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;
  
    try {
      const formData = new FormData();
      if (message.trim()) {
        formData.append("message", message);
      }
      if (selectedImage) {
        formData.append("images", selectedImage);
      }
  
      if (selectedConversation.isGroupChat) {
        await axios.post(
          `${serverUrl}/api/message/groups/${selectedConversation._id}/messages`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axios.post(
          `${serverUrl}/api/message/send/${selectedConversation.participants[0]._id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
  
      // Do NOT append the message here!
      // Just reset the input fields and let the socket event handle UI update.
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      setShowEmojiPicker(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      // Optionally scroll to bottom (socket event will also do this)
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await axios.patch(
        `${serverUrl}/api/message/groups/${selectedConversation._id}/name`,
        { newName: newGroupName },
        { withCredentials: true }
      );
      alert("Group renamed successfully");
      setNewGroupName("");
      const convRes = await axios.get(`${serverUrl}/api/message/chats`, {
        withCredentials: true,
      });
      setConversations(convRes.data.conversations);
      const updated = convRes.data.conversations.find(
        (c) => c._id === selectedConversation._id
      );
      setSelectedConversation(updated);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to rename group");
    }
  };

  const handleRemoveUser = async () => {
    if (!userToManage.trim()) return;
    try {
      await axios.post(
        `${serverUrl}/api/message/groups/${selectedConversation._id}/members/remove`,
        { userName: userToManage },
        { withCredentials: true }
      );
      alert("User removed successfully");
      setUserToManage("");
      const convRes = await axios.get(`${serverUrl}/api/message/chats`, {
        withCredentials: true,
      });
      setConversations(convRes.data.conversations);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove user");
    }
  };

  const handlePromoteUser = async () => {
    if (!userToManage.trim()) return;
    try {
      await axios.post(
        `${serverUrl}/api/message/groups/${selectedConversation._id}/admins/promote`,
        { userName: userToManage },
        { withCredentials: true }
      );
      alert("User promoted to admin");
      setUserToManage("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to promote user");
    }
  };

  const handleDemoteAdmin = async () => {
    if (!userToManage.trim()) return;
    try {
      await axios.post(
        `${serverUrl}/api/message/groups/${selectedConversation._id}/admins/demote`,
        { userName: userToManage },
        { withCredentials: true }
      );
      alert("Admin demoted successfully");
      setUserToManage("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to demote admin");
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      await axios.post(
        `${serverUrl}/api/message/groups/${selectedConversation._id}/leave`,
        {},
        { withCredentials: true }
      );
      alert("Left group successfully");
      setSelectedConversation(null);
      const convRes = await axios.get(`${serverUrl}/api/message/chats`, {
        withCredentials: true,
      });
      setConversations(convRes.data.conversations);
      setFilteredConversations(convRes.data.conversations);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to leave group");
    }
  };

  const handleDeleteGroup = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(
        `${serverUrl}/api/message/groups/${selectedConversation._id}`,
        { withCredentials: true }
      );
      alert("Group deleted successfully");
      setSelectedConversation(null);
      const convRes = await axios.get(`${serverUrl}/api/message/chats`, {
        withCredentials: true,
      });
      setConversations(convRes.data.conversations);
      setFilteredConversations(convRes.data.conversations);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete group");
    }
  };

  const isGroupAdmin =
    selectedConversation?.isGroupChat &&
    selectedConversation.groupAdmins?.some(
      (admin) => admin.toString() === userData._id
    );

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left Column: Conversation List */}
      <div
        className={`${
          selectedConversation ? "hidden" : "flex"
        } md:flex flex-col w-full md:w-1/3 lg:w-1/4 border-r border-gray-200`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <button
            className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            onClick={() => setShowGroupModal(true)}
            title="Create Group"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages or groups"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <p className="text-center text-gray-500 mt-4">Loading...</p>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <Conversation
                key={conv._id}
                conversation={conv}
                onSelect={setSelectedConversation}
                isSelected={selectedConversation?._id === conv._id}
                isOnline={
                  conv.isGroupChat
                    ? false
                    : onlineUsers.includes(conv.participants[0]?._id)
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No conversations found.
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div
        className={`${
          !selectedConversation ? "hidden" : "flex"
        } md:flex flex-col flex-1`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2 md:hidden"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img
                    src={
                      selectedConversation.isGroupChat
                        ? "https://via.placeholder.com/40"
                        : selectedConversation.participants[0]?.profileImage ||
                          "https://via.placeholder.com/40"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {isCurrentUserOnline && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold text-lg">
                    {selectedConversation.isGroupChat
                      ? selectedConversation.groupName
                      : selectedConversation.participants[0]?.name}
                  </h2>
                  {selectedConversation.isGroupChat ? (
                    <p className="text-xs text-gray-500">
                      {selectedConversation.participants.length} members
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {isCurrentUserOnline ? "Online" : "Offline"}
                    </p>
                  )}
                </div>
              </div>
              {selectedConversation.isGroupChat && (
                <button
                  onClick={() => setShowGroupSettings(!showGroupSettings)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Group Settings Panel */}
            {showGroupSettings && selectedConversation.isGroupChat && (
              <div className="p-4 border-b border-gray-200 bg-gray-50 max-h-64 overflow-y-auto">
                <h3 className="font-bold mb-3">Group Settings</h3>

                {isGroupAdmin && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-semibold mb-1">
                        Rename Group
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="New group name"
                          className="flex-1 p-2 border rounded text-sm"
                        />
                        <button
                          onClick={handleRenameGroup}
                          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-semibold mb-1">
                        Manage User
                      </label>
                      <input
                        type="text"
                        value={userToManage}
                        onChange={(e) => setUserToManage(e.target.value)}
                        placeholder="Enter username"
                        className="w-full p-2 border rounded text-sm mb-2"
                      />
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={handlePromoteUser}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1"
                        >
                          <Crown size={14} /> Promote
                        </button>
                        <button
                          onClick={handleDemoteAdmin}
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm flex items-center gap-1"
                        >
                          <UserMinus size={14} /> Demote
                        </button>
                        <button
                          onClick={handleRemoveUser}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-1"
                        >
                          <UserMinus size={14} /> Remove
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleDeleteGroup}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center justify-center gap-1 mb-2"
                    >
                      <Trash2 size={16} /> Delete Group
                    </button>
                  </>
                )}

                <button
                  onClick={handleLeaveGroup}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center justify-center gap-1"
                >
                  <LogOut size={16} /> Leave Group
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages && messages.length > 0 ? (
                messages.map((msg) =>
                  msg.sender?._id === userData._id ? (
                    <SenderMessage message={msg} key={msg._id} />
                  ) : (
                    <ReceiverMessage message={msg} key={msg._id} />
                  )
                )
              ) : (
                <p className="text-center text-gray-400">No messages yet.</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="p-2 border-t border-gray-200 bg-white">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 right-4 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="relative flex items-center gap-2">
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!message.trim() && !selectedImage}
                  className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-300"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-500">
            <h2 className="text-2xl font-semibold">Select a chat</h2>
            <p>Choose from your existing conversations to start chatting.</p>
          </div>
        )}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateGroup}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Create Group</h2>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Add Participants:
              </label>
              <div className="max-h-40 overflow-y-auto">
                {otherUsers
                  ?.filter((u) => u._id !== userData._id)
                  .map((user) => (
                    <label key={user._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={groupParticipants.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGroupParticipants([
                              ...groupParticipants,
                              user._id,
                            ]);
                          } else {
                            setGroupParticipants(
                              groupParticipants.filter((id) => id !== user._id)
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <img
                        src={
                          user.profileImage || "https://via.placeholder.com/30"
                        }
                        alt={user.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{user.name}</span>
                    </label>
                  ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;