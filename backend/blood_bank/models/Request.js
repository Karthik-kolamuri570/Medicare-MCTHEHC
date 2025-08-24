import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bank_id: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },

  blood_group: { 
    type: String, 
    required: true, 
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] 
  },
  units_requested: { 
    type: Number, 
    required: true, 
    min: [1, "Must request at least 1 unit"], 
    max: [10, "Cannot request more than 10 units"] 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "fulfilled"], 
    default: "pending" 
  },
  fulfilled_at: { 
    type: Date,
    validate: {
      validator: function(val) {
        return !val || val >= this.createdAt;
      },
      message: "Fulfilled date must be after request date"
    }
  }

}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
