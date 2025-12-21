import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);

export default router;
