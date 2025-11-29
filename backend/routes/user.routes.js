import express from "express";
import { getCurrentUser,otherUser,editProfile,getprofile } from "../controller/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const Userrouter=express.Router();
Userrouter.get("/current",isAuth,getCurrentUser);
Userrouter.get("/other",isAuth,otherUser);

Userrouter.post("/edit-profile",isAuth,upload.single("profilePic"),editProfile);
Userrouter.get("/profile/:username",isAuth,getprofile);
export default Userrouter;