import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    AdminId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    Rating: { type: Number, required: true },
    Comment: { type: String, default: '' }
  }, {timestamps: true});
  
const ratingModel = mongoose.models.AdminRating || mongoose.model('AdminRating', ratingSchema);

export default ratingModel