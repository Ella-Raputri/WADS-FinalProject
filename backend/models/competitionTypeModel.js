import mongoose from "mongoose";

const CompetitionTypeSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String },
    Price: { type: Number, required: true },
    Venue: { type: String, required: true },
    CompetitionDate: { type: Date, required: true },
    CompetitionTime: { type: String, required: true },
    MainPrize: { type: String },
    GradingAspect: { type: String },
  });
  
const competitionTypeModel = mongoose.models.CompetitionType || mongoose.model('CompetitionType', CompetitionTypeSchema);

export default competitionTypeModel