import connectDB from "../../utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";  // Make sure the path to your nextauth file is correct

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method === "GET") {
    try {
      // Get the session to retrieve the logged-in user's email
      const session = await getServerSession(req, res, authOptions);
      
      // If session doesn't exist or email is not available, return an error
      if (!session || !session.user || !session.user.email) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userEmail = session.user.email; // Get the logged-in user's email

      // Connect to the database
      const db = await connectDB();

      // Fetch invoices that match the user's email
      const invoices = await db.collection("invoices").find({ userEmail }).toArray();

      // Return the invoices if any
      if (invoices.length > 0) {
        res.status(200).json(invoices);
      } else {
        res.status(404).json({ message: "No invoices found for this user." });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
