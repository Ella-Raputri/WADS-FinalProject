import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema(
  {
    SenderId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    Message: { type: String, required: true },
    Role: { type: String, required: true }
  }, 
  { timestamps: true }
);

const chatbotModel = mongoose.models.ChatbotHistory || mongoose.model('ChatbotHistory', ChatbotSchema);

export default chatbotModel;
