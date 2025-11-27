import User from "../models/user.model.js";
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const otherUser = async (req, res) => {
  try {
    const otheruser = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json({ otheruser });
  } catch (error) {
    console.error("Error fetching other users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { getCurrentUser, otherUser };
