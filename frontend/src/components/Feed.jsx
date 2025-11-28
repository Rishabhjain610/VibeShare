import React from 'react';
import StoryCard from './StoryCard';
import Post from './Post';
import { PartyPopper, Heart } from 'lucide-react';
// REMOVED: import Navbar from './Navbar';

const Feed = () => {
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

  // Placeholder data for posts
  const posts = [
    {
      user: { name: 'Jane Doe', userName: 'janedoe', profilePic: 'https://i.pravatar.cc/150?img=26' },
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2546&auto=format&fit=crop',
      likes: 1204,
      caption: 'Beautiful day out in the city!',
      comments: 88,
      timestamp: '2 hours ago',
    },
    {
      user: { name: 'John Smith', userName: 'johnsmith', profilePic: 'https://i.pravatar.cc/150?img=32' },
      imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2487&auto=format&fit=crop',
      likes: 856,
      caption: 'Exploring the great outdoors. Nature is amazing.',
      comments: 42,
      timestamp: '5 hours ago',
    },
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

        {/* Posts Section - Added bottom padding to prevent navbar overlap */}
        <div className="pb-24">
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;