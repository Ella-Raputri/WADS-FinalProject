import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  MandarinName: { type: String },
  DOB: { type: Date },
  Gender: { type: String },
  Address: { type: String },
  Institution: { type: String },
  StudentCardPhoto: { type: String }, // URL
});

const AdminSchema = new mongoose.Schema({
  CompTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "CompetitionType" },
});

const UserSchema = new mongoose.Schema({
    FullName: { type: String, required: true },
    PhoneNumber: { type: String, required: true},
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true }, // Hashed
    Role: { type: String, required: true },
    Participant: { type: ParticipantSchema, default: null },
    Admin: { type: AdminSchema, default: null },
    IsDeleted: { type: Boolean, default: false },
    VerifyOtp: { type: String, default:'' },
    VerifyOtpExpireAt: { type: Number, default:0 },
    IsAccountVerified: { type: Boolean, default: false },
    ResetOtp: { type: String, default:'' },
    ResetOtpExpireAt: { type: Number, default:0 }
  }, { timestamps:true});

const userModel = mongoose.models.user || mongoose.model('user', UserSchema);

export default userModel