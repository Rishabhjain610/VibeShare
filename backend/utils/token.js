import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genToken = async (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    return resizeBy.status(500).json({ message: "Error generating token" });
  }
};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    return res.status(500).json({ message: "Invalid token" });
  }
};

export { genToken, verifyToken };