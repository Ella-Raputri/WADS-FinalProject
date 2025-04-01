import mongoose from "mongoose";

const AdminCollabChatSchema = new mongoose.Schema({
    TicketId: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true},
    AdminId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    Message: { type: String, required: true }
  }, {timestamps: true});
  
const adminCollabChatModel = mongoose.models.AdminCollabChat || mongoose.model('AdminCollabChat', AdminCollabChatSchema);

export default adminCollabChatModel