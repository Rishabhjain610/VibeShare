import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Music,
  Volume2,
  Play,
  VolumeX,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { setReelData } from "../redux/reelSlice.js";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";

const ReelCard = ({ reel, index, isActive }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const reelData = useSelector((state) => state.reel.reelData);
  const [progress, setProgress] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(reel.comments || []);
  const navigate = useNavigate();
  const isFollowing = userData.following?.includes(reel.author?._id) || false;

  const [liked, setLiked] = useState(
    reel.likes?.includes(userData._id) || false
  );
  const [showHeart, setShowHeart] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes?.length || 0);
  
  const handletimeupdate = () => {
    const video = videoRef.current;
    if (video) {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    }
  };
  const handleDoubleClick = () => {
    if (!liked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 1000);
  };
  const commentRef = useRef();
  useEffect(()=>{
    const handleClickOutside=(e)=>{
                                //kahi bahar click kiya to comment section band ho jaye
      if(commentRef.current && !commentRef.current.contains(e.target)){
        setShowComment(false);
      }//cross ke alawa kahi bhi click karne par comment section band ho jaye
    }
    if(showComment){
      document.addEventListener("mousedown",handleClickOutside);
    }
    else{
      document.removeEventListener("mousedown",handleClickOutside);
    }

  },[showComment])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        
        //sab video play hote hai ek saath to stop that we do this
        if (entries[0].isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.75 } //75% of the video should be visible to play
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch((err) => console.log("Play error:", err));
        setIsPlaying(true);
      }
    }
  };
  const handleFollow = async () => {
    try {
      const userId = reel.author?._id;

      const response = await axios.post(
        `${serverUrl}/api/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.currentUser) {
        dispatch(setUserData(response.data.currentUser));
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  const handleLike = async () => {
    const previousLiked = liked;
    const previousLikesCount = likesCount;
    setLiked(!previousLiked);
    setLikesCount(
      previousLiked ? previousLikesCount - 1 : previousLikesCount + 1
    );

    try {
      const reelId = reel._id;
      const response = await axios.post(
        `${serverUrl}/api/reel/like/${reelId}`,
        {},
        { withCredentials: true }
      );
      const updatedReels = reelData.map((r) =>
        r._id === reel._id ? { ...r, likes: response.data.likes } : r
      );
      dispatch(setReelData(updatedReels));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };
  const handlePostComment = async (e) => {
  e.preventDefault(); // Prevent form submission from reloading the page

  // Validate the comment input
  if (!newComment.trim()) {
    console.error("Comment cannot be empty");
    return;
  }

  try {
    const reelId = reel._id;

    // Send the comment to the backend
    const response = await axios.post(
      `${serverUrl}/api/reel/comment/${reelId}`,
      { comment: newComment },
      { withCredentials: true }
    );

    // Update the comments state with the new comments array from the backend
    setComments(response.data.comments || []);
    dispatch(setReelData(
      reelData.map((r) =>
        r._id === reel._id ? { ...r, comments: response.data.comments } : r
      )
    ));
    setNewComment(""); // Clear the input field
  } catch (error) {
    console.error("Error posting comment:", error);

    // Optional: Show user feedback for the error
    alert("Failed to post comment. Please try again.");
  }
};

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-2 overflow-hidden ">
      <div
        className="relative w-full max-w-md h-full bg-black"
        onDoubleClick={handleDoubleClick}
      >
        <video
          src={reel.media}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          onClick={togglePlayPause}
          onTimeUpdate={handletimeupdate}
        />
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart
              size={80}
              className="text-red-500 fill-red-500 animate-like"
            />
          </div>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-80 pointer-events-none" />

        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 z-10">
          <div className="relative cursor-pointer">
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden">
              <img
                src={reel.author?.profileImage || "/image.png"}
                alt={reel.author?.name}
                className="w-full h-full object-cover"
                onClick={() => navigate(`/profile/${reel.author?._id}`)}
              />
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-[10px] font-bold">+</span>
            </div>
          </div>

          <button
            className="flex flex-col items-center gap-0.5"
            onClick={handleLike}
          >
            {liked ? (
              <Heart
                size={24}
                className="text-red-500 fill-red-500 transition-transform duration-200 ease-in-out transform active:scale-125"
              />
            ) : (
              <Heart
                size={24}
                className="text-gray-700 hover:text-red-500 transition-colors"
              />
            )}
            <span className="text-white text-xs font-semibold">
              {likesCount}
            </span>
          </button>
          <button
            className="flex flex-col items-center gap-0.5"
            onClick={() => setShowComment(true)} // Opens the comment section
          >
            <MessageCircle size={24} className="text-white" />
            <span className="text-white text-xs font-semibold">
              {comments.length}
            </span>
          </button>

          <button>
            <Bookmark className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 pb-16 z-10 pr-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-semibold text-sm">
              @{reel.author?.userName || "username"}
            </span>
            <button
              className={`${
                isFollowing ? "bg-red-600" : ""
              } px-3 py-0.5  border border-white text-white text-xs font-semibold rounded`}
              onClick={handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          <p className="text-white text-sm mb-2 line-clamp-2 leading-tight">
            {reel.caption || "Amazing moment captured! #vibes #trending"}
          </p>

          <div className="h-[6px] absolute bottom-1 left-1 rounded-full w-[98%] bg-gray-800">
            <div
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="absolute top-16 left-3 z-10 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
        {showComment && (
          <div ref={commentRef} className="absolute bottom-0 left-0 right-0 z-30 bg-[#0e1718] rounded-t-2xl transition-transform duration-300 ease-in-out">
            <div className="relative p-4 border-b border-gray-700 text-center">
              <h3 className="text-white font-semibold">
                Comments ({comments.length})
              </h3>
              <button
                onClick={() => setShowComment(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[300px] p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No comments yet.
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 bg-gray-800 p-3 rounded-lg"
                  >
                    <img
                      src={comment.author?.profileImage || "/image.png"}
                      alt={comment.author?.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold mr-2">
                          {comment.author?.userName}
                        </span>
                        {comment.comment}
                      </p>
                      
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handlePostComment}
              className="flex items-center gap-3 p-4 bg-gray-900 border-t border-gray-700"
            >
              <img
                src={userData.profileImage || "/image.png"}
                alt="Your profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="text-purple-500 disabled:text-gray-600"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes like-animation {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-like {
          animation: like-animation 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ReelCard;
