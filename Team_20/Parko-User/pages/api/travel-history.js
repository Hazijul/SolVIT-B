import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]"; // Ensure correct auth config import
import connectDB from "../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = await connectDB();
    const collection = db.collection("plans");

    // Fetch all plans for the logged-in user
    const history = await collection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ history: history || [] });
  } catch (error) {
    console.error("Error fetching travel history:", error);
    res.status(500).json({ error: "Failed to fetch travel history" });
  }
}
