import User from "../models/User.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
