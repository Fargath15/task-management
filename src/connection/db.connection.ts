import mongoose from "mongoose";

export class DBConnectionService {
  public static async createConnection() {
    try {
      await mongoose.connect(process.env.MONGO_URI as string, {});
      console.log("MongoDB Connected");
    } catch (error) {
      console.error("MongoDB Connection Error:", error);
      process.exit(1);
    }
  }
}
