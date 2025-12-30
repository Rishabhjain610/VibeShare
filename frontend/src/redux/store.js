import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import postSlice from "./postSlice.js";
import storySlice from "./storySlice.js";
import reelSlice from "./reelSlice.js";
import messageSlice from "./messageSlice.js";
import socketSlice from "./socketSlice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    reel: reelSlice,
    message: messageSlice,
    socket: socketSlice,
  },
});
export default store;
