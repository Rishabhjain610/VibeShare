import { verifyToken } from "../utils/token.js";
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verifyed = await verifyToken(token);
    req.userId = verifyed.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default isAuth;
