import { Router } from "express";
import {
  getMe,
  login,
  logout,
  signup,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateToken, getMe);
export default router;
