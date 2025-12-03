import React, { useState, useContext, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthDataContext } from "../context/AuthContext";
const Post = ({ post }) => {
  // ✅ Add safety checks
  if (!post) return null;

  const user = useSelector((state) => state.user?.userData) || {};
  const { serverUrl } = useContext(AuthDataContext);
  const posts = useSelector((state) => state.post?.postData.posts) || [];
  const isLiked = post.likes?.includes(user._id) || false;
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const issaved = post.savedPosts?.includes(posts._id) || false;
  const [saved, setSaved] = useState(issaved);
const handleLike = async () => {
  // ✅ Store the previous state before making changes
  const previousLiked = liked;
  const previousLikesCount = likesCount;

  // ✅ Optimistic update: Toggle the like state immediately
  const newLikedState = !liked;
  setLiked(newLikedState);
  setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);

  try {
    const postId = post._id;
    const response = await axios.post(
      `${serverUrl}/api/post/like/${postId}`,
      {},
      { withCredentials: true }
    );

    // ✅ Update the like count and state based on the server response
    if (response.data.likes) {
      setLikesCount(response.data.likes.length);
      setLiked(response.data.likes.includes(user._id)); // Ensure consistency with the server
    }
  } catch (error) {
    console.error("Error liking/unliking post:", error);

    // ✅ Revert to the previous state if the API call fails
    setLiked(previousLiked);
    setLikesCount(previousLikesCount);
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.author?.profilePic || "/image.png"}
            alt={post.author?.name || "User"}
          />
          <div>
            <p className="font-bold text-sm text-gray-800">
              {post.author?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              @{post.author?.userName || "unknown"}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media - Handle both image and video */}
      {post.mediaType === "video" ? (
        <video
          className="w-full h-auto max-h-[70vh] object-cover"
          src={post.media}
          controls
        />
      ) : (
        <img
          className="w-full h-auto max-h-[70vh] object-cover"
          src={post.media || "/image.png"}
          alt="Post content"
        />
      )}

      {/* Actions */}
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike}>
              {liked ? (
                <Heart
                  size={24}
                  className="text-red-500 fill-red-500 transition-colors"
                />
              ) : (
                <Heart
                  size={24}
                  className="text-gray-700 hover:text-red-500 transition-colors"
                />
              )}
            </button>
            <button>
              <MessageCircle
                size={24}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              />
            </button>
          </div>
          <button>
            {saved ? (
              <Bookmark
                size={24}
                className="text-purple-600 fill-purple-600 transition-colors"
              />
            ) : (
              <Bookmark
                size={24}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              />
            )}
          </button>
        </div>

        {/* Post Details */}
        <p className="font-semibold text-sm text-gray-800 mb-1">
          {likesCount} likes
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-800 mr-2">
            {post.author?.userName || "user"}
          </span>
          {post.caption || ""}
        </p>
        <a
          href="#"
          className="text-xs text-gray-500 hover:underline mt-1 block"
        >
          View all {post.comments?.length || 0} comments
        </a>
        <p className="text-xs text-gray-400 uppercase mt-2">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
        </p>
      </div>

      {/* Comment Input */}
      <div className="border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
