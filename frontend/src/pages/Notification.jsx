// ...existing code...
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bell, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useContext } from "react";
import { AuthDataContext } from "../context/AuthContext";
import { useEffect } from "react";
const Notification = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthDataContext);
  const notifications =
    useSelector((state) => state.user.notificationData) || [];
  const ids = notifications.map((n) => n._id || n.id);
  const markASRead = async (notificationId) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/notificationread`,
        notificationId,
        { withCredentials: true }
      );
      console.log("Notification marked as read:", response.data);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  useEffect(() => {
    if (ids.length > 0) {
      markASRead(ids);
    }
  }, [ids]);
  return (
    
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-2 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-600" />
          Notifications
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[280px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mb-3 text-purple-200" />
            <p className="text-sm">
              You're all caught up — no notifications yet.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const mediaUrl = n.post?.media || n.reel?.media || null;
              const isVideo =
                typeof mediaUrl === "string" &&
                /\.(mp4|webm|mov|mkv)$/i.test(mediaUrl);
              return (
                <li key={n._id || n.id} className="flex items-start gap-3 py-3">
                  <div className="relative">
                    <img
                      src={n.sender?.profileImage || "/image.png"}
                      alt={n.sender?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {!n.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-1 ring-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-800">
                        {n.sender.message ||
                          (n.sender?.name
                            ? `${n.sender.name} • notification`
                            : "Notification")}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt || n.time || Date.now()).toLocaleString()}
                      </span>
                    </div>
                    {n.message && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {n.message}
                      </p>
                    )}
                  </div>

                  <div className="relative w-10 h-10 flex-shrink-0">
                    {mediaUrl ? (
                      isVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-10 h-10 rounded-full object-cover"
                          muted
                          playsInline
                          loop
                          autoPlay
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={n.sender?.name || "Media"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )
                    ) : (
                      <img
                        src="/image.png"
                        alt="placeholder"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    {!n.isRead && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-1 ring-white" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
// ...existing code...
