import React, { useState, useContext } from "react";
import {
  LogOut,
  Heart,
  Home as HomeIcon,
  Compass,
  PartyPopper,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AuthDataContext } from "../context/AuthContext";
// Reverted to only import what is defined in your userSlice
import { setUserData } from "../redux/userSlice.js";
import { toast } from "react-toastify";

const LeftHome = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const otherUsersData = useSelector((state) => state.user.otherUsers);

  const handleLogout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      // Reverted to dispatching only setUserData(null)
      dispatch(setUserData(null));
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[20%] hidden lg:flex flex-col justify-between h-screen bg-white border-r border-gray-200 p-4 sticky top-0">
      <div>
        <div className="flex items-center gap-2 p-3 mb-6 cursor-pointer" onClick={() => navigate('/')}>
          <PartyPopper className="h-7 w-7 text-purple-600" />
          <h1 className="text-2xl logo text-gray-800">VibeShare</h1>
        </div>

        <nav className="space-y-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
            className="flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium bg-purple-100 text-purple-700"
          >
            <HomeIcon size={20} />
            <span>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Compass size={20} />
            <span>Explore</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Heart size={20} />
            <span>Liked Posts</span>
          </a>
        </nav>

        <div className="relative my-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search VibeShare"
            className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h2 className="font-bold text-gray-800 mb-4">Suggested Users</h2>
          <div className="space-y-4">
            {Array.isArray(otherUsersData) && otherUsersData.length > 0 ? (
              otherUsersData.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  onClick={() => navigate(`/profile/${user.userName}`)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.profilePic || "/image.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">@{user.userName}</p>
                    </div>
                  </div>
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 px-4 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking follow
                      // Add follow logic here
                    }}
                  >
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center">
                No users to suggest.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => userData && navigate(`/profile/${userData.userName}`)}
        >
          {userData ? (
            <>
              <img
                src={userData.profilePic || "/image.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm text-gray-800">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500">@{userData.userName}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
        <button
          className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut size={20} />
          <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
};

export default LeftHome;