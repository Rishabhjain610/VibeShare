import React,{useState,useEffect,useContext, use} from 'react'
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { setOtherUsers,setUserData } from '../redux/userSlice.js';
import { AuthDataContext } from '../context/AuthContext';
const getOtherUser = () => {
  const {serverUrl}=useContext(AuthDataContext);
  const dispatch=useDispatch();
  const otherUsers=useSelector((state)=>state.user.setOtherUsers);
  const userData=useSelector((state)=>state.user.setUserData);
  const [loading,setLoading]=useState(false);
  const fetchOtherUsers=async()=>{
    setLoading(true);
    try {
      const response=await axios.get(`${serverUrl}/api/user/other`,{
        withCredentials:true
      });
      dispatch(setOtherUsers(response.data));
      setLoading(false);

    } catch (error) {
      console.error("Error fetching other users:",error);
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchOtherUsers();
  },[userData,otherUsers]);
  
}

export default getOtherUser