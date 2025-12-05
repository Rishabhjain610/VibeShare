import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setReelData } from "../redux/reelSlice";
const UseGetAllReels = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const reelData = useSelector((state) => state.reel.reelData);
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const fetchReels=async()=>{
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/api/reel/getallreels`, {
        withCredentials: true,
      });
      console.log("Fetched Reels:", response.data);
      dispatch(setReelData(response.data));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reels:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchReels();
  }, [serverUrl, dispatch]);
   return <div>UseGetAllReels</div>;
};

export default UseGetAllReels;
