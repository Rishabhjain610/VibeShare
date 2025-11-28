import React from 'react';

const StoryCard = ({ user }) => {
  return (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
      
      <div className="p-0.5 rounded-full bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500">
        
        <div className="p-0.5 bg-white rounded-full">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src={user.profilePic||"/image.png"}
            alt={user.name}
          />
        </div>
      </div>
      <p className="text-xs w-16 truncate text-center text-gray-700">{user.name}</p>
    </div>
  );
};

export default StoryCard;