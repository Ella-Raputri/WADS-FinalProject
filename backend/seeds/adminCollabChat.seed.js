import { config } from "dotenv";
import connectDB from "../config/mongodb.js";
import ticketModel from "../models/ticketModel.js";
import adminCollabChatModel from "../models/adminCollabChatModel.js";

config();

const seedAdminCollabChat = async () => {
  try {
    await connectDB();

    const tickets = await ticketModel.find().lean();
    const messagesList = [
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

    const chatMessages = [];

    // proceed to seed the collab chat if the ticket is handled by admins
    for (const ticket of tickets) {
      if (!ticket.HandledBy || ticket.HandledBy.length === 0) continue; 

      for (const adminId of ticket.HandledBy) {
        const messageCount = Math.floor(Math.random() * 2) + 2; //even messages

        //create the new messages
        for (let i = 0; i < messageCount; i++) {
          chatMessages.push({
            TicketId: ticket._id,
            AdminId: adminId,
            Message: messagesList[Math.floor(Math.random() * messagesList.length)]
          });
        }
      }
    }
    //insert the new messages to the database
    if (chatMessages.length > 0) {
      await adminCollabChatModel.insertMany(chatMessages);
      console.log(`${chatMessages.length} admin collaboration chat messages seeded successfully!`);
    }

  } catch (error) {
    console.error("Error seeding admin collaboration chats:", error);
  }
};

seedAdminCollabChat();
