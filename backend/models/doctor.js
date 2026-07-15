const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    contact: {
        type: String,
        required: [true, "Contact is required"],
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value);
            },
            message: "Contact should be a valid 10-digit number"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email should be unique"],
        validate: {
            validator: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: "Email should be valid"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should be of minimum 8 characters"]
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"]
    },
    experience: {
        type: Number,
        required: [true, "Experience is required"],
        validate: {
            validator: function (value) {
                return value > 0
            },
            message: "Experience should be greater than 0"
        }
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    hospital: {
        type: String,
        required: [true, "Hospital is required"]
    },
    feePerConsultation: {
        type: Number,
        required: [true, "Fee per consultation is required"],
        validate: {
            validator: function (value) {
                return value > 0
            },
            message: "Fee per consultation should be greater than 0"
        }
    },
    appointments: [{
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    fromTime: {
        type: String,
        required: [true, "Please provide your from time"],
    },
    toTime: {
        type: String,
        required: [true, "Please provide your to time"],
    },
    blockedDates: {
        type: [String],
        default: []
    },
    blockedSlots: [{
        date: { type: String, required: true },
        startTime: { type: String, required: true }
    }],
    status: {
        type: String,
        default: "pending",
    },
    unseenNotifications: {
        type: Array,
        default: []
    },
    seenNotifications: {
        type: Array,
        default: []
    },
    verifiedByAdmin: {
        type: String,
        default: "pending",
        required: true,
        enum: ['pending', 'approved', 'rejected']

    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    certification: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalRatingScore: {
        type: Number,
        default: 0
    }
});

// Indexes for fast querying (email index is implicit from unique:true on the field)
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ verifiedByAdmin: 1 });
doctorSchema.index({ location: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);