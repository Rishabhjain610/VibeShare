import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  otherUsers: null,
  profileData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    clearProfileData: (state) => {
      state.profileData = null;
    },
    // ADD THIS NEW ACTION
    
  },
});

export const {
  setUserData,
  setOtherUsers,
  setProfileData,
  clearProfileData,
   // EXPORT THE NEW ACTION
} = userSlice.actions;

export default userSlice.reducer;