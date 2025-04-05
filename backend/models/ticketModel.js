import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    Subject: { type: String, required: true },
    PriorityType: { 
      type: String, 
      required: true, 
      enum: ["Urgent", "High", "Medium", "Low"] 
    },
    Status: { 
      type: String, 
      required: true, 
      enum: ["Open", "Closed", "In Progress", "Resolved"] 
    },
    Description: { type: String },
    Image: { type: String, default: null },
    SenderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    HandledBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    CompTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CompetitionType", required: true },
    CreatedAt: { type: Date, default: Date.now },
    BecomeInProgressAt: { type: Date, default: null },
    BecomeResolvedAt: { type: Date, default: null },
    BecomeClosedAt: { type: Date, default: null }
  });
  
const ticketModel = mongoose.models.ticket || mongoose.model('ticket', TicketSchema);

export default ticketModel