import React from 'react';
import StoryCard from './StoryCard';
import Post from './Post';
import { PartyPopper, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';

const Feed = () => {
  // ✅ Fixed: Properly access posts from Redux with optional chaining
  const posts = useSelector((state) => state.post?.postData.posts) || [];
  const user = useSelector((state) => state.user?.userData) || {};
  
 

  // Placeholder data for stories
  const stories = [
    { name: 'Your Story', profilePic: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Jane Doe', profilePic: 'https://i.pravatar.cc/150?img=26' },
    { name: 'John Smith', profilePic: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Emily White', profilePic: 'https://i.pravatar.cc/150?img=45' },
    { name: 'Chris Green', profilePic: 'https://i.pravatar.cc/150?img=51' },
    { name: 'Michael Brown', profilePic: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Sarah Wilson', profilePic: 'https://i.pravatar.cc/150?img=49' },
  ];

  return (
    <div className="w-full md:w-[60%] lg:w-[55%] h-screen overflow-y-auto scrollbar-hide">
      <div className="max-w-2xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-between p-3 mb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-7 w-7 text-purple-600" />
            <h1 className="text-2xl logo text-gray-800">VibeShare</h1>
          </div>
          <button className="text-gray-700 hover:text-red-500 transition-colors p-1 rounded-full">
            <Heart size={24} />
          </button>
        </div>

        {/* Stories Section */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-6">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {stories.map((story, index) => (
              <StoryCard key={index} user={story} />
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="pb-24">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PartyPopper className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 text-sm">Start following people to see their posts here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;