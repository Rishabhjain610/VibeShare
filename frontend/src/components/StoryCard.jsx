import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDataContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import axios from "axios";

const StoryCard = ({ user, story, isCurrentUser }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const navigate = useNavigate();
  
  // Get the current logged-in user from Redux to check their ID
  const currentUser = useSelector((state) => state.user.userData);

  // Determine if the current user has already viewed this story
  const hasViewed = story?.viewers?.some(viewer => viewer._id === currentUser?._id);

  const handleViewStory = async () => {
    // Don't re-register a view if the story has already been seen or doesn't exist
    if (!story || hasViewed) return;
    try {
      await axios.get(`${serverUrl}/api/story/viewstory/${story._id}`, { withCredentials: true });
    } catch (error) {
      console.error("Error viewing story:", error);
    }
  };

  const handleClick = async () => {
    if (!story && isCurrentUser) {
      navigate("/upload");
    } else if (story) { // Only navigate if there is a story
      await handleViewStory();
      navigate(`/story/${user.userName}`);
    }
  };

  // Function to determine the border style based on the story's state
  const getBorderClass = () => {
    if (isCurrentUser) {
      // If the current user has a story, its border is always gray.
      // If not, it's the "Add Story" button, so no border is needed.
      return story ? "bg-gray-300" : "bg-transparent";
    }
    if (story && !hasViewed) {
      // Unviewed story: Colorful gradient border
      return "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500";
    }
    if (story && hasViewed) {
      // Viewed story: Simple gray border
      return "bg-gray-300";
    }
    // No story (the "Add Story" button for the current user): No border
    return "bg-transparent";
  };

  return (
    <div
      className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer relative"
      onClick={handleClick}
    >
      <div
        // Apply the dynamic border class here
        className={`p-0.5 rounded-full ${getBorderClass()}`}
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
                e.stopPropagation();
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