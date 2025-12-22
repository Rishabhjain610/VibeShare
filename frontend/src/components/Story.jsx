import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setStoryData } from "../redux/storySlice.js";
import StoryCard2 from "./StoryCard2.jsx";
import { StoryDataContext } from "../context/StoryContext.jsx";
const Story = () => {
  const { username } = useParams();

  const { serverUrl } = useContext(AuthDataContext);
  const { storyData, setStoryData } = useContext(StoryDataContext);
  const fetchStory = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getstory/${username}`,
        { withCredentials: true }
      );
      setStoryData(result.data);
    } catch (error) {
      console.error("Error fetching story data:", error);
    }
  };

  // Only prevent state updates after unmount, don't clear the story
  useEffect(() => {
    fetchStory();
  }, [username, serverUrl]); // Removed 'dispatch' from dependencies

  return (
    <div>
      {storyData ? (
        <StoryCard2 story={storyData} />
      ) : (
        <p className="text-center text-red-500">No story available</p>
      )}
    </div>
  );
};

export default Story;
