import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { useSelector, useDispatch } from "react-redux";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser.jsx";
import UseGetOtherUser from "./hooks/UseGetOtherUser.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import UploadPages from "./pages/UploadPages.jsx";
import UseGetAllPost from "./hooks/UseGetAllPost.jsx";
import UseGetAllReels from "./hooks/UseGetAllReels.jsx";
import UseGetAllStories from "./hooks/UseGetAllStories.jsx";
import Messages from "./pages/Messages.jsx";
import Story from "./components/Story.jsx";
import MessageArea from "./components/MessageArea.jsx";
import Reels from "./pages/Reels.jsx";
import { io } from "socket.io-client";
import { AuthDataContext } from "./context/AuthContext.jsx";
import {setOnlineUsers } from "./redux/socketSlice.js";
import { SocketDataContext } from "./context/SocketContext.jsx";
import UseGetAllNotification from "./hooks/UseGetAllNotification.jsx";
import Notification from "./pages/Notification.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import { setNotificationData } from "./redux/userSlice.js";
const App = () => {
  UseGetCurrentUser();
  UseGetOtherUser();
  UseGetAllPost();
  UseGetAllReels();
  UseGetAllStories();
  UseGetAllNotification();
  const userData = useSelector((state) => state.user.userData);
  const notifications = useSelector((state) => state.user.notificationData);
  const {  onlineUsers } = useSelector((state) => state.socket);
  const { serverUrl } = useContext(AuthDataContext);
  const { socket, setSocket } = useContext(SocketDataContext);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData) {
      const socketIO = io(serverUrl, {
        query: { userId: userData._id },
      });
      console.log("Socket connected:", socketIO);
      setSocket(socketIO);
      socketIO.on("online-users",(data)=>{
        dispatch(setOnlineUsers(data));

      })
      socketIO?.on("newNotification",(data)=>{
      dispatch(setNotificationData([...notifications,data]));
    })
      return () => {
        socketIO.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userData]);
  
    
  
  return (
    <>
      <ToastContainer
        position="top-left"
        hideProgressBar={true}
        autoClose={1000}
        theme="dark"
        toastStyle={{
          background: "#18181b",
          color: "#fafafa",
          borderRadius: "10px",
          fontWeight: "500",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      />
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={userData ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={userData ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/profile/:username"
          element={userData ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={userData ? <EditProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/story/:username"
          element={userData ? <Story /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload"
          element={userData ? <UploadPages /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={userData ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/messagearea"
          element={userData ? <MessageArea /> : <Navigate to="/login" />}
        />
        <Route
          path="/reels"
          element={userData ? <Reels /> : <Navigate to="/login" />}
        />
        <Route
          path="/search"
          element={userData ? <SearchPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={userData ? <Notification /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
