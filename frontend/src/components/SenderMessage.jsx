import React from "react";
import { useSelector } from "react-redux";

const SenderMessage = ({ message }) => {
  const { userData } = useSelector((state) => state.user);

  if (!message) {
    return null;
  }

  const sentTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex justify-end mb-4 items-end">
      <div className="flex flex-col items-end max-w-xs lg:max-w-md">
        <div className="bg-purple-600 text-white rounded-l-lg rounded-tr-lg p-3">
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
      <img
        src={userData?.profileImage || "https://via.placeholder.com/40"}
        alt="Your profile"
        className="w-8 h-8 rounded-full object-cover ml-3"
      />
    </div>
  );
};

export default SenderMessage;