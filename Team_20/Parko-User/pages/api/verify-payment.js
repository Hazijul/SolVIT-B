import { MongoClient } from "mongodb";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectDB from "../../utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay Key Secret
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      try {
        // Connect to the database
        const db = await connectDB();

        // Update the invoice status to "Paid" based on userEmail
        const result = await db.collection("invoices").updateOne(
          { userEmail }, // Find the invoice by userEmail
          {
            $set: { status: "Paid" }, // Update the status to "Paid"
          }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ success: false, message: "Invoice not found or already paid" });
        }
      } catch (error) {
        console.error("Error updating invoice:", error);
        res.status(500).json({ success: false, message: "Failed to update invoice" });
      }
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
