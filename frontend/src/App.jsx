import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import {useSelector} from "react-redux"
import getCurrentUser from "./hooks/getCurrentUser.jsx";

const App = () => {
  getCurrentUser();
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
        <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={userData ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot-password" element={userData ? <Navigate to="/" /> : <ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;
