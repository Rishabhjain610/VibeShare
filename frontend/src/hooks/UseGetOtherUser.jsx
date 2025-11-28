import React,{useState,useEffect,useContext, use} from 'react'
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { setOtherUsers,setUserData } from '../redux/userSlice.js';
import { AuthDataContext } from '../context/AuthContext';
const UseGetOtherUser = () => {
  const {serverUrl}=useContext(AuthDataContext);
  const dispatch=useDispatch();
  
  const [loading,setLoading]=useState(false);
  const fetchOtherUsers=async()=>{
    setLoading(true);
    try {
      const response=await axios.get(`${serverUrl}/api/user/other`,{
        withCredentials:true
      });
      dispatch(setOtherUsers(response.data.otheruser));
      setLoading(false);

    } catch (error) {
      console.error("Error fetching other users:",error);
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchOtherUsers();
  },[dispatch,serverUrl]);
  
}

export default UseGetOtherUser;