import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './DB/db.js';
import Authrouter from './routes/auth.routes.js';
import Userrouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const app = express();
ConnectDB();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:9000'],
  withCredentials: true,
}))

app.use("/api/auth",Authrouter);
app.use("/api/user",Userrouter);

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})