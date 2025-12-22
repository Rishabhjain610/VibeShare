import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { X, Eye, Heart } from "lucide-react"; // Import Heart icon
import ViewersModal from "./ViewersModal";
import { AuthDataContext } from "../context/AuthContext.jsx"; // To get serverUrl
import { StoryDataContext } from "../context/StoryContext.jsx"; // To update story data locally

const StoryCard2 = ({ story }) => {
  const [progress, setProgress] = useState(0);
  const [isViewersModalOpen, setIsViewersModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get contexts and Redux state
  const { serverUrl } = useContext(AuthDataContext);
  const { setStoryData } = useContext(StoryDataContext);
  const currentUser = useSelector((state) => state.user.userData);

  // Determine story ownership and initial like state
  const isOwnStory = currentUser?.userName === story.author?.userName;
  const [isLiked, setIsLiked] = useState(
    story.likes?.some((like) => like._id === currentUser?._id)
  );
  const [likeCount, setLikeCount] = useState(story.likes?.length || 0);

  // Effect for story progress timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate(-1);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [story, navigate]);

  // Function to handle liking/unliking a story
  const handleLike = async () => {
    if (isOwnStory) return; // Author cannot like their own story

    // Optimistic UI update for instant feedback
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await axios.get(
        `${serverUrl}/api/story/likestory/${story._id}`,
        { withCredentials: true }
      );
      // Update the story data in context with the final state from the server
      setStoryData(response.data);
      // Re-sync local state with server response
      setIsLiked(response.data.likes.some((like) => like._id === currentUser?._id));
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error("Error liking story:", error);
      // Revert UI on error
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="relative w-[360px] h-[640px] bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Media Content */}
          {story.mediaType === "video" ? (
            <video src={story.media} autoPlay loop muted className="w-full h-full object-cover" />
          ) : (
            <img src={story.media} alt="Story content" className="w-full h-full object-cover" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60"></div>

          {/* Header */}
          <div className="absolute top-0 left-0 w-full p-4 z-10">
            <div className="w-full bg-white/20 h-1 rounded-full mb-3">
              <div className="bg-white h-1 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={story.author?.profileImage || "/image.png"} alt={story.author?.userName} className="w-10 h-10 rounded-full border-2 border-white/90 object-cover" />
                <span className="text-white font-bold text-sm">{story.author?.userName}</span>
              </div>
              <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10" aria-label="Close story">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Footer with Viewers, Caption, and Like Button */}
          <div className="absolute bottom-0 left-0 w-full p-5 z-10 flex justify-between items-end">
            {/* Viewers Icon (only on own story) */}
            {isOwnStory ? (
              <button onClick={() => setIsViewersModalOpen(true)} className="flex items-center gap-2 text-white/80 hover:text-white">
                <Eye size={20} />
                <span className="font-semibold text-sm">{story.viewers?.length || 0}</span>
              </button>
            ) : (
              <div></div> // Spacer
            )}

            {/* Caption */}
            {story.caption && (
              <div className="flex-1 text-center px-4">
                <p className="text-white text-base drop-shadow-lg">{story.caption}</p>
              </div>
            )}

            {/* Like Button (not on own story) */}
            {!isOwnStory && (
              <button onClick={handleLike} className="flex flex-col items-center gap-1 text-white/80 hover:text-white">
                <Heart
                  size={24}
                  className={`transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
                />
                <span className="font-semibold text-xs">{likeCount}</span>
              </button>
            )}
            {isOwnStory && <div className="w-12"></div>} {/* Spacer to balance viewers icon */}
          </div>
        </div>
      </div>

      {isViewersModalOpen && (
        <ViewersModal viewers={story.viewers} onClose={() => setIsViewersModalOpen(false)} />
      )}
    </>
  );
};

export default StoryCard2;