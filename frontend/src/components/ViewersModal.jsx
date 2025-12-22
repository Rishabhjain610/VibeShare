import React from "react";
import { X } from "lucide-react";

const ViewersModal = ({ viewers, onClose }) => {
  return (
    // Full-screen overlay
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-xs p-5"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Viewed By</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
          {viewers && viewers.length > 0 ? (
            viewers.map((viewer) => (
              <div key={viewer._id} className="flex items-center gap-3">
                <img
                  src={viewer.profileImage || "/image.png"}
                  alt={viewer.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold text-gray-700">{viewer.userName}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No one has viewed this story yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewersModal;