import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
const UseGetCurrentUser = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      dispatch(setUserData(response.data.user));
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, [dispatch, serverUrl]);
};

export default UseGetCurrentUser;