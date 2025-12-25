import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './DB/db.js';
import Authrouter from './routes/auth.routes.js';
import Userrouter from './routes/user.routes.js';
import Postrouter from './routes/post.routes.js';
import ReelRouter from './routes/reels.routes.js';
import StoryRouter from './routes/story.routes.js';
import MessageRouter from './routes/message.routes.js';
import cookieParser from 'cookie-parser';
import { app,server } from './socket.js';
import cors from 'cors';
dotenv.config();

ConnectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:9000'],
  credentials: true,
}))

app.use("/api/auth",Authrouter);
app.use("/api/user",Userrouter);
app.use("/api/post",Postrouter);
app.use("/api/reel",ReelRouter);
app.use("/api/story",StoryRouter);
app.use("/api/message",MessageRouter);
server.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})