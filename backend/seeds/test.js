import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';
import ticketModel from "../models/ticketModel.js";

config();


const getDistinctSenderIds = async () => {
  try {
    await connectDB();
    const senderIds = await ticketModel.distinct("SenderId");
    console.log("Distinct SenderIds:", senderIds);
  } catch (error) {
    console.error("Error fetching distinct SenderIds:", error);
  }
};

getDistinctSenderIds();


