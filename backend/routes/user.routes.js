import express from "express";
import { getCurrentUser,otherUser } from "../controller/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";
const Userrouter=express.Router();
Userrouter.get("/current",isAuth,getCurrentUser);
Userrouter.get("/other",isAuth,otherUser);
export default Userrouter;