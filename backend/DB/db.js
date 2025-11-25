import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const ConnectDB=async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
export default ConnectDB;