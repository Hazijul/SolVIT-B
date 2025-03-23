import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is set in .env.local
const dbName = "parko-data"; // Change this to your DB name

if (!uri) {
  throw new Error("Please add MONGODB_URI to your environment variables.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function connectDB() {
  const client = await clientPromise;
  return client.db(dbName); // Explicitly returning the database
}
