import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import ticketModel from "../models/ticketModel.js";
import competitionRegistrationModel from "../models/competitionRegistrationModel.js";

config();

const seedCompetitionRegistrations = async () => {
  try {
    await connectDB();

    const tickets = await ticketModel.find().lean();
    const registeredUsers = new Set(); 

    const registrationData = tickets.map(ticket => {
      if (registeredUsers.has(ticket.SenderId.toString())) return null; 
      registeredUsers.add(ticket.SenderId.toString());

      return {
        UserId: ticket.SenderId,
        CompTypeId: ticket.CompTypeId, 
        PaymentProof: "sample_payment_proof.jpg",
        TwibbonProof: "sample_twibbon_proof.jpg",
        Status: ["Pending", "Accepted", "Rejected"][Math.floor(Math.random() * 3)], // Random status
        AdminComment: "Auto-generated registration entry.",
      };
    }).filter(Boolean); 

    await competitionRegistrationModel.insertMany(registrationData);
    console.log(`${registrationData.length} competition registrations seeded successfully!`);

  } catch (error) {
    console.error("Error seeding competition registrations:", error);
  }
};

seedCompetitionRegistrations();
