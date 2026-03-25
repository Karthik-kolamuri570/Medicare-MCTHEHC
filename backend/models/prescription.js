const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    name: {
        type: String,
        required: [true, "Medicine name is required"]
    },
    dosage: {
        type: String,
        required: [true, "Dosage is required"]
    },
    frequency: {
        type: String,
        required: [true, "Frequency is required"],
        enum: ['Once daily', 'Twice daily', 'Thrice daily', 'Four times daily', 'As needed', 'Before meals', 'After meals', 'At bedtime']
    },
    duration: {
        type: String,
        required: [true, "Duration is required"]
    },
    notes: {
        type: String,
        default: ""
    }
}, { _id: false });

const prescriptionSchema = new Schema({
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
        required: [true, "Appointment ID is required"]
    },
    diagnosis: {
        type: String,
        required: [true, "Diagnosis is required"],
        maxlength: [1000, "Diagnosis cannot exceed 1000 characters"]
    },
    medicines: {
        type: [medicineSchema],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "At least one medicine is required"
        }
    },
    additionalNotes: {
        type: String,
        default: "",
        maxlength: [2000, "Additional notes cannot exceed 2000 characters"]
    },
    followUpDate: {
        type: String,
        default: null
    },
    pdfUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Indexes
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ appointmentId: 1 }, { unique: true }); // One prescription per appointment

module.exports = mongoose.model('Prescription', prescriptionSchema);
