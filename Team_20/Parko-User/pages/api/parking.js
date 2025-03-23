import connectDB from "../../utils/db";


export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = await connectDB();
    const collection = db.collection("parking_location");

    // Fetch all parking locations
    const parkingSpots = await collection.find({}).toArray();

    res.status(200).json(parkingSpots);
  } catch (error) {
    console.error("Error fetching parking locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
