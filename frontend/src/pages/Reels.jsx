import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import ReelCard from '../components/ReelCard';
import { Camera, ArrowLeft, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reels = () => {
  const navigate = useNavigate();
  const reels = useSelector((state) => state.reel.reelData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  // Empty state
  if (!reels || reels.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center text-white bg-black/30 backdrop-blur-md rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/create')}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center text-white bg-black/30 backdrop-blur-md rounded-full"
        >
          <Camera className="w-5 h-5" />
        </button>

        <div className="text-center px-6">
          <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <p className="text-white/80 text-lg">No reels yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Vertical Scroll Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"  //snap classes for scroll snapping yeh scrolling mein beech mein nhi rokega
        style={{ 
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={(e) => {
          const scrollTop = e.target.scrollTop;
          const index = Math.round(scrollTop / window.innerHeight);
          setCurrentIndex(index);
        }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel._id}
            className="w-full h-screen snap-start snap-always"
          >
            <ReelCard
              reel={reel}
              index={index}
              isActive={currentIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Top Buttons Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="">
          <div className="flex items-center justify-between px-4 py-3 pointer-events-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center text-white bg-black/30 backdrop-blur-md rounded-full active:scale-95 transition-transform hover:bg-black/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/create')}
              className="w-10 h-10 flex items-center justify-center text-white bg-black/30 backdrop-blur-md rounded-full active:scale-95 transition-transform hover:bg-black/50"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Reels;