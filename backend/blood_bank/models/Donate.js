import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bank_id: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },

  blood_group: { 
    type: String, 
    required: true, 
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] 
  },
  units_donated: { 
    type: Number, 
    required: true, 
    min: [1, "At least 1 unit must be donated"], 
    max: [5, "Cannot donate more than 5 units at once"] 
  },
  donation_date: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: (val) => val <= new Date(),
      message: "Donation date cannot be in the future"
    }
  },
  status: { 
    type: String, 
    enum: ["verified", "pending"], 
    default: "pending" 
  }

}, { timestamps: true });

export default mongoose.model("Donate", donorSchema);
