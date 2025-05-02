import mongoose from "mongoose";
import { config } from "./config.js";

async function connectToDB() {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    if (!config.mongodbUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(config.mongodbUri);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.log("❌ Error connecting to MongoDB: ", err.message);
    // Don't exit process, let the app continue even if DB connection fails
  }
}

export default connectToDB;