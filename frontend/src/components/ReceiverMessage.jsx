import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const ReceiverMessage = ({ message }) => {
  const { selectedUser } = useSelector((state) => state.message); // Fixed: was state.message.messages
  
  if (!message) {
    return null;
  }

  const scroll = useRef(null);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.images]);

  const sentTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // For group chats, use message.sender; for direct chats, use selectedUser
  const senderInfo = message.sender || selectedUser;

  return (
    <div ref={scroll} className="flex justify-start mb-4 items-end">
      <img
        src={senderInfo?.profileImage || "https://via.placeholder.com/40"}
        alt="Receiver profile"
        className="w-8 h-8 rounded-full object-cover mr-3"
      />
      <div className="flex flex-col items-start max-w-xs lg:max-w-md">
        
        <div className="bg-gray-300 text-gray-800 rounded-r-lg rounded-tl-lg p-3">
          {message.images && message.images.length > 0 && (
            <div className="mb-2 flex flex-col gap-2">
              {message.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Sent content"
                  className="rounded-lg w-full"
                />
              ))}
            </div>
          )}
          {message.message && <p className="text-sm">{message.message}</p>}
        </div>
        <span className="text-xs text-gray-500 mt-1">{sentTime}</span>
      </div>
    </div>
  );
};

export default ReceiverMessage;