import mongoose from "mongoose";

const CompetitionDateSchema = new mongoose.Schema({
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  FinalDate: { type: Date }
});

const CompetitionTypeSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: [String], default: [] }, 
  Price: { type: Number, required: true },
  Venue: { type: String, required: true },
  CompetitionDate: { type: CompetitionDateSchema, required: true },
  MainPrize: { type: [String], default: [] }, 
  GradingAspect: { type: [String], default: [] } 
});
  
const competitionTypeModel = mongoose.models.CompetitionType || mongoose.model('CompetitionType', CompetitionTypeSchema);

export default competitionTypeModel;