// models/admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  permissions: [{
    type: String,
    enum: [
      'manage_doctors',
      'manage_patients',
      'manage_appointments',
      'manage_payments',
      'manage_content',
      'manage_emergency',
      'manage_analytics'
    ]
  }],
  lastLogin: Date,
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);