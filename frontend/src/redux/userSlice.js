import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  userData: null,
  otherUsers: null,
  profileData: null,
  searchData: [],
  notificationData:null // NEW STATE PROPERTY
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
    setSearchData: (state, action) => { // NEW ACTION
      state.searchData = action.payload;
    },
    setNotificationData: (state, action) => { // NEW ACTION
      state.notificationData = action.payload;
    },
    // ADD THIS NEW ACTION
    
  },
});

export const {
  setUserData,
  setOtherUsers,
  setProfileData,
  clearProfileData,
  setSearchData,
  setNotificationData,
   // EXPORT THE NEW ACTION
} = userSlice.actions;

export default userSlice.reducer;