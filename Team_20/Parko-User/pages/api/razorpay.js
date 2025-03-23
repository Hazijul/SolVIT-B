// pages/api/razorpay.js

import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Razorpay Key Secret
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency = "INR" } = req.body;

    try {
      const options = {
        amount: amount*10,  // Amount in paise (Razorpay works in paise)
        currency,
        receipt: `receipt#${Math.random() * 10000}`,
        payment_capture: 1,  // Automatically capture payment after successful transaction
      };

      // Create order via Razorpay API
      const order = await razorpayInstance.orders.create(options);

      // Return order details to frontend
      res.status(200).json({
        razorpayOrderId: order.id,
        amount: options.amount,
        currency: options.currency,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
