import React, { useState, useEffect, useRef, useContext } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AuthDataContext } from "../context/AuthContext";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serverUrl } = useContext(AuthDataContext);
  const currentUser = useSelector((state) => state.user.userData);

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    profession: "",
    bio: "",
    gender: "female",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        userName: currentUser.userName || "",
        profession: currentUser.profession || "",
        bio: currentUser.bio || "",
        gender: currentUser.gender || "female",
      });
      setPreviewImage(currentUser.profileImage);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, gender: e.target.id });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (imageFile) {
      data.append("profilePic", imageFile);
    }

    try {
      const response = await axios.post(
       
        `${serverUrl}/api/user/edit-profile`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.user) {
        dispatch(setUserData(response.data.user));
        toast.success("Profile updated successfully!");
        navigate(`/profile/${response.data.user.userName}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-sans">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/70 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Edit Profile</h1>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            className="bg-gray-100/50 p-8 flex flex-col items-center justify-center border-b border-gray-200 cursor-pointer"
            onClick={() => imageInputRef.current.click()}
          >
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-1 shadow-lg">
                <div className="w-full h-full bg-white rounded-full p-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    hidden
                    onChange={handleImageChange}
                  />
                  <img
                    src={previewImage || "/image.png"}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <button type="button" className="mt-4 text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Change Photo
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all text-sm text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all text-sm text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="profession" className="block text-sm font-semibold text-gray-600 mb-1">Profession</label>
              <input
                type="text"
                id="profession"
                placeholder="e.g., Software Engineer"
                value={formData.profession}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all text-sm text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
              <textarea
                id="bio"
                rows="4"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all text-sm text-gray-800 resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Gender</label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <label htmlFor="male" className="flex items-center cursor-pointer">
                  <input id="male" name="gender" type="radio" checked={formData.gender === 'male'} onChange={handleGenderChange} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                  <span className="ml-2.5 text-sm text-gray-800">Male</span>
                </label>
                <label htmlFor="Female" className="flex items-center cursor-pointer">
                  <input id="Female" name="gender" type="radio" checked={formData.gender === 'Female'} onChange={handleGenderChange} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                  <span className="ml-2.5 text-sm text-gray-800">Female</span>
                </label>
                <label htmlFor="other" className="flex items-center cursor-pointer">
                  <input id="other" name="gender" type="radio" checked={formData.gender === 'other'} onChange={handleGenderChange} className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center peer-checked:border-purple-600 peer-checked:bg-purple-600 transition-all"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                  <span className="ml-2.5 text-sm text-gray-800">Other</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;