import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: [],
    storyList: null,
  },
  reducers: {
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },
  },
});
export const { setStoryData, setStoryList } = storySlice.actions;
export default storySlice.reducer;
