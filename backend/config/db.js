import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
