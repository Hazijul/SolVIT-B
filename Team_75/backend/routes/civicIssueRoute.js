import express from "express";
import { addIssue, getIssues } from "../controllers/civicIssueController.js";

const router = express.Router();

router.post("/", addIssue);
router.get("/", getIssues);

export default router;
