import express from "express";
import {fetchPriorityList} from "../controllers/priorityController.js";
const router = express.Router();

router.get("/priority-list", fetchPriorityList);

export default router;
