const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const patientSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        validate: {
            validator: function (value) {
                return value > 0
            },
            message: "Age should be greater than 0"
        }
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
            values: ['male', 'female', 'other'],
            message: "Gender should be either male, female or other"
        }
    },
    address: {
        type: String,
        required: [true, "Address is required"]
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
    unseenNotifications: {
        type: Array,
        default: []
    },
    seenNotifications: {
        type: Array,
        default: []
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
    medicalRecords: [{
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String },
        uploadedAt: { type: Date, default: Date.now }
    }]

})

// Indexes for fast querying (email index implicit from unique:true)
patientSchema.index({ contact: 1 });

module.exports = mongoose.model("Patient", patientSchema);