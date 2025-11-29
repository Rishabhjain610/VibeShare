import React, { useState, useEffect, useContext } from "react";
import { AuthDataContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setProfileData, setUserData, clearProfileData } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Settings,
  Grid,
  Bookmark,
  UserSquare2,
  MoreHorizontal,
  ArrowLeft,
  PartyPopper,
  LogOut,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Get current logged-in user to check if viewing own profile
  const currentUser = useSelector((state) => state.user.userData);
  const profileData = useSelector((state) => state.user.profileData?.user);
  
  const isOwnProfile = currentUser?.userName === username;

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
      toast.error("Failed to load profile");
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    // Clear old profile data when username changes
    dispatch(clearProfileData());
    getProfileData();

    // Cleanup: Clear profile data when component unmounts
    return () => {
      dispatch(clearProfileData());
    };
  }, [username, dispatch, serverUrl,isOwnProfile,currentUser]);

  // ✅ FIX: Re-added the follow/unfollow handler
  
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
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

  // Use posts from the API response, or an empty array if none exist
  const posts = profileData?.posts || [];

  // Show loading state while fetching profile data
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

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
          <button
            onClick={() => navigate(-1)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </button>

          
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0"
          >
            <PartyPopper className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />
            <h1 className="text-xl md:text-2xl logo text-gray-800">VibeShare</h1>
          </div>

          
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              <LogOut size={20} />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          )}

          
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={24} className="text-gray-800" />
          </button>

          {!isOwnProfile && <div className="hidden lg:block w-24"></div>}
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 md:py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
           
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <img
                    src={profileData?.profileImage || "/image.png"}
                    alt={profileData?.name || "Profile"}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/image.png";
                    }}
                  />
                </div>
              </div>
            </div>

            
            <div className="flex-1 text-center md:text-left w-full">
             
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  {profileData?.userName || username}
                </h2>
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  {!isOwnProfile ? (
                    <>
                      <button 
                       
                        disabled={followLoading}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 font-semibold px-6 md:px-8 py-2 rounded-lg transition-all duration-300 text-sm md:text-base disabled:opacity-50 ${
                          isFollowing
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {followLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            {isFollowing ? (
                              <>
                                <UserCheck size={18} />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus size={18} />
                                <span>Follow</span>
                              </>
                            )}
                          </>
                        )}
                      </button>
                      <button className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 md:px-6 py-2 rounded-lg transition-colors text-sm md:text-base">
                        Message
                      </button>
                    </>
                  ) : (
                    <button className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 md:px-8 py-2 rounded-lg transition-colors text-sm md:text-base"
                    onClick={() => navigate('/edit-profile')}>
                      Edit Profile
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-lg transition-colors">
                    <Settings size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              
              <div className="flex justify-center md:justify-start gap-6 md:gap-8 mb-6">
                <div className="text-center">
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    {posts.length}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center cursor-pointer hover:opacity-75 transition-opacity">
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    {profileData?.followers?.length || 0}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center cursor-pointer hover:opacity-75 transition-opacity">
                  <p className="text-lg md:text-xl font-bold text-gray-800">
                    {profileData?.following?.length || 0}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">Following</p>
                </div>
              </div>

            
              <div>
                <p className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                  {profileData?.name || "User"}
                </p>
                {profileData?.profession && (
                  <p className="text-purple-600 font-medium mb-2 text-xs md:text-sm">
                    {profileData.profession}
                  </p>
                )}
                {profileData?.bio && (
                  <p className="text-gray-600 whitespace-pre-line text-xs md:text-sm leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </div>

              {isOwnProfile && (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="lg:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  <LogOut size={20} />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="aspect-square bg-gray-200 rounded-sm sm:rounded-md md:rounded-lg overflow-hidden cursor-pointer group relative"
            >
              <img
                src={post.image}
                alt={`Post by ${profileData?.userName}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <span>❤️</span>
                  <span>{post.likes.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        
        {posts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Grid size={40} className="text-gray-400 md:w-12 md:h-12" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              No Posts Yet
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              When {profileData?.userName || "this user"} shares photos, they'll appear here.
            </p>
          </div>
        )}
      </div>

      
      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default ProfilePage;
