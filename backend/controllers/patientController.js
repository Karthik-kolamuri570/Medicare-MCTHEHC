const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new patient
exports.registerPatient = async (req, res) => {
    try {
        const { name, email, password, contact, age, gender, address } = req.body;
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Patient already exists"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new patient
        const newPatient = new Patient({
            name,
            email,
            password: hashedPassword,
            contact,
            age,
            gender,
            address
        });

        // Save patient
        await newPatient.save();
        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            data: newPatient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in patient registration",
            error: error.message
        });
    }
};

// Login patient
exports.loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if patient exists
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: patient._id, role: 'patient' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                role: 'patient',

            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in patient login",
            error: error.message
        });
    }
};

// Get patient profile
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId).select('-password');
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching patient profile",
            error: error.message
        });
    }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
    try {
        const patientId = req.params.patientId; // Extract patientId from params
        const { name, contact, age, gender, address } = req.body;
        
        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { name, contact, age, gender, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedPatient
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating patient profile",
            error: error.message
        });
    }
};


// Book an appointment
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, problem } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // Create appointment
        const appointment = {
            doctorId,
            doctorName: doctor.name,
            doctorSpecialization: doctor.specialization,
            date,
            time,
            problem,
            status: 'pending'
        };

        // Add appointment to patient
        const patient = await Patient.findById(req.params);
        patient.appointments.push(appointment);
        await patient.save();

        // Add notification to doctor
        const notification = {
            type: 'new-appointment',
            message: `New appointment request from ${patient.name}`,
            data: {
                patientId: patient._id,
                patientName: patient.name,
                date,
                time
            }
        };

        // Update doctor's unseenNotifications
        await Doctor.findByIdAndUpdate(req.params, {
            $push: { unseenNotifications: notification }
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error booking appointment",
            error: error.message
        });
    }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            data: patient.appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments",
            error: error.message
        });
    }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const patient = await Patient.findById(req.userId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Find appointment index
        const appointmentIndex = patient.appointments.findIndex(
            appt => appt._id.toString() === appointmentId
        );

        if (appointmentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Get appointment details before removing
        const appointment = patient.appointments[appointmentIndex];

        // Remove appointment
        patient.appointments.splice(appointmentIndex, 1);
        await patient.save();

        // Add notification to doctor
        const notification = {
            type: 'appointment-cancelled',
            message: `Appointment cancelled by ${patient.name}`,
            data: {
                patientId: patient._id,
                patientName: patient.name,
                date: appointment.date,
                time: appointment.time
            }
        };

        // Update doctor's unseenNotifications
        await Doctor.findByIdAndUpdate(appointment.doctorId, {
            $push: { unseenNotifications: notification }
        });

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error cancelling appointment",
            error: error.message
        });
    }
};


// Get notifications
exports.getNotifications = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            unseenNotifications: patient.unseenNotifications,
            seenNotifications: patient.seenNotifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: error.message
        });
    }
};

// Mark notifications as seen
exports.markNotificationsAsSeen = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Move all unseen notifications to seen
        patient.seenNotifications = [
            ...patient.seenNotifications,
            ...patient.unseenNotifications
        ];
        patient.unseenNotifications = [];

        await patient.save();

        res.status(200).json({
            success: true,
            message: "Notifications marked as seen"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error marking notifications as seen",
            error: error.message
        });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const patient = await Patient.findById(req.userId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Remove from seenNotifications
        patient.seenNotifications = patient.seenNotifications.filter(
            notification => notification._id.toString() !== notificationId
        );

        await patient.save();

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting notification",
            error: error.message
        });
    }
};
