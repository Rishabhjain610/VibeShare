import express from "express";
import {
  uploadsStory,
  viewStory,
  getStoryByUsername,
  getFollowedStories,
  likeStory
} from "../controller/story.controller.js";
import upload from "../middleware/multer.middleware.js";
import isAuth from "../middleware/auth.middleware.js";
const StoryRouter = express.Router();
StoryRouter.post("/uploadstory", isAuth, upload.single("media"), uploadsStory);
StoryRouter.get("/viewstory/:storyId", isAuth, viewStory);
StoryRouter.get("/getstory/:username", isAuth, getStoryByUsername);
StoryRouter.get("/followedstories", isAuth, getFollowedStories);
StoryRouter.get("/likestory/:storyId", isAuth, likeStory);
export default StoryRouter;
