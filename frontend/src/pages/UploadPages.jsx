import React, { useState, useRef, useContext } from "react";
import {
  ArrowLeft,
  Clapperboard,
  PlusSquare,
  CircleUserRound,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  PartyPopper,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setStoryData } from "../redux/storySlice";
import { setReelData } from "../redux/reelSlice";

const UploadPages = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(AuthDataContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);
  const [frontendmedia, setFrontendmedia] = useState(null);
  const [backendmedia, setBackendmedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  // ✅ Fixed: Get data from Redux with fallback to empty arrays
  const postData = useSelector((state) => state.post?.postData || []);
  const storyData = useSelector((state) => state.story?.storyData || []);
  const reelData = useSelector((state) => state.reel?.reelData || []);

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    console.log(selectedFile.type);

    // Validate file type based on selected option
    if (selectedOption === "reel" && !selectedFile.type.includes("video")) {
      alert("Reels only accept videos");
      return;
    }

    if (selectedFile.type.includes("image")) {
      setMediaType("image");
    } else if (selectedFile.type.includes("video")) {
      setMediaType("video");
    }
    setFrontendmedia(URL.createObjectURL(selectedFile));
    setBackendmedia(selectedFile);
  };

  const handleRemoveFile = () => {
    setFrontendmedia(null);
    setBackendmedia(null);
    setMediaType(null);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    if (frontendmedia) {
      handleRemoveFile();
    } else if (selectedOption) {
      setSelectedOption(null);
    } else {
      navigate(-1);
    }
  };

  // ✅ API call function for uploading POST
  const uploadPost = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("media", backendmedia);
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);

      const response = await axios.post(
        `${serverUrl}/api/post/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      // ✅ Extract the post from response
      const newPost = response.data.post || response.data;

      // ✅ Ensure postData is an array before spreading
      const updatedPosts = Array.isArray(postData)
        ? [newPost, ...postData]
        : [newPost];
      
      dispatch(setPostData(updatedPosts));
      toast.success("Post uploaded successfully!");
      
      // Reset states and navigate
      handleRemoveFile();
      setSelectedOption(null);
      navigate("/");
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error(error.response?.data?.message || "Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  // ✅ API call function for uploading REEL
  const uploadReel = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("media", backendmedia);
      formData.append("caption", caption);

      const response = await axios.post(
        `${serverUrl}/api/reel/uploadreel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      // ✅ Extract the reel from response
      const newReel = response.data.reel || response.data;

      // ✅ Ensure reelData is an array before spreading
      const updatedReels = Array.isArray(reelData)
        ? [newReel, ...reelData]
        : [newReel];
      
      dispatch(setReelData(updatedReels));
      toast.success("Reel uploaded successfully!");
      
      // Reset states and navigate
      handleRemoveFile();
      setSelectedOption(null);
      navigate("/reels");
    } catch (error) {
      console.error("Error uploading reel:", error);
      toast.error(error.response?.data?.message || "Failed to upload reel");
    } finally {
      setLoading(false);
    }
  };

  // ✅ API call function for uploading STORY
  const uploadStory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("media", backendmedia);
      formData.append("mediaType", mediaType);

      const response = await axios.post(
        `${serverUrl}/api/story/uploadstory`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      // ✅ Extract the story from response
      const newStory = response.data.story || response.data;

      // ✅ Ensure storyData is an array before spreading
      const updatedStories = Array.isArray(storyData)
        ? [newStory, ...storyData]
        : [newStory];
      
      setStoryData(prev => ({...prev, story: response.data.story}));
      toast.success("Story uploaded successfully!");
      
      // Reset states and navigate
      handleRemoveFile();
      setSelectedOption(null);
      navigate("/");
    } catch (error) {
      console.error("Error uploading story:", error);
      toast.error(error.response?.data?.message || "Failed to upload story");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (selectedOption === "post") {
      uploadPost();
    } else if (selectedOption === "reel") {
      uploadReel();
    } else if (selectedOption === "story") {
      uploadStory();
    }
  };

  // Determine file accept attribute based on selected option
  const getAcceptedFileTypes = () => {
    if (selectedOption === "post") return "image/*,video/*";
    if (selectedOption === "reel") return "video/*";
    return "image/*,video/*"; // Story accepts both
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={getAcceptedFileTypes()}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
            disabled={loading}
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <PartyPopper className="h-7 w-7 text-purple-600" />
            <h1 className="text-2xl logo text-gray-800">VibeShare</h1>
          </div>
          {frontendmedia ? (
            <button
              onClick={handleUpload}
              disabled={!backendmedia || loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          ) : (
            <div className="w-16"></div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {!selectedOption ? (
          // Selection Screen
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 lg:mb-3">
                What would you like to share?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Choose an option to get started
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Upload Post */}
              <button
                onClick={() => handleOptionClick("post")}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-6 lg:p-8 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-4">
                    <PlusSquare
                      size={40}
                      className="text-purple-600 group-hover:text-white transition-colors"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    Upload Post
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2">
                    Share photos & videos
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ImageIcon size={14} />
                    <Video size={14} />
                  </div>
                </div>
              </button>

              {/* Create Reel */}
              <button
                onClick={() => handleOptionClick("reel")}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-6 lg:p-8 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-pink-100 group-hover:bg-pink-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-4">
                    <Clapperboard
                      size={40}
                      className="text-pink-600 group-hover:text-white transition-colors"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    Create Reel
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2">
                    Short entertaining videos
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Video size={14} />
                    <span>Video only</span>
                  </div>
                </div>
              </button>

              {/* Add to Story */}
              <button
                onClick={() => handleOptionClick("story")}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden p-6 lg:p-8 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-4">
                    <CircleUserRound
                      size={40}
                      className="text-blue-600 group-hover:text-white transition-colors"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    Add to Story
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-2">
                    Share for 24 hours
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ImageIcon size={14} />
                    <Video size={14} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : !frontendmedia ? (
          // File Upload Screen
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-200">
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center mb-6 ${
                    selectedOption === "post"
                      ? "bg-gradient-to-br from-purple-100 to-pink-100"
                      : selectedOption === "reel"
                      ? "bg-gradient-to-br from-pink-100 to-red-100"
                      : "bg-gradient-to-br from-blue-100 to-cyan-100"
                  }`}
                >
                  {selectedOption === "reel" ? (
                    <Video size={48} className="text-pink-600" />
                  ) : selectedOption === "story" ? (
                    <div className="relative">
                      <ImageIcon size={48} className="text-blue-600" />
                      <Video
                        size={24}
                        className="text-blue-600 absolute -bottom-2 -right-2"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <PlusSquare size={48} className="text-purple-600" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                  {selectedOption === "post" && "Select Image or Video"}
                  {selectedOption === "reel" && "Select a Video"}
                  {selectedOption === "story" && "Select Image or Video"}
                </h2>
                <p className="text-gray-600 mb-2 text-sm lg:text-base">
                  {selectedOption === "post" &&
                    "Choose an image or video to share with your followers"}
                  {selectedOption === "reel" &&
                    "Select a video to create your reel"}
                  {selectedOption === "story" &&
                    "Pick an image or video for your 24-hour story"}
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 ${
                    selectedOption === "post"
                      ? "bg-purple-100 text-purple-700"
                      : selectedOption === "reel"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedOption === "post" && (
                    <>
                      <ImageIcon size={14} />
                      <span>Images & Videos accepted</span>
                      <Video size={14} />
                    </>
                  )}
                  {selectedOption === "reel" && (
                    <>
                      <Video size={14} />
                      <span>Video only</span>
                    </>
                  )}
                  {selectedOption === "story" && (
                    <>
                      <ImageIcon size={14} />
                      <span>Images & Videos accepted</span>
                      <Video size={14} />
                    </>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className={`flex items-center gap-2 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md ${
                    selectedOption === "post"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : selectedOption === "reel"
                      ? "bg-pink-600 hover:bg-pink-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Upload size={20} />
                  Select File
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Preview & Caption Screen
          <div className="w-full max-w-5xl">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div
                className={`grid grid-cols-1 ${
                  selectedOption === "story"
                    ? "lg:grid-cols-1"
                    : "lg:grid-cols-5"
                } gap-0`}
              >
                {/* Preview Section */}
                <div
                  className={`${
                    selectedOption === "story"
                      ? "lg:col-span-1"
                      : "lg:col-span-3"
                  } bg-black flex items-center justify-center ${
                    selectedOption === "story"
                      ? "min-h-[500px] lg:min-h-[600px]"
                      : "min-h-[300px] lg:min-h-[500px]"
                  } relative`}
                >
                  {mediaType === "video" ? (
                    <video
                      src={frontendmedia}
                      controls
                      className="max-h-full w-auto max-w-full"
                    />
                  ) : (
                    <img
                      src={frontendmedia}
                      alt="Preview"
                      className="max-h-full w-auto max-w-full object-contain"
                    />
                  )}
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 p-2 bg-gray-900/70 hover:bg-gray-900 rounded-full transition-colors"
                    disabled={loading}
                  >
                    <X size={20} className="text-white" />
                  </button>

                  {/* Story Badge Overlay */}
                  {selectedOption === "story" && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <CircleUserRound size={16} />
                        <span>This will be visible for 24 hours</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Caption Section - Only for Post and Reel */}
                {selectedOption !== "story" && (
                  <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      {selectedOption === "post" ? (
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <PlusSquare size={20} className="text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                          <Clapperboard size={20} className="text-pink-600" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-800">
                        {selectedOption === "post"
                          ? "Add Post Details"
                          : "Add Reel Details"}
                      </h3>
                    </div>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      className="w-full flex-grow bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm lg:text-base min-h-[150px] lg:min-h-[200px]"
                      disabled={loading}
                    />
                    <div
                      className={`mt-4 text-xs flex items-center gap-2 ${
                        selectedOption === "post"
                          ? "text-purple-600"
                          : "text-pink-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedOption === "post"
                            ? "bg-purple-600"
                            : "bg-pink-600"
                        }`}
                      ></div>
                      <span>
                        Your {selectedOption} will be shared with your followers
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Spacer for mobile navbar */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
};

export default UploadPages;