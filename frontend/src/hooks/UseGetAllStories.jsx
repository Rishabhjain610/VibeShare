import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setReelData } from "../redux/reelSlice";
import { setStoryList } from "../redux/storySlice.js";
const UseGetAllStories = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const storyList = useSelector((state) => state.story.storyList);
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const fetchStories=async()=>{
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/story/followedstories`, {
        withCredentials: true,
      });
      console.log("Fetched Stories:", response.data);
      dispatch(setStoryList(response.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchStories();
  }, [serverUrl, dispatch]);
   return <div>UseGetAllStories</div>;
};

export default UseGetAllStories;
