import React from "react";
import { useSelector, useDispatch } from "react-redux";
import StoryCard from "./StoryCard";
import Post from "./Post";
import { PartyPopper, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post?.postData.posts) || [];
  const user = useSelector((state) => state.user?.userData) || {};
  const otherUsers = useSelector((state) => state.story?.storyList) || [];

  return (
    <div className="w-full  lg:w-[55%] h-screen overflow-y-auto scrollbar-hide">
      <div className="max-w-2xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-between p-3 mb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-7 w-7 text-purple-600" />
            <h1 className="text-2xl logo text-gray-800">VibeShare</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-700 hover:text-red-500 transition-colors p-1 rounded-full">
              <Heart size={24} />
            </button>
            {/* Messages Icon - Hidden on large screens */}
            <Link
              to="/messages"
              className="lg:hidden text-gray-700 hover:text-purple-600 transition-colors p-1 rounded-full"
              aria-label="Messages"
            >
              <MessageSquare size={24} />
            </Link>
          </div>
        </div>

        {/* Stories Section */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-6">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {/* Current User's Story */}
            <StoryCard
              user={{
                name: "Your Story",
                userName: user.userName,
                profilePic: user.profileImage || "/image.png",
              }}
              story={user.story || null} // Pass the user's story or null
              isCurrentUser={true} // Indicate this is the current user
            />

            {/* Other Users' Stories */}
            {otherUsers.map((otherUser, index) => (
              <StoryCard
                key={index}
                user={{
                  name: otherUser.author.name,
                  profilePic: otherUser.author.profileImage || "/image.png",
                  userName: otherUser.author.userName,
                }}
                story={otherUser} // Pass the other user's story or null
                isCurrentUser={false} // Indicate this is not the current user
              />
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="pb-24">
          {posts && posts.length > 0 ? (
            posts.map((post) => <Post key={post._id} post={post} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PartyPopper className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 text-sm">
                Start following people to see their posts here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
