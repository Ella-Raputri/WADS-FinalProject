import mongoose from "mongoose";

const AdminUserChatSchema = new mongoose.Schema({
    TicketId: { type: mongoose.Schema.Types.ObjectId, ref: "ticket", required: true},
    AdminId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    SenderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    CompTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CompetitionType", required: true },
    Subject: { type: String, required: true },
    Message: { type: String, required: true }
  }, {timestamps: true});
  
const adminUserChatModel = mongoose.models.AdminUserChat || mongoose.model('AdminUserChat', AdminUserChatSchema);

export default adminUserChatModel