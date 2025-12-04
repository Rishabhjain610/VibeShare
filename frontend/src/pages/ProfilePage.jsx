import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setProfileData,
  setUserData,
  clearProfileData,
} from "../redux/userSlice";
import { AuthDataContext } from "../context/AuthContext";
import {
  Settings,
  Grid,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  PartyPopper,
  LogOut,
  UserPlus,
  UserCheck,
} from "lucide-react";

// --- Helper Component for Post Grid ---
const PostGrid = ({ posts, emptyStateConfig }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center col-span-3">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          {emptyStateConfig.icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          {emptyStateConfig.title}
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          {emptyStateConfig.message}
        </p>
      </div>
    );
  }

  return posts.map((post) => (
    post && post._id && ( // Ensure post and post._id exist
      <div
        key={post._id}
        className="aspect-square bg-gray-200 rounded-sm sm:rounded-md md:rounded-lg overflow-hidden cursor-pointer group relative"
      >
        <img
          src={post.media}
          alt={`Post by ${post.author?.userName || 'user'}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span>❤️</span>
            <span>{post.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    )
  ));
};


const ProfilePage = () => {
  // --- Hooks and Context ---
  const { serverUrl } = useContext(AuthDataContext);
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- State Management ---
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // --- Redux Selectors ---
  const currentUser = useSelector((state) => state.user.userData);
  
  const profileData = useSelector((state) => state.user.profileData?.user);
  // CORRECTED: Select the postData array directly
  const allPosts = useSelector((state) => state.post.postData.posts);

  // --- Derived Data (The Proper Way) ---
  const isOwnProfile = currentUser?.userName === username;
  const isFollowing = currentUser?.following?.includes(profileData?._id);

  // Get the IDs of the user's posts from the profile data
  const userPostIds = new Set((profileData?.posts || []).map(p => p._id || p));
  // Filter the complete `allPosts` list to get the full objects for the user's posts
  const userPosts = (allPosts || []).filter(post => userPostIds.has(post._id));
  
  // Get the IDs of the saved posts from the current user data
  const savedPosts=currentUser?.saved || [];


  // --- Effects ---
  useEffect(() => {
    const getProfileData = async () => {
      setFetchingProfile(true);
      try {
        const response = await axios.get(
          `${serverUrl}/api/user/profile/${username}`,
          { withCredentials: true }
        );
        dispatch(setProfileData(response.data));
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile.");
      } finally {
        setFetchingProfile(false);
      }
    };

    dispatch(clearProfileData());
    getProfileData();

    return () => dispatch(clearProfileData());
  }, [username, dispatch, serverUrl]);

  // --- Event Handlers ---
  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/user/follow/${profileData._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(response.data.currentUser));
      const updatedFollowers = isFollowing
        ? profileData.followers.filter(id => id !== currentUser._id)
        : [...profileData.followers, currentUser._id];
      dispatch(setProfileData({ user: { ...profileData, followers: updatedFollowers } }));
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Something went wrong.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(clearProfileData());
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const postsToRender = activeTab === 'posts' ? userPosts : savedPosts;
  const emptyStateConfig = activeTab === 'posts'
    ? { icon: <Grid size={40} className="text-gray-400 md:w-12 md:h-12" />, title: "No Posts Yet", message: "When posts are shared, they'll appear here." }
    : { icon: <Bookmark size={40} className="text-gray-400 md:w-12 md:h-12" />, title: "No Saved Posts", message: "You haven't saved any posts yet." };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
            <PartyPopper className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />
            <h1 className="text-xl md:text-2xl logo text-gray-800">VibeShare</h1>
          </div>
          {isOwnProfile ? (
            <button onClick={handleLogout} disabled={loading} className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50">
              <LogOut size={20} />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          ) : (
            <div className="hidden lg:block w-24"></div>
          )}
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={24} className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 md:py-8">
        {/* Profile Info Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img src={profileData?.profileImage || "/image.png"} alt={profileData?.name || "Profile"} className="w-full h-full rounded-full object-cover" onError={(e) => { e.target.src = "/image.png"; }} />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{profileData?.userName || username}</h2>
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  {isOwnProfile ? (
                    <>
                      <button className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 md:px-8 py-2 rounded-lg transition-colors text-sm md:text-base" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-lg transition-colors"><Settings size={18} className="md:w-5 md:h-5" /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleFollow} disabled={followLoading} className={`flex-1 md:flex-none flex items-center justify-center gap-2 font-semibold px-6 md:px-8 py-2 rounded-lg transition-all duration-300 text-sm md:text-base disabled:opacity-50 ${isFollowing ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"}`}>
                        {followLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />)}
                        <span>{followLoading ? "Loading..." : (isFollowing ? "Following" : "Follow")}</span>
                      </button>
                      <button className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base">Message</button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-6 md:gap-8 mb-6">
                <div className="text-center"><p className="text-lg md:text-xl font-bold text-gray-800">{userPosts.length}</p><p className="text-xs md:text-sm text-gray-600">Posts</p></div>
                <div className="text-center cursor-pointer hover:opacity-75 transition-opacity"><p className="text-lg md:text-xl font-bold text-gray-800">{profileData?.followers?.length || 0}</p><p className="text-xs md:text-sm text-gray-600">Followers</p></div>
                <div className="text-center cursor-pointer hover:opacity-75 transition-opacity"><p className="text-lg md:text-xl font-bold text-gray-800">{profileData?.following?.length || 0}</p><p className="text-xs md:text-sm text-gray-600">Following</p></div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1 text-sm md:text-base">{profileData?.name || "User"}</p>
                {profileData?.profession && <p className="text-purple-600 font-medium mb-2 text-xs md:text-sm">{profileData.profession}</p>}
                {profileData?.bio && <p className="text-gray-600 whitespace-pre-line text-xs md:text-sm leading-relaxed">{profileData.bio}</p>}
              </div>
              {isOwnProfile && <button onClick={handleLogout} disabled={loading} className="lg:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium disabled:opacity-50"><LogOut size={20} /><span>{loading ? "Logging out..." : "Logout"}</span></button>}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-gray-200 flex justify-center">
          <div className="flex gap-8 md:gap-12 -mt-px">
            <button onClick={() => setActiveTab("posts")} className={`flex items-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === "posts" ? "border-t-2 border-gray-800 text-gray-800" : "text-gray-500 hover:text-gray-800"}`}>
              <Grid size={16} /> POSTS
            </button>
            {isOwnProfile && (
              <button onClick={() => setActiveTab("saved")} className={`flex items-center gap-2 py-3 text-sm font-semibold transition-colors ${activeTab === "saved" ? "border-t-2 border-gray-800 text-gray-800" : "text-gray-500 hover:text-gray-800"}`}>
                <Bookmark size={16} /> SAVED
              </button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="pt-6 grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
          <PostGrid posts={postsToRender} emptyStateConfig={emptyStateConfig} />
        </div>
      </div>
      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default ProfilePage;
