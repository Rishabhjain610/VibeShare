import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // A nice icon for a close/back button

const StoryCard2 = ({ story }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Effect for story progress and auto-navigation
  useEffect(() => {
    // 5-second timer for the story
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          navigate(-1); // Navigate back when story finishes
          return 100;
        }
        return prev + 2; // 100 / 2 = 50 steps. 50 * 100ms = 5000ms = 5s
      });
    }, 100);

    return () => clearInterval(timer);
  }, [story, navigate]); // Reset progress and timer if the story or navigate function changes

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="relative w-[360px] h-[640px] bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Conditional Rendering for Image or Video */}
        {story.mediaType === "video" ? (
          <video
            src={story.media}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={story.media}
            alt="Story content"
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60"></div>

        {/* Header with User Info, Progress Bar, and Back Button */}
        <div className="absolute top-0 left-0 w-full p-4 z-10">
          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-1 rounded-full mb-3">
            <div
              className="bg-white h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={story.author?.profileImage || "/image.png"}
                alt={story.author?.userName || "User"}
                className="w-10 h-10 rounded-full border-2 border-white/90 object-cover"
              />
              <span className="text-white font-bold text-sm tracking-wide">
                {story.author?.userName || "Unknown"}
              </span>
            </div>
            {/* Back/Close Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close story"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Caption at the bottom */}
        {story.caption && (
          <div className="absolute bottom-0 left-0 w-full p-5 z-10">
            <p className="text-white text-center text-base drop-shadow-lg">
              {story.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCard2;