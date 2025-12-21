import React,{useContext,createContext,useState} from 'react'
import { AuthDataContext } from './AuthContext.jsx';
export const StoryDataContext = createContext();

const StoryContext = ({children}) => {
  const {serverUrl}=useContext(AuthDataContext);
  const [storyData,setStoryData]=useState([]);
 
  return (
    <div>
      <StoryDataContext.Provider value={{storyData, setStoryData}}>
        {children}
      </StoryDataContext.Provider>
    </div>
  )
}

export default StoryContext