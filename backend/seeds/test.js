import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';

config();

async function updateRoles() {
    try {
        await connectDB();
        const result = await userModel.updateMany(
            { Role: "Admin" }, 
            { $set: { Role: "admin" } }
        );
        console.log(`${result.modifiedCount} document(s) updated.`);
    } 
    catch(error){
        console.log(error);
    }
}

updateRoles();
