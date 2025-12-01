import express from "express";
import { uploadReel,getAllReels,likes,commentOnReel } from "../controller/reels.controller.js";
const ReelRouter = express.Router();
ReelRouter.post("/uploadreel",uploadReel);
ReelRouter.get("/getallreels",getAllReels);
ReelRouter.post("/like/:reelId",likes);
ReelRouter.post("/comment/:reelId",commentOnReel);
export default ReelRouter;