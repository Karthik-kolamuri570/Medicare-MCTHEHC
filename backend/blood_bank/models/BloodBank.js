const mongoose = require("mongoose");
const bloodBankSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Blood bank name is required"], 
    minlength: [3, "Name must be at least 3 characters"] 
  },
  license_no: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[A-Z0-9]{6,12}$/, "License number must be alphanumeric (6–12 chars)"] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"] 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [6, "Password must be at least 6 characters"] 
  },

  // Blood stock levels (cannot be negative)
  blood_groups:{
  A_pos: { type: Number, default: 0, min: 0 },
  A_neg: { type: Number, default: 0, min: 0 },
  B_pos: { type: Number, default: 0, min: 0 },
  B_neg: { type: Number, default: 0, min: 0 },
  O_pos: { type: Number, default: 0, min: 0 },
  O_neg: { type: Number, default: 0, min: 0 },
  AB_pos: { type: Number, default: 0, min: 0 },
  AB_neg: { type: Number, default: 0, min: 0 },
},
  location: { 
    type: String, 
    required: true, 
    minlength: [5, "Location must have at least 5 characters"] 
  },
  contact: { 
    type: String, 
    required: true, 
    match: [/^\d{10}$/, "Contact number must be a valid 10-digit number"] 
  },
  capacity: { type: Number, required: true, min: [10, "Capacity must be at least 10 units"] },
  // donates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donate' }],
  // requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]

}, { timestamps: true });

const BloodBank = mongoose.model("BloodBank", bloodBankSchema);
module.exports = BloodBank;

