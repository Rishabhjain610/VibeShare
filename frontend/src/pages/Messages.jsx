import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Send } from 'lucide-react';
import axios from 'axios';

// Mock context for online users - replace with your actual Socket.IO context
const useSocketContext = () => ({ onlineUsers: [] });

// --- Reusable Conversation Component ---
const Conversation = ({ conversation, isOnline, onSelect, isSelected }) => {
  const participant = conversation.participants[0];
  if (!participant) return null;

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-purple-100' : 'hover:bg-gray-100'
      }`}
      onClick={() => onSelect(conversation)}
    >
      <div className='relative flex-shrink-0'>
        <img
          src={participant.profileImage || 'https://via.placeholder.com/50'}
          alt={`${participant.userName}'s profile`}
          className='w-12 h-12 rounded-full object-cover'
        />
        {isOnline && (
          <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white'></span>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='font-semibold text-gray-800 truncate'>{participant.name}</p>
        <p className='text-sm text-gray-500 truncate'>
          {conversation.lastMessage?.message || 'No messages yet'}
        </p>
      </div>
    </div>
  );
};

// --- Main Messages Page ---
const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/message/chats", { withCredentials: true });
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
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }
    const filtered = conversations.filter(conv =>
      conv.participants[0]?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const handleBack = () => {
    if (selectedConversation) {
      setSelectedConversation(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left Column: Conversation List */}
      <div
        className={`
          ${selectedConversation ? 'hidden' : 'flex'} md:flex flex-col 
          w-full md:w-1/3 lg:w-1/4 
          border-r border-gray-200
        `}
      >
        <div className="flex items-center p-4 border-b border-gray-200">
           <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search messages'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
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
                isOnline={onlineUsers.includes(conv.participants[0]?._id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No conversations found.</p>
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div className={`
        ${!selectedConversation ? 'hidden' : 'flex'} md:flex flex-col 
        flex-1
      `}>
        {selectedConversation ? (
          <>
            <div className="flex items-center p-3 border-b border-gray-200 bg-white sticky top-0">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2 md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <img
                src={selectedConversation.participants[0].profileImage || 'https://via.placeholder.com/40'}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <h2 className="font-semibold text-lg">{selectedConversation.participants[0].name}</h2>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {/* Message components will go here */}
              <p className="text-center text-gray-400">Chat history will appear here.</p>
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-gray-100 border border-gray-200 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="absolute right-2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-500">
            <h2 className="text-2xl font-semibold">Select a chat</h2>
            <p>Choose from your existing conversations to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;