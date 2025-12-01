import { uploadPost,getAllPosts,likes,commentOnPost,savedPosts } from "../controller/post.controller.js";
import express from "express";
import isAuth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const Postrouter=express.Router();
Postrouter.post("/upload",isAuth,upload.single("media"),uploadPost);
Postrouter.get("/all",isAuth,getAllPosts);
Postrouter.post("/like/:postId",isAuth,likes);
Postrouter.post("/comment/:postId",isAuth,commentOnPost);
Postrouter.post("/save/:postId",isAuth,savedPosts);

export default Postrouter;