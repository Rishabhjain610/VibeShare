import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import { setStoryData } from "../redux/storySlice.js";
const UseGetCurrentUser = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const {storyData}=useSelector((state)=>state.story)
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
     
      dispatch(setUserData(response.data.user));
      dispatch(setStoryData(response.data.story));
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, [dispatch, serverUrl, storyData]);
};

export default UseGetCurrentUser;