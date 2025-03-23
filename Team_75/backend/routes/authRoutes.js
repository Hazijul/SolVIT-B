import express from "express";
import { signup, login, google, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.post("/verify-otp", verifyOtp);

export default router;
