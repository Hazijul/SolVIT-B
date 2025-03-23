import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);



export const details = async (req, res) => {

    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
    console.log(token)
    jwt.verify(token, "hifi", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        console.log("Decoded JWT Payload:", decoded); // Debugging

        const userId = decoded.userId;
        console.log(userId);

        sql`SELECT name, email, phoneNumber, address FROM school_login WHERE id = ${userId}`
            .then((result) => {
                if (result.length === 0) return res.status(404).json({ message: "User not found" });
                res.json(result[0]); // Return user details
            }
        )
    });

};