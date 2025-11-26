import express from "express";
import { getCurrentUser } from "../controller/user.controller.js";
import isAuth from "../middleware/auth.middleware.js";
const Userrouter=express.Router();
Userrouter.get("/current",isAuth,getCurrentUser);
export default Userrouter;