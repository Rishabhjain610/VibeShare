import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './DB/db.js';
dotenv.config();
const app = express();
ConnectDB();


app.use(express.json());

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
})