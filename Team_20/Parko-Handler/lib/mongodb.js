import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: Please add your MongoDB URI to .env.local");
  process.exit(1); // Exit the process if MONGODB_URI is missing
}

let cached = globalThis.mongoose || { conn: null, promise: null };
globalThis.mongoose = cached; // Ensure it's stored globally

export async function connectDB() {
  if (cached.conn) return cached.conn; // Return existing connection

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        cached.promise = null; // Reset promise if connection fails
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
