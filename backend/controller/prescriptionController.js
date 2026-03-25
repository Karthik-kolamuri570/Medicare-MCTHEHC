const Prescription = require('../models/prescription');
const Appointment = require('../models/appointments');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const { generatePrescriptionPDF } = require('../utils/pdfGenerator');
const { generatePresignedUrl } = require('../utils/s3Config');

/**
 * Create a prescription for an appointment (Doctor only)
 */
exports.createPrescription = async (req, res) => {
    try {
        const doctorId = req.user._id;
        const { appointmentId, diagnosis, medicines, additionalNotes, followUpDate } = req.body;

        if (!appointmentId || !diagnosis || !medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID, diagnosis, and at least one medicine are required"
            });
        }

        // Verify the appointment belongs to this doctor and is accepted
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        if (appointment.doctorId.toString() !== doctorId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to prescribe for this appointment" });
        }

        // Check if prescription already exists for this appointment
        const existingPrescription = await Prescription.findOne({ appointmentId });
        if (existingPrescription) {
            return res.status(400).json({ success: false, message: "A prescription already exists for this appointment" });
        }

        // Create the prescription
        const prescription = await Prescription.create({
            doctorId,
            patientId: appointment.patientId,
            appointmentId,
            diagnosis,
            medicines,
            additionalNotes: additionalNotes || "",
            followUpDate: followUpDate || null
        });

        // Populate doctor and patient info for PDF generation
        const populatedPrescription = await Prescription.findById(prescription._id)
            .populate('doctorId', 'name specialization hospital experience')
            .populate('patientId', 'name age gender contact email');

        // Generate PDF and upload to S3
        try {
            const pdfUrl = await generatePrescriptionPDF(populatedPrescription);
            prescription.pdfUrl = pdfUrl;
            await prescription.save();
        } catch (pdfErr) {
            console.error("PDF generation failed (prescription still saved):", pdfErr.message);
        }

        res.status(201).json({
            success: true,
            message: "Prescription created successfully",
            data: populatedPrescription
        });

    } catch (error) {
        console.error("Error creating prescription:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "A prescription already exists for this appointment" });
        }
        res.status(500).json({ success: false, message: "Error creating prescription", error: error.message });
    }
};

/**
 * Get prescription by appointment ID (Doctor or Patient)
 */
exports.getPrescriptionByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const prescription = await Prescription.findOne({ appointmentId })
            .populate('doctorId', 'name specialization hospital experience profileImage')
            .populate('patientId', 'name age gender contact email');

        if (!prescription) {
            return res.status(404).json({ success: false, message: "No prescription found for this appointment" });
        }

        const prescriptionObj = prescription.toObject();

        // Generate presigned URL for PDF download
        if (prescriptionObj.pdfUrl) {
            prescriptionObj.pdfDownloadUrl = await generatePresignedUrl(prescriptionObj.pdfUrl);
        }

        // Generate presigned URL for doctor profile image
        if (prescriptionObj.doctorId?.profileImage) {
            prescriptionObj.doctorId.profileImage = await generatePresignedUrl(prescriptionObj.doctorId.profileImage);
        }

        res.status(200).json({ success: true, data: prescriptionObj });

    } catch (error) {
        console.error("Error fetching prescription:", error);
        res.status(500).json({ success: false, message: "Error fetching prescription" });
    }
};

/**
 * Get all prescriptions for a patient
 */
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.user._id;

        const prescriptions = await Prescription.find({ patientId })
            .populate('doctorId', 'name specialization hospital profileImage')
            .populate('appointmentId', 'date time problem')
            .sort({ createdAt: -1 });

        // Generate presigned URLs
        const enriched = await Promise.all(prescriptions.map(async (p) => {
            const obj = p.toObject();
            if (obj.pdfUrl) {
                obj.pdfDownloadUrl = await generatePresignedUrl(obj.pdfUrl);
            }
            if (obj.doctorId?.profileImage) {
                obj.doctorId.profileImage = await generatePresignedUrl(obj.doctorId.profileImage);
            }
            return obj;
        }));

        res.status(200).json({ success: true, data: enriched });

    } catch (error) {
        console.error("Error fetching patient prescriptions:", error);
        res.status(500).json({ success: false, message: "Error fetching prescriptions" });
    }
};

/**
 * Get all prescriptions created by a doctor
 */
exports.getDoctorPrescriptions = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const prescriptions = await Prescription.find({ doctorId })
            .populate('patientId', 'name age gender')
            .populate('appointmentId', 'date time problem')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: prescriptions });

    } catch (error) {
        console.error("Error fetching doctor prescriptions:", error);
        res.status(500).json({ success: false, message: "Error fetching prescriptions" });
    }
};
