import mongoose from "mongoose";

const CompetitionRegistrationSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    CompTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CompetitionType", required: true },
    PaymentProof: { type: String, required: true },
    TwibbonProof: { type: String, required: true },
    Status: { 
      type: String, 
      required: true, 
      enum: ["Pending", "Accepted", "Rejected"] 
    },
    AdminComment: { type: String }
  }, {timestamps: true});
  
const competitionRegistrationModel = mongoose.models.CompetitionRegistration || mongoose.model('CompetitionRegistration', CompetitionRegistrationSchema);

export default competitionRegistrationModel