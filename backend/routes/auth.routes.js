import  {Signup,Login,Logout,sendOtp,verifyOtp,resetPassword}  from "../controller/auth.controller.js";
import express from "express";
const Authrouter=express.Router();

Authrouter.post("/signup",Signup);
Authrouter.post("/login",Login);
Authrouter.post("/logout",Logout);
Authrouter.post("/send-otp",sendOtp);
Authrouter.post("/verify-otp",verifyOtp);
Authrouter.post("/reset-password",resetPassword);


export default Authrouter;