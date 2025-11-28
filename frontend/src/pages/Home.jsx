import React from "react";
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      {/* Main content container */}
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <LeftHome />
        <Feed />
        <RightHome />
      </div>
      
      {/* Floating navbar - outside the flex container */}
      <Navbar />
    </>
  );
};

export default Home;