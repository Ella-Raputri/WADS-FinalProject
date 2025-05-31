import competitionTypeModel from '../models/competitionTypeModel.js';
import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

config();

const seedAdmins = async () => {
  try {
    await connectDB(); 
    const compTypes = await competitionTypeModel.find(); 

    const adminUsers = [];

    for (const compType of compTypes) {
      for (let i = 1; i <= 3; i++) {
        const hashedPassword = await bcrypt.hash(`password123`, 10);

        const adminUser = {
          FullName: `Admin ${i} - ${compType.Name}`,
          PhoneNumber: `081234567${i}${compType._id.toString().slice(-2)}`, 
          Email: `admin${i}@${compType.Name.toLowerCase().replace(/\s/g, '')}.com`,
          Password: hashedPassword,
          Role: "admin",
          Admin: { CompTypeId: [compType._id] }, 
          IsAccountVerified: true
        };

        adminUsers.push(adminUser);
      }
    }

    await userModel.insertMany(adminUsers);
    console.log("Admin users seeded successfully!");

  } catch (error) {
    console.error("Error seeding admins:", error);
  }
};

seedAdmins();
