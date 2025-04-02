import competitionTypeModel from '../models/competitionTypeModel.js';
import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';
import ticketModel from '../models/ticketModel.js';

config();

const seedTickets = async () => {
  try {
    await connectDB(); 
    const users = await userModel.find();

    const participants = users.filter(user => user.Role === "participant" && user.Participant);
    const admins = users.filter(user => user.Role === "admin" && user.Admin);

    const compTypes = await competitionTypeModel.find();

    const adminGroups = {};
    for (const admin of admins) {
      const compTypeId = admin.Admin.CompTypeId.toString();
      if (!adminGroups[compTypeId]) {
        adminGroups[compTypeId] = [];
      }
      adminGroups[compTypeId].push(admin);
    }

    const priorityTypes = ["Urgent", "High", "Medium", "Low"];
    const statuses = ["Open", "Closed", "In Progress", "Resolved"];
    const subjects = ["System Issue", "Login Problem", "Submission Error", "General Inquiry"];

    const tickets = [];

    for (let i = 0; i < 150; i++) { 
        const participant = participants[Math.floor(Math.random() * participants.length)];
        const compTypeId = compTypes[Math.floor(Math.random() * compTypes.length)]._id; 

        const assignedAdmins = adminGroups[compTypeId.toString()]; 
        const handlingAdmins = assignedAdmins.length > 1 
            ? assignedAdmins.slice(0, Math.floor(Math.random() * assignedAdmins.length) + 1) 
            : assignedAdmins; 

        const newTicket = {
            Subject: subjects[Math.floor(Math.random() * subjects.length)],
            PriorityType: priorityTypes[Math.floor(Math.random() * priorityTypes.length)],
            Status: statuses[Math.floor(Math.random() * statuses.length)],
            Description: "This is a sample ticket generated for testing.",
            SenderId: participant._id,
            HandledBy: handlingAdmins.map(admin => admin._id),
            CompTypeId: compTypeId
        };

        tickets.push(newTicket);
    }

    await ticketModel.insertMany(tickets);
    console.log(`${tickets.length} tickets seeded successfully!`);
    
  } catch (error) {
    console.error("Error seeding tickets:", error);
  }
};

seedTickets();
