import http from "http";//http server creation
import express from "express";//create express server
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);//quick http server creation using express app single direction server 


const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",//frontend server
    methods:["GET","POST","PATCH","DELETE"]
  }
});//socket io server creation

const useSocketMap={};//map to store userId and socketId


export {app,server,io};//exporting app and server and io instance