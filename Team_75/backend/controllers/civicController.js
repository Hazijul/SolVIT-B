import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import express from "express";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });



router.post("/submit-issue", upload.single("file"), async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { issueType, description, location } = req.body;
        const filePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Extract token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        // Verify JWT
        const decoded = jwt.verify(token, "hifi");
        const userId = decoded.userId;

        // Insert into database
        const result = await sql`
            INSERT INTO civic_issues (userId, issueType, description, location, filePath) 
            VALUES (${userId}, ${issueType}, ${description}, ${location}, ${filePath})
            RETURNING issueid`;
        console.log("Result:", result);

        res.status(201).json({ message: "Issue submitted successfully!", issueId: result[0].issueid });
    } catch (error) {
        console.error("Error submitting issue:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

export default router;
