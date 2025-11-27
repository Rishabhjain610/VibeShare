import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Heart,
  Home as HomeIcon,
  Compass,
  PartyPopper,
} from "lucide-react";
import { setUserData } from "../redux/userSlice";
import { AuthDataContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const LeftHome = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthDataContext);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  // A simple nav item component for reusability
  const NavItem = ({ icon, text, active }) => (
    <a
      href="#"
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium ${
        active
          ? "bg-purple-100 text-purple-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );

  return (
    <div className="w-[20%] hidden lg:flex flex-col justify-between h-screen bg-white border-r border-gray-200 p-4 sticky top-0">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 p-3 mb-6">
          <PartyPopper className="h-7 w-7 text-purple-600" />
          <h1 className="text-2xl logo text-gray-800">VibeShare</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem icon={<HomeIcon size={20} />} text="Home" active />
          <NavItem icon={<Compass size={20} />} text="Explore" />
          <NavItem icon={<Heart size={20} />} text="Liked Posts" />
        </nav>
      </div>

      {/* Profile and Logout */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <img
            src={userData?.profilePic || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {userData?.name}
            </p>
            <p className="text-xs text-gray-500">@{userData?.userName}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftHome;