const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, "Doctor ID is required"]
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, "Patient ID is required"]
    },
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'appointment',
        required: [true, "Appointment ID is required"],
        unique: true // One review per appointment
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [0.1, "Rating must be at least 0.1"],
        max: [5, "Rating cannot exceed 5"]
    },
    message: {
        type: String,
        maxlength: [500, "Message cannot exceed 500 characters"],
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ doctorId: 1, patientId: 1, appointmentId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
