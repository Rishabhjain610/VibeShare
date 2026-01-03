import http from "http";//http server creation
import express from "express";//create express server
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);//quick http server creation using express app single direction server 


const io=new Server(server,{
  cors:{
    origin:["http://localhost:5173",//frontend server
    "https://vibeshare-hj0f.onrender.com"
  ],
    methods:["GET","POST","PATCH","DELETE"]
  }
});//socket io server creation

const useSocketMap={};//map to store userId and socketId

export const getSocketId=(receiverId)=>{
  return useSocketMap[receiverId];//function to get socketId using userId
}

io.on("connection",(socket)=>{
  console.log("A user connected with socket id:",socket.id);
  const userId=socket.handshake.query.userId;//getting userId from query params
  if(userId!=undefined){
    useSocketMap[userId]=socket.id;//storing userId and socketId in map
  }

  socket.on("joinGroup",(groupId)=>{
    if(groupId){
      socket.join(groupId);//joining group room
    }
  })
  socket.on("leaveGroup",(groupId)=>{
    if(groupId){
      socket.leave(groupId);//leaving group room
    }
  })

  io.emit("online-users", Object.keys(useSocketMap));//emitting online users to all connected clients

  socket.on("disconnect",()=>{
    delete useSocketMap[userId];//removing userId and 
    // socketId from map on disconnect
  io.emit("online-users", Object.keys(useSocketMap));//emitting updated online users to all connected clients
  })
})

export {app,server,io};//exporting app and server and io instance