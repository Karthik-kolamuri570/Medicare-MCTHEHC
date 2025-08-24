const mongoose = require("mongoose");

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
    enum: ["pending", "accepted", "rejected", "fulfilled"], 
    default: "pending" 
  },
  requested_date: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: (val) => val >= new Date(),
      message: "Requested date cannot be in the past"
    }
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

module.exports = mongoose.model("Request", requestSchema);
