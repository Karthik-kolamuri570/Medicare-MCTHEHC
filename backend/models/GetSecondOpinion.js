const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondOpinionSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, "Doctor Id is required"]
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, "Patient Id is required"]
  },
  problem: {
    type: String,
    required: [true, "Problem is required"]
  },
  mode: {
    type: String,
    required: [true, "Mode is required"],
    enum: ["online", "offline"]
  },
  treatment: {
    type: String,
    required: [true, "Treatment is required"]
  },
  files: [{
    type: String // Assuming these are file URLs or paths
  }],
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending"
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: [true, "Time is required"]
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid"
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('GetSecondOpinion', secondOpinionSchema);
