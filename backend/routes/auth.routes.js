import  {Signup,Login,Logout}  from "../controller/auth.controller.js";
import express from "express";
const Authrouter=express.Router();

Authrouter.post("/signup",Signup);
Authrouter.post("/login",Login);
Authrouter.post("/logout",Logout);


export default Authrouter;