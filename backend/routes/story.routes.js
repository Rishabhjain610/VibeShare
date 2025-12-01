import express from "express";
import {
  uploadsStory,
  viewStory,
  getStoryByUsername,
} from "../controller/story.controller.js";
import upload from "../middleware/multer.middleware.js";
const StoryRouter = express.Router();
StoryRouter.post("/uploadstory", upload.single("media"), uploadsStory);
StoryRouter.get("/viewstory/:storyId", viewStory);
StoryRouter.get("/getstory/:username", getStoryByUsername);
export default StoryRouter;
