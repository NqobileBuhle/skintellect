import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.const.js";

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connection established");
  } catch (error) {
    console.log(`Failed to connect to database : ${error.message}`);
    process.exit(1);
  }
};

export default connectToDB;