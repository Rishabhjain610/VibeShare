import React from "react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthDataContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
const UseGetAllPost = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.post.postData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/post/all`, {
          withCredentials: true,
        });
        dispatch(setPostData(response.data));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [serverUrl, dispatch]);

  return <div>UseGetAllPost</div>;
};

export default UseGetAllPost;
