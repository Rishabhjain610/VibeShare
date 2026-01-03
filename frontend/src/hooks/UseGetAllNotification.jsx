import React from 'react'
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthDataContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationData } from '../redux/userSlice';
const UseGetAllNotification = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const userData = useSelector((state) => state.user.userData);
  const notificationData = useSelector((state) => state.user.notificationData);
  const dispatch = useDispatch();
  const fetchNotifications=async()=>{
    try {
      const response=await axios.get(`${serverUrl}/api/user/notifications`,{withCredentials:true});
      console.log("Notifications fetched:",response.data.notifications);
      dispatch(setNotificationData(response.data.notifications));
    } catch (error) {
      console.error("Error fetching notifications:",error);
      
    }
  }
  useEffect(() => {
    if (userData) fetchNotifications();
  }, [userData, serverUrl]);

  return null;
}

export default UseGetAllNotification