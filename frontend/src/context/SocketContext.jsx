import React, { useState, useContext, createContext } from "react";
export const SocketDataContext = createContext();

const SocketContext = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const value = { socket, setSocket };

  return (
    <SocketDataContext.Provider value={value}>{children}</SocketDataContext.Provider>
  );
};

export default SocketContext;
