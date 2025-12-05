import React,{useState,useEffect,useRef,useContext} from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Music,
  Volume2,
  Play,
} from "lucide-react";

const ReelCard = ({ reel, index, isActive }) => {
  const videoRef = useRef();
  const [isPlaying,setIsPlaying]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver((entries)=>{
     const video=videoRef.current;
     if(entries.isIntersecting){
      video.play();
      setIsPlaying(true);
     }else{
      video.pause();
      setIsPlaying(false);
     }
    },{threshold:0.75})
    if(videoRef.current){
    observer.observe(videoRef.current);
    }
    return ()=>{
      if(videoRef.current){
        observer.unobserve(videoRef.current);
      }
    }
  },[]
  )
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
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-2">
      <div className="relative w-full max-w-md h-full bg-black">
        <video
          src={reel.media}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          onClick={togglePlayPause}
          
        />

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
              />
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-[10px] font-bold">+</span>
            </div>
          </div>

          <button className="flex flex-col items-center gap-0.5">
            <Heart className="w-7 h-7 text-white" />
            <span className="text-white text-xs font-semibold">1.2K</span>
          </button>

          <button className="flex flex-col items-center gap-0.5">
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="text-white text-xs font-semibold">89</span>
          </button>

          <button>
            <Share2 className="w-6 h-6 text-white" />
          </button>

          <button>
            <Bookmark className="w-6 h-6 text-white" />
          </button>

          <button>
            <MoreVertical className="w-6 h-6 text-white" />
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-spin-slow">
            <Music className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 pb-16 z-10 pr-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-semibold text-sm">
              @{reel.author?.userName || "username"}
            </span>
            <button className="px-3 py-0.5 bg-transparent border border-white text-white text-xs font-semibold rounded">
              Follow
            </button>
          </div>

          <p className="text-white text-sm mb-2 line-clamp-2 leading-tight">
            {reel.caption || "Amazing moment captured! #vibes #trending"}
          </p>

          <div className="flex items-center gap-1.5 text-white text-xs">
            <Music className="w-3 h-3" />
            <span className="truncate">
              Original audio · {reel.author?.name || "Artist"}
            </span>
          </div>
        </div>

        <button className="absolute top-16 left-3 z-10 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ReelCard;
