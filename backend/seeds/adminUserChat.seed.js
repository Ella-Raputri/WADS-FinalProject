import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import ticketModel from "../models/ticketModel.js";
import adminUserChatModel from "../models/adminUserChatModel.js";

config();

const seedAdminUserChat = async () => {
  try {
    await connectDB();

    const tickets = await ticketModel.find().lean();
    const messagesListAdmin = [
      "I'll check this issue.",
      "Can you provide more details?",
      "Looking into this now.",
      "This should be resolved soon.",
      "I'm escalating this to another admin.",
      "Try refreshing the page and let me know if it works.",
      "We are currently investigating this issue.",
      "The issue has been identified, we are working on a fix.",
      "I've updated the ticket status to 'In Progress'.",
      "Please provide a screenshot for better understanding."
    ];
    const messagesListUser = [
        "Ok thank you.",
        "Hello thanks",
        "Please solve it ASAP.",
        "Reply soon.",
        "Oh okay.",
        "Thanks."
    ];

    const chatMessages = [];

    for (const ticket of tickets) {
        if (!ticket.HandledBy || ticket.HandledBy.length === 0) continue; 
        const admins = ticket.HandledBy;

        const messageCount = Math.floor(Math.random() * 2) + 1; 
        for (let i = 0; i < messageCount; i++) {
          chatMessages.push({ //participant
            TicketId: ticket._id,
            SenderId: ticket.SenderId,
            CompTypeId: ticket.CompTypeId,
            Subject: `Subject ${i}`,
            Message: messagesListUser[Math.floor(Math.random() * messagesListUser.length)]
          });

          const adminId = admins[Math.floor(Math.random() * admins.length)]
          chatMessages.push({ //admin
            TicketId: ticket._id,
            SenderId: adminId,
            CompTypeId: ticket.CompTypeId,
            Subject: `Subject Adminn ${i}`,
            Message: messagesListAdmin[Math.floor(Math.random() * messagesListAdmin.length)]
          });
        }
      
    }

    if (chatMessages.length > 0) {
      await adminUserChatModel.insertMany(chatMessages);
      console.log(`${chatMessages.length} admin user chat messages seeded successfully!`);
    }

  } catch (error) {
    console.error("Error seeding admin user chats:", error);
  }
};

seedAdminUserChat();
