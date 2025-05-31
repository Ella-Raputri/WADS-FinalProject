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

    //seed the registration data based on the already existed tickets
    const registrationData = tickets.map(ticket => {
      //unique key for the registration based on the user id and comp type id (1 user can register more than 1 comp)
      //and one user can send more than 1 ticket about that competition
      const key = `${ticket.SenderId.toString()}|${ticket.CompTypeId.toString()}`;
      
      if (registeredUsers.has(key)) return null; //skip if the registration data is already exists
      registeredUsers.add(key);

      //the new registration data
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
