import React from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';

const Post = ({ post }) => {
  // ✅ Add safety checks
  if (!post) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6">
      
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.author?.profilePic || "/image.png"}
            alt={post.author?.name || "User"}
          />
          <div>
            <p className="font-bold text-sm text-gray-800">{post.author?.name || "Unknown"}</p>
            <p className="text-xs text-gray-500">@{post.author?.userName || "unknown"}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-800">
          <MoreHorizontal size={20} />
        </button>
      </div>

      
      {post.mediaType === 'video' ? (
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

      
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <button>
              <Heart size={24} className="text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            <button>
              <MessageCircle size={24} className="text-gray-700 hover:text-gray-900 transition-colors" />
            </button>
          </div>
          <button>
            <Bookmark size={24} className="text-gray-700 hover:text-gray-900 transition-colors" />
          </button>
        </div>

       
        <p className="font-semibold text-sm text-gray-800 mb-1">
          {post.likes?.length || 0} likes
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-800 mr-2">
            {post.author?.userName || "user"}
          </span>
          {post.caption || ""}
        </p>
        <a href="#" className="text-xs text-gray-500 hover:underline mt-1 block">
          View all {post.comments?.length || 0} comments
        </a>
        <p className="text-xs text-gray-400 uppercase mt-2">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
        </p>
      </div>

  
      <div className="border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent focus:outline-none text-sm"
          />
          <button type="submit" className="text-purple-600 hover:text-purple-800 font-semibold text-sm">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;