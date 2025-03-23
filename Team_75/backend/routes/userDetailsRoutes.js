import express from "express";
import { details } from "../controllers/userDetailsController.js";

const router = express.Router();


router.get("/user-details", details);

export default router;
