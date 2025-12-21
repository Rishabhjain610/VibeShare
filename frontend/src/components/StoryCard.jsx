import React from "react";
import { useNavigate } from "react-router-dom";

const StoryCard = ({ user, story, isCurrentUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!story && isCurrentUser) {
      navigate("/upload");
    } else {
      
      navigate(`/story/${user.userName}`);
    }
  };

  return (
    <div
      className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer relative"
      onClick={handleClick} // Added onClick to the main card
    >
      <div
        className={`p-0.5 rounded-full ${
          story
            ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
            : "bg-gray-300"
        }`}
      >
        <div className="p-0.5 bg-white rounded-full relative">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src={user.profilePic || "/image.png"}
            alt={user.name || "User"}
          />
         
          {isCurrentUser && !story && (
            <button
              className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                handleClick();
              }}
            >
              <span className="text-white text-xs font-bold">+</span>
            </button>
          )}
        </div>
      </div>
      <p className="text-xs w-16 truncate text-center text-gray-700">
        {user.name || "Unknown"}
      </p>
    </div>
  );
};

export default StoryCard;
