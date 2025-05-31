import competitionTypeModel from '../models/competitionTypeModel.js';
import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import userModel from '../models/userModel.js';
import ticketModel from '../models/ticketModel.js';

config();

//create random date for the ticket
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedTickets = async () => {
  try {
    await connectDB(); 
    const users = await userModel.find();

    //filter users based on their roles
    const participants = users.filter(user => user.Role === "participant" && user.Participant);
    const admins = users.filter(user => user.Role === "admin" && user.Admin);

    const compTypes = await competitionTypeModel.find(); //get all comp types

    //group admins based on their comp types
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

    //seed 500 tickets to the database
    for (let i = 0; i < 500; i++) { 
        //get random participant and competition type
        const participant = participants[Math.floor(Math.random() * participants.length)];
        const compTypeId = compTypes[Math.floor(Math.random() * compTypes.length)]._id; 

        //assign random admins based on comp type
        const assignedAdmins = adminGroups[compTypeId.toString()]; 
        const handlingAdmins = assignedAdmins.length > 1 
            ? assignedAdmins.slice(0, Math.floor(Math.random() * assignedAdmins.length) + 1) 
            : assignedAdmins; 

        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]; //randomize status

        const createdAt = randomDate(new Date(2025, 2, 1), new Date()); // Between March 1, 2025 and now
        let inProgressAt = null, resolvedAt = null, closedAt = null;

        //if in progress, also randomize the in progress at date between createdAt date and now
        if (["In Progress", "Resolved", "Closed"].includes(newStatus)) {
          inProgressAt = randomDate(createdAt, new Date());
        }
        //if resolved, also randomize the resolved date between inProgressAt if not null or createdAt date with now
        if (["Resolved", "Closed"].includes(newStatus)) {
          resolvedAt = randomDate(inProgressAt || createdAt, new Date());
        }
        //if closed, also randomize the closed date between resolvedAt if not null, inProgressAt if not null, or createdAt date with now
        if (newStatus === "Closed") {
          closedAt = randomDate(resolvedAt || inProgressAt || createdAt, new Date());
        }

        //create the new ticket
        const newTicket = {
          Subject: subjects[Math.floor(Math.random() * subjects.length)],
          PriorityType: priorityTypes[Math.floor(Math.random() * priorityTypes.length)],
          Status: newStatus,
          Description: "This is a sample ticket generated for testing.",
          Image: null,
          SenderId: participant._id,
          HandledBy: handlingAdmins.map(admin => admin._id),
          CompTypeId: compTypeId,

          CreatedAt: createdAt,
          BecomeInProgressAt: inProgressAt,
          BecomeResolvedAt: resolvedAt,
          BecomeClosedAt: closedAt
        };

        tickets.push(newTicket);
    }

    await ticketModel.insertMany(tickets); //insert to database
    console.log(`${tickets.length} tickets seeded successfully!`);
    
  } catch (error) {
    console.error("Error seeding tickets:", error);
  }
};

seedTickets();
