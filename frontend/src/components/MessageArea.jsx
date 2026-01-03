
import React, { useState, useRef, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Image, X, FileText } from "lucide-react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { setMessages } from "../redux/messageSlice.js";
import SenderMessage from "./SenderMessage.jsx";
import ReceiverMessage from "./ReceiverMessage.jsx";
import { SocketDataContext } from "../context/SocketContext";
import EmojiPicker from "emoji-picker-react";

const MessageArea = () => {
  const navigate = useNavigate();
  const { selectedUser, messages } = useSelector((state) => state.message);
  const userData = useSelector((state) => state.user.userData);
  const { socket } = useContext(SocketDataContext);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [summary, setSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(messages || []);
  const dispatch = useDispatch();
  const { serverUrl } = useContext(AuthDataContext);

  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const getAllMessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/messages/${selectedUser._id}`,
        { withCredentials: true }
      );
      dispatch(setMessages(result.data.newMessage));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      getAllMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      const handler = (mess) => {
        const newList = [...(messagesRef.current || []), mess];
        messagesRef.current = newList;
        dispatch(setMessages(newList));
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
      };
      socket.on("newMessage", handler);
      return () => {
        socket.off("newMessage", handler);
      };
    }
  }, [socket, dispatch]);

  const handleSummarize = async () => {
    if (!messages || messages.length === 0) {
      alert("No messages to summarize");
      return;
    }
    try {
      setSummarizing(true);
      const res = await axios.post(
        `${serverUrl}/api/message/summary`,
        { messages },
        { withCredentials: true }
      );
      setSummary(res.data.summary || res.data);
      setShowSummary(true);
    } catch (err) {
      console.error("Summary error:", err);
      alert("Failed to summarize messages");
    } finally {
      setSummarizing(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !backendImage) return;

    const formData = new FormData();
    if (backendImage) {
      formData.append("images", backendImage);
    }
    if (message.trim()) {
      formData.append("message", message);
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newList = [...(messagesRef.current || []), result.data.newMessage];
      messagesRef.current = newList;
      dispatch(setMessages(newList));

      setMessage("");
      handleRemoveImage();
      setShowEmojiPicker(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-screen bg-white items-center justify-center text-gray-500">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h2 className="text-2xl font-semibold">Select a user to chat</h2>
        <p>Choose a user from their profile to start a conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <img
            src={selectedUser.profileImage || "https://via.placeholder.com/40"}
            alt={`${selectedUser.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h2 className="font-semibold text-lg">{selectedUser.name}</h2>
            <p className="text-sm text-gray-500">@{selectedUser.userName}</p>
          </div>
        </div>
        {/* Summarize Button */}
        <button
          onClick={handleSummarize}
          disabled={summarizing || !messages || messages.length === 0}
          title="Summarize chat"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <FileText className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages &&
          messages.map((msg) => {
            return msg.sender?._id === userData._id ? (
              <SenderMessage message={msg} key={msg._id} />
            ) : (
              <ReceiverMessage message={msg} key={msg._id} />
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white">
        {frontendImage && (
          <div className="p-4 relative w-fit">
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            <img
              src={frontendImage}
              alt="Selected preview"
              className="h-24 w-auto rounded-lg"
            />
          </div>
        )}

        {showEmojiPicker && (
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="p-4 pt-0 flex items-center gap-2"
        >
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImage}
            accept="image/*"
            className="hidden"
          />
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-gray-100 border border-gray-200 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 p-1 text-gray-500 hover:text-purple-600 transition-colors"
              aria-label="Add emoji"
            >
              <Smile size={22} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => imageInputRef.current.click()}
            className="p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Attach image"
          >
            <Image size={24} />
          </button>
          <button
            type="submit"
            className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            disabled={!message.trim() && !backendImage}
            aria-label="Send message"
          >
            <Send size={22} />
          </button>
        </form>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg p-4 max-h-96 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Chat Summary</h3>
              <button
                onClick={() => setShowSummary(false)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto text-sm flex-1">
              <pre className="whitespace-pre-wrap font-sans">{String(summary)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageArea;