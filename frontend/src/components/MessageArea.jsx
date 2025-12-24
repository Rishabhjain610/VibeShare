import React, { useState, useRef, useContext, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Image, X } from "lucide-react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { setMessages } from "../redux/messageSlice.js";
const MessageArea = () => {
  const navigate = useNavigate();
  const { selectedUser, messages } = useSelector((state) => state.message);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const imageInputRef = useRef(null);
  const dispatch = useDispatch();
  const { serverUrl } = useContext(AuthDataContext);
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
      imageInputRef.current.value = ""; // Reset file input
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        {
          message,
        },
        { withCredentials: true }
      );
      console.log("Message sent:", result.data);
      dispatch(setMessages([...messages,result.data.newMessages]));
      setMessage("");
      handleRemoveImage();

    } catch (error) {
      console.error("Error sending message:", error);

    }
    // Clear images after sending
  };

  // If no user is selected (e.g., direct navigation), show a placeholder.
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
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
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

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {/* Placeholder for chat messages */}
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <p className="font-medium">
            This is the beginning of your conversation with {selectedUser.name}.
          </p>
          <p className="text-sm">Messages you send will appear here.</p>
        </div>
      </div>

      {/* Message Input Section */}
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
    </div>
  );
};

export default MessageArea;
