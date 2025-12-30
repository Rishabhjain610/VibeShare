import React, { useState, useContext,createContext } from "react";
export const SocketDataContext = createContext();
const SocketContext = ({ children }) => {
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export default SocketContext;
