import CivicIssue from "../models/CivicIssue.js";
import multer from "multer";
import path from "path";

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("file");

// Add a new civic issue
export const addIssue = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const { issue, description, location } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const newIssue = new CivicIssue({
        issue,
        description,
        file: filePath,
        location,
      });

      await newIssue.save();
      res.status(201).json(newIssue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await CivicIssue.find();
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
