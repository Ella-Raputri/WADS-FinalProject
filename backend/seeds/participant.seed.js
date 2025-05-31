import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

config();

const seedParticipants = async () => {
  try {
    await connectDB(); 

    const participantUsers = [];

    for (let i = 1; i <= 30; i++) {
      const hashedPassword = await bcrypt.hash(`password123`, 10);

      const participantUser = {
        FullName: `Participant ${i}`,
        PhoneNumber: `0812987651234${i}`, 
        Email: `participant${i}@mail.com`,
        Password: hashedPassword,
        Role: "participant",
        Participant: {
          MandarinName: `Mandarin Name ${i}`,
          DOB: new Date(2000, i, i), // Example DOB
          Gender: i % 2 === 0 ? "Male" : "Female",
          Address: `Address ${i}, City Name`,
          Institution: `Institution ${i}`,
          StudentCardPhoto: `photo_${i}.jpg`
        },
        IsAccountVerified: true
      };
      participantUsers.push(participantUser);
    }

    await userModel.insertMany(participantUsers);
    console.log("Participant users seeded successfully!");

  } catch (error) {
    console.error("Error seeding participants:", error);
  }
};

seedParticipants();
