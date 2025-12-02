import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { useSelector } from "react-redux";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser.jsx";
import UseGetOtherUser from "./hooks/UseGetOtherUser.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import UploadPages from "./pages/UploadPages.jsx";
import UseGetAllPost from "./hooks/UseGetAllPost.jsx";
const App = () => {
  UseGetCurrentUser();
  UseGetOtherUser();
  UseGetAllPost();
  const userData = useSelector((state) => state.user.userData);

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
          path="/upload"
          element={userData ? <UploadPages /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
