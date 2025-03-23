import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { neon } from "@neondatabase/serverless";
import sendConfirmationEmail from "../config/mailer.js";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);
const saltRounds = 10;

const GOOGLE_CLIENT_ID = "677130562489-hrvdg2tp2hlt7v0e7l2el986jdpng4cu.apps.googleusercontent.com";
const JWT_SECRET = "hifi"; // Use env variables
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { email, password, phone, address, name} = req.body;
  console.log(email, password, phone, address, name);
  
  try {
    const existingUser = await sql`SELECT * FROM School_Login WHERE Email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email is already registered. Try logging in." });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) return res.status(500).json({ message: "Internal server error" });

      const newUser = await sql`
        INSERT INTO School_Login (Email, Password,name,phonenumber,address) 
        VALUES (${email}, ${hash},${name},${phone},${address}) RETURNING id;
      `;
      const userId = newUser?.[0]?.id;

      let otp = "";
      for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
      }

      await sql`INSERT INTO Confirmation_Token (Id, OTP) VALUES (${userId}, ${otp});`;

      const subject = "Email Verification";
      const text = `Your OTP: ${otp}`;

      const token = jwt.sign({ userId }, "hifi", { expiresIn: "5h" });
      await sendConfirmationEmail(email, subject, text);
      
      res.status(200).json({ message: "User registered", token });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql`SELECT * FROM School_Login WHERE Email = ${email}`;
    if (result.length === 0) return res.status(400).send("Email is not registered. Try Sign Up");
    const storedHashedPassword = result[0].password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);
    if (!isMatch) return res.status(401).send("Invalid credentials");
    console.log("auth login result",result)
    const userId = result[0].id;
    console.log("auth login userId",userId)
    const token = jwt.sign({ userId: userId }, "hifi", { expiresIn: "1h" });
    console.log("auth login token",token)

    res.status(200).json({ userId, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const google = async (req,res) =>{
    const { token } = req.body; // Get token from frontend

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // Extract user info
        const { email, name, picture } = payload;

        const existingUser = await sql`SELECT * FROM School_Login WHERE Email = ${email}`;

        if(!existingUser){
        await sql`INSERT INTO School_Login (Email, is_active) VALUES (${email}, true) RETURNING Id;`;
        }
        
        // Create JWT Token
        const userJwt = jwt.sign({ email, name, picture }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token: userJwt, user: { email, name, picture } });
    } catch (error) {
        res.status(401).json({ message: "Invalid Google token" });
    }
}


export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  console.log(userId, otp);

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const decoded = jwt.verify(userId, "hifi"); // Use your secret key
  const decodedUserId = decoded.userId;  // Extract userId

  const otpRecord = await sql`
      SELECT otp FROM Confirmation_Token 
      WHERE id = ${decodedUserId} AND otp = ${otp};
    `;

    if (otpRecord.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await sql`UPDATE School_Login SET is_active = TRUE WHERE id = ${decodedUserId}`;

    // OTP verified, remove it from the database
    await sql`DELETE FROM Confirmation_Token WHERE id = ${decodedUserId};`;

    res.status(200).json({ message: "OTP verified successfully" });
};