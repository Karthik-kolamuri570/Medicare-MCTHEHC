const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointments');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const GetSecondOpinion = require('../models/GetSecondOpinion');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { createNotification, emitNotification } = require('../utils/notification');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendBookingConfirmation, sendDoctorNotification, sendCancellationEmail } = require('../utils/emailService');
const { generatePresignedUrl } = require('../utils/s3Config');
exports.registerPatient = async (req, res) => {
    try {
        console.log('Under Register Patient Controller');

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
        const patientData = {
            name,
            email,
            password: hashedPassword,
            contact,
            age,
            gender,
            address
        };

        if (req.file && req.file.location) {
            patientData.profileImage = req.file.location;
        }

        const newPatient = new Patient(patientData);

        // Save patient
        await newPatient.save();

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            data: {
                id: newPatient._id,
                name: newPatient.name,
                email: newPatient.email,
                profileImage: newPatient.profileImage ? await generatePresignedUrl(newPatient.profileImage) : null
            }
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
// Login patient
exports.loginPatient = async (req, res) => {
    try {
        console.log(`Under Login Patient Controller with email: ${req.body.email}`);
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
        // Generate tokens
        const tokenPayload = { id: patient._id, role: 'patient' };
        const token = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            refreshToken,
            data: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                role: 'patient',
                profileImage: patient.profileImage ? await generatePresignedUrl(patient.profileImage) : null
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in patient login",
            error: error.message
        });
    }
};

exports.getPatientProfile = async (req, res, next) => {
    try {
        const patientId = req.user._id; // Assuming auth middleware sets req.user
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }
        const patientObj = patient.toObject();
        if (patientObj.profileImage) {
            patientObj.profileImage = await generatePresignedUrl(patientObj.profileImage);
        }

        res.status(200).json({
            success: true,
            data: patientObj
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
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

        const patientObj = patient.toObject();
        if (patientObj.profileImage) {
            patientObj.profileImage = await generatePresignedUrl(patientObj.profileImage);
        }

        res.status(200).json({
            success: true,
            data: patientObj
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
        const patientId = req.user._id; // Extract patientId from params
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


exports.bookAppointment = async (req, res) => {
    try {
        console.log('Under Booked Appointment Controller');
        const patientId = req.user._id.toString();
        const { doctorId, problem, date, time } = req.body;
        console.log(patientId, doctorId, problem, date, time);
        console.log(req.user._id.toString())
        if (!patientId || !doctorId || !problem || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Fetch doctor info
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        // Only allow bookings with admin-approved doctors
        if (doctor.verifiedByAdmin !== 'approved') {
            return res.status(403).json({ success: false, message: 'Doctor is not approved for appointments' });
        }
        //Verifying the patient is booked the apppointment in Doctor Available Time
        if (doctor.fromTime > time || doctor.toTime < time) {
            console.log("The Time where YOu Book the doctor doesn't available... ");
            return res.json({ success: false, message: " Please Book an Appointment Between the Doctor Available Time" });
        }
        const patient = await Patient.findOne({ _id: patientId });
        if (!patient) { return res.status(404).json({ success: false, message: "Patient not found" }) }
        console.log('all validations are now available');

        // Create new appointment
        const newAppointment = await Appointment.create({
            doctorId: doctorId,
            patientId: patientId,
            problem,
            specialization: doctor.specialization, // Fixed typo
            date,
            time
        });

        //sending notification to doctor
        const notification = createNotification('new-appointment', `New appointment request from ${patient.name}`, {
            patientId: patient._id, patientName: patient.name, date, time
        });

        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { unseenNotifications: notification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), doctorId, 'doctor');

        //sending nootifiaction to patient for confirmation
        const patientNotification = createNotification('appointment-booked', `Appointment booked successfully with Dr. ${doctor.name}`, {
            doctorId: doctor._id, doctorName: doctor.name, date, time
        });
        await Patient.findByIdAndUpdate(patientId, {
            $push: { unseenNotifications: patientNotification }
        });

        // Emit Socket Notifications
        const io = req.app.get('socketio');
        emitNotification(io, doctorId, 'doctor');
        emitNotification(io, patientId, 'patient');

        // Send Email Confirmation
        const emailDetails = {
            patientName: patient.name,
            doctorName: doctor.name,
            date: date,
            time: time
        };
        await sendBookingConfirmation(patient.email, emailDetails);

        // Send Email to Doctor
        await sendDoctorNotification(doctor.email, {
            doctorName: doctor.name,
            patientName: patient.name,
            date: date,
            time: time,
            type: 'Standard Appointment'
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: newAppointment
        });

    } catch (err) {
        console.error("Error in booking appointment:", err);
        return res.status(500).json({
            success: false,
            message: "Error in booking appointment",
            error: err.message
        });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user._id;
        console.log("Patient ID:", patientId);

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const appointments = await Appointment.find({ patientId: patientId }).populate('doctorId', 'name specialization profileImage');
        console.log("Fetched Appointments:", appointments);

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No appointments found for this patient"
            });
        }

        // Generate presigned URLs for doctor profile images
        const enrichedAppointments = await Promise.all(appointments.map(async (appt) => {
            const apptObj = appt.toObject();
            if (apptObj.doctorId && apptObj.doctorId.profileImage) {
                apptObj.doctorId.profileImage = await generatePresignedUrl(apptObj.doctorId.profileImage);
            }
            return apptObj;
        }));

        res.status(200).json({
            success: true,
            data: enrichedAppointments
        });
    } catch (err) {
        console.error("Error in fetching appointments:", err);
        return res.status(500).json({
            success: false,
            message: "Error in fetching appointments",
            error: err.message
        });
    }
}
exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        appointment.status = "Cancelled";
        await appointment.save();

        const patient = await Patient.findById(appointment.patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        // Add notification to doctor
        const notification = createNotification('appointment-cancelled', `Appointment cancelled by ${patient.name}`, {
            patientId: patient._id, patientName: patient.name, date: appointment.date, time: appointment.time
        });

        // Update doctor's unseenNotifications
        await Doctor.findByIdAndUpdate(appointment.doctorId, {
            $push: { unseenNotifications: notification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), appointment.doctorId, 'doctor');

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        const patientNotification = createNotification('appointment-cancelled', `Your appointment with Dr. ${doctor.name} on ${appointment.date} was cancelled.`, {
            appointmentId: appointment._id
        });
        await Patient.findByIdAndUpdate(patient._id, {
            $push: { unseenNotifications: patientNotification }
        });

        // Emit Socket Notifications
        const io = req.app.get('socketio');
        emitNotification(io, appointment.doctorId, 'doctor');
        emitNotification(io, patient._id, 'patient');

        // Send Email to Patient
        await sendCancellationEmail(patient.email, {
            patientName: patient.name,
            doctorName: doctor.name,
            date: appointment.date,
            time: appointment.time
        });

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    }
    catch (err) {
        console.error("Error in cancelling appointment:", err);
        return res.status(500).json({
            success: false,
            message: "Error in cancelling appointment",
            error: err.message
        });
    }
}
exports.getNotifications = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        res.status(200).json({
            success: true,
            data: {
                unseenNotifications: patient.unseenNotifications || [],
                seenNotifications: patient.seenNotifications || []
            }
        });
    } catch (err) {
        console.error("Error in fetching notifications:", err);
        return res.status(500).json({ success: false, message: "Error in fetching notifications" });
    }
}

exports.getNotificationCount = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id).select('unseenNotifications');
        if (!patient) return res.status(404).json({ success: false, count: 0 });
        res.json({ success: true, count: (patient.unseenNotifications || []).length });
    } catch (err) {
        res.status(500).json({ success: false, count: 0 });
    }
}

exports.markNotificationAsSeen = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        // Append unseen to seen (not overwrite)
        patient.seenNotifications = [
            ...(patient.seenNotifications || []),
            ...(patient.unseenNotifications || [])
        ];
        patient.unseenNotifications = [];
        await patient.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, message: "All notifications marked as seen" });
    } catch (err) {
        console.error("Error in marking notifications as seen:", err);
        return res.status(500).json({ success: false, message: "Error in marking notifications as seen" });
    }
}

exports.clearAllNotifications = async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        patient.unseenNotifications = [];
        patient.seenNotifications = [];
        await patient.save({ validateBeforeSave: false });
        res.json({ success: true, message: "All notifications cleared" });
    } catch (err) {
        console.error("Error clearing notifications:", err);
        return res.status(500).json({ success: false, message: "Failed to clear notifications" });
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        const { index, type } = req.body; // type: 'unseen' or 'seen'
        const patient = await Patient.findById(req.user._id);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        if (type === 'unseen') {
            patient.unseenNotifications.splice(index, 1);
        } else {
            patient.seenNotifications.splice(index, 1);
        }
        await patient.save({ validateBeforeSave: false });
        res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
        console.error("Error deleting notification:", err);
        return res.status(500).json({ success: false, message: "Failed to delete notification" });
    }
}


exports.logoutPatient = (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

const multer = require("multer");
const path = require("path");
const { s3Client: s3 } = require('../utils/s3Config');
const multerS3 = require('multer-s3');

// Multer-S3 config for multiple files
const allowedImageTypes = new Set(['image/jpeg','image/jpg','image/png','image/webp']);
const allowedReportTypes = new Set(['application/pdf','image/jpeg','image/jpg','image/png']);
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const folder = file.fieldname === "profileImage" ? "Profiles/" : "reports/";
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, folder + file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        try {
            if (file.fieldname === 'profileImage') {
                return cb(null, allowedImageTypes.has(file.mimetype));
            }
            if (file.fieldname === 'files') {
                return cb(null, allowedReportTypes.has(file.mimetype));
            }
            return cb(null, false);
        } catch (e) {
            return cb(null, false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Export multer upload middleware for routes
exports.uploadFiles = upload.array("files", 5); // max 5 files
exports.uploadProfile = upload.single("profileImage");

// Controller for updating profile image
exports.updateProfileImage = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        const profileImageUrl = req.file.location;
        const patient = await Patient.findByIdAndUpdate(userId, { profileImage: profileImageUrl }, { new: true });

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        // Generate signed URL for the response
        const signedUrl = await generatePresignedUrl(profileImageUrl);

        res.status(200).json({ success: true, message: "Profile image updated", data: { ...patient.toObject(), profileImage: signedUrl } });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



// Controller function
exports.getSecondOpinion = async (req, res) => {
    const userId = req.user?._id;
    const { problem, doctorId, treatment, date, time, mode } = req.body;
    const files = req.files; // Expecting multiple files under 'files' field

    // Validation
    if (!problem || !doctorId || !treatment || !date || !time || !mode) {
        return res.status(400).json({ success: false, message: "All fields except files are required" });
    }

    if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: "At least one file is required" });
    }

    try {
        const [doctor, patient] = await Promise.all([
            Doctor.findById(doctorId),
            Patient.findById(userId),
        ]);

        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
        if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

        // Map S3 locations (URLs) from uploaded files array
        const uploadedFiles = files.map((file) => file.location);

        // Convert date string to Date object
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate)) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        const newSecondOpinion = await GetSecondOpinion.create({
            patientId: userId,
            doctorId,
            problem,
            files: uploadedFiles,
            treatment,
            mode,
            date: appointmentDate,
            time,
        });

        //sending notification to doctor
        const notification = createNotification('new-second-opinion', `New second opinion request from ${patient.name}`, {
            patientId: patient._id, patientName: patient.name, date, time
        });

        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { unseenNotifications: notification }
        });

        const patientNotification = createNotification('second-opinion-requested', `Second opinion request submitted successfully`, {
            doctorId: doctor._id, doctorName: doctor.name
        });
        await Patient.findByIdAndUpdate(userId, {
            $push: { unseenNotifications: patientNotification }
        });

        // Emit Socket Notifications
        const io = req.app.get('socketio');
        emitNotification(io, doctorId, 'doctor');
        emitNotification(io, userId, 'patient');

        res.status(201).json({ success: true, message: "Second opinion request created", data: newSecondOpinion });

        // Send Email to Patient
        await sendBookingConfirmation(patient.email, {
            patientName: patient.name,
            doctorName: doctor.name,
            date: date,
            time: time
        });

        // Send Email to Doctor
        await sendDoctorNotification(doctor.email, {
            doctorName: doctor.name,
            patientName: patient.name,
            date: date,
            time: time,
            type: 'Second Opinion Request'
        });
    } catch (err) {
        console.error("Error in getSecondOpinion:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error occurred while processing your request",
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};




//here i need to fetch the Second Opinions  which was accepted by the Doctor...
exports.getSecondOpinionsAccepted = async (req, res) => {
    try {
        const patientId = req.user._id;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient Not Found...' });
        }
        const secondOpinions = await GetSecondOpinion.find({ patientId: patientId, status: "accepted" }).populate('doctorId', 'name specialization contact profileImage');
        if (!secondOpinions || secondOpinions.length === 0) {
            return res.status(201).json({ success: true, data: [], message: 'No Accepted Second Opinions Found...' });
        }

        // Generate signed URLs for all files and doctor profile images
        const enrichedSecondOpinions = await Promise.all(secondOpinions.map(async (opinion) => {
            const opinionObj = opinion.toObject();
            if (opinionObj.files && opinionObj.files.length > 0) {
                opinionObj.files = await Promise.all(opinionObj.files.map(file => generatePresignedUrl(file)));
            }
            if (opinionObj.doctorId && opinionObj.doctorId.profileImage) {
                opinionObj.doctorId.profileImage = await generatePresignedUrl(opinionObj.doctorId.profileImage);
            }
            return opinionObj;
        }));

        return res.json({ success: true, data: enrichedSecondOpinions });
    }
    catch (err) {
        console.error("Error in fetching Second Opinions:", err);
        return res.status(500).json({ success: false, message: 'Internal Server Error...' });
    }
}

exports.getAllSecondOpinions = async (req, res) => {
    try {
        const patientId = req.user._id;
        if (!patientId) {
            return res.status(403).json({ success: false, message: 'Patient Not Logged In...' });
        }
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient Not Found...' });
        }
        // Fetch ALL second opinions (no status filter)
        const secondOpinions = await GetSecondOpinion.find({ patientId: patientId }).populate('doctorId', 'name specialization contact profileImage');

        // Generate signed URLs for all files and doctor profile images
        const enrichedSecondOpinions = await Promise.all((secondOpinions || []).map(async (opinion) => {
            const opinionObj = opinion.toObject();
            if (opinionObj.files && opinionObj.files.length > 0) {
                opinionObj.files = await Promise.all(opinionObj.files.map(file => generatePresignedUrl(file)));
            }
            if (opinionObj.doctorId && opinionObj.doctorId.profileImage) {
                opinionObj.doctorId.profileImage = await generatePresignedUrl(opinionObj.doctorId.profileImage);
            }
            return opinionObj;
        }));

        return res.json({ success: true, data: enrichedSecondOpinions });
    } catch (err) {
        console.error("Error in fetching All Second Opinions:", err);
        return res.status(500).json({ success: false, message: 'Internal Server Error...' });
    }
}

// ============ FORGOT PASSWORD ============
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const patient = await Patient.findOne({ email: email.toLowerCase().trim() });
        if (!patient) {
            // Don't reveal whether email exists — always show success
            return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save to DB with 1-hour expiry
        patient.resetPasswordToken = hashedToken;
        patient.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await patient.save({ validateBeforeSave: false });

        // Build reset URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/patient?token=${resetToken}&email=${encodeURIComponent(email)}`;

        // Send email via SMTP
        await sendPasswordResetEmail(email, resetUrl, patient.name || 'Patient');

        return res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ success: false, message: 'Failed to process request. Please try again.' });
    }
};

// ============ RESET PASSWORD ============
exports.resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        if (!token || !email || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        // Hash the token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const patient = await Patient.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Token not expired
        });

        if (!patient) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        patient.password = await bcrypt.hash(newPassword, salt);
        patient.resetPasswordToken = null;
        patient.resetPasswordExpires = null;
        await patient.save({ validateBeforeSave: false });

        return res.json({ success: true, message: 'Password has been reset successfully. You can now login.' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
    }
};

// ============ RESCHEDULE APPOINTMENT ============
exports.rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { date, time } = req.body;
        const patientId = req.user._id;

        if (!date || !time) {
            return res.status(400).json({ success: false, message: 'Date and time are required.' });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }

        // Verify ownership
        if (appointment.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }

        // Only allow reschedule for Pending or Accepted
        const allowedStatuses = ['Pending', 'Accepted', 'pending', 'accepted'];
        if (!allowedStatuses.includes(appointment.status)) {
            return res.status(400).json({ success: false, message: `Cannot reschedule a ${appointment.status} appointment.` });
        }

        const oldDate = appointment.date;
        const oldTime = appointment.time;
        appointment.date = date;
        appointment.time = time;
        appointment.status = 'Pending'; // Reset to pending after reschedule
        await appointment.save();

        // Notify doctor
        const patient = await Patient.findById(patientId);
        const notification = createNotification('appointment-rescheduled', `Appointment rescheduled by ${patient?.name || 'Patient'} from ${oldDate} ${oldTime} to ${date} ${time}`, {
            patientId, patientName: patient?.name, oldDate, oldTime, newDate: date, newTime: time
        });
        await Doctor.findByIdAndUpdate(appointment.doctorId, {
            $push: { unseenNotifications: notification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), appointment.doctorId, 'doctor');

        // Notify patient
        const doctor = await Doctor.findById(appointment.doctorId);
        const patientNotification = createNotification('appointment-rescheduled', `Your appointment with Dr. ${doctor?.name || 'Doctor'} has been rescheduled to ${date} ${time}`, {
            doctorId: doctor?._id, doctorName: doctor?.name, newDate: date, newTime: time
        });
        await Patient.findByIdAndUpdate(patientId, {
            $push: { unseenNotifications: patientNotification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), patientId, 'patient');

        return res.json({ success: true, message: 'Appointment rescheduled successfully.' });
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        return res.status(500).json({ success: false, message: 'Failed to reschedule appointment.' });
    }
};

// ============ CANCEL SECOND OPINION ============
exports.cancelSecondOpinion = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user._id;

        const secondOpinion = await GetSecondOpinion.findById(id);
        if (!secondOpinion) {
            return res.status(404).json({ success: false, message: 'Second opinion not found.' });
        }

        if (secondOpinion.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }

        // Case-insensitive status check
        const currentStatus = secondOpinion.status.toLowerCase();
        if (currentStatus !== 'pending' && currentStatus !== 'accepted') {
            return res.status(400).json({ success: false, message: `Cannot cancel a ${secondOpinion.status} second opinion.` });
        }

        secondOpinion.status = 'cancelled';
        await secondOpinion.save({ validateBeforeSave: false });

        // Notify doctor
        const patient = await Patient.findById(patientId);
        const notification = createNotification('second-opinion-cancelled', `Second opinion request cancelled by ${patient?.name || 'Patient'}`, {
            patientId, patientName: patient?.name, date: secondOpinion.date, time: secondOpinion.time, problem: secondOpinion.problem
        });
        await Doctor.findByIdAndUpdate(secondOpinion.doctorId, {
            $push: { unseenNotifications: notification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), secondOpinion.doctorId, 'doctor');

        // Notify patient
        const doctor = await Doctor.findById(secondOpinion.doctorId);
        const patientNotification = createNotification('second-opinion-cancelled', `Second opinion with Dr. ${doctor?.name || 'Doctor'} cancelled successfully`, {
            doctorId: secondOpinion.doctorId, doctorName: doctor?.name
        });
        await Patient.findByIdAndUpdate(patientId, {
            $push: { unseenNotifications: patientNotification }
        });

        // Emit Socket Notification
        emitNotification(req.app.get('socketio'), patientId, 'patient');

        // Send Email to Patient
        if (patient) {
            await sendCancellationEmail(patient.email, {
                patientName: patient.name,
                doctorName: doctor?.name || 'Doctor',
                date: secondOpinion.date,
                time: secondOpinion.time
            });
        }

        return res.json({ success: true, message: 'Second opinion cancelled successfully.' });
    } catch (error) {
        console.error('Cancel second opinion error:', error);
        return res.status(500).json({ success: false, message: 'Failed to cancel second opinion.' });
    }
};

// ============ RESCHEDULE SECOND OPINION ============
exports.rescheduleSecondOpinion = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;
        const patientId = req.user._id;

        if (!date || !time) {
            return res.status(400).json({ success: false, message: 'Date and time are required.' });
        }

        const secondOpinion = await GetSecondOpinion.findById(id);
        if (!secondOpinion) {
            return res.status(404).json({ success: false, message: 'Second opinion not found.' });
        }

        if (secondOpinion.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized.' });
        }

        // Case-insensitive status check
        const currentStatus = secondOpinion.status.toLowerCase();
        if (currentStatus !== 'pending' && currentStatus !== 'accepted') {
            return res.status(400).json({ success: false, message: `Cannot reschedule a ${secondOpinion.status} second opinion.` });
        }

        const oldDate = secondOpinion.date;
        const oldTime = secondOpinion.time;
        secondOpinion.date = date; // Mongoose will cast YYYY-MM-DD string to Date
        secondOpinion.time = time;
        secondOpinion.status = 'pending'; // Reset to pending
        await secondOpinion.save({ validateBeforeSave: false });

        // Notify doctor
        const patient = await Patient.findById(patientId);
        const notification = createNotification('second-opinion-rescheduled', `Second opinion rescheduled by ${patient?.name || 'Patient'} to ${date} ${time}`, {
            patientId, patientName: patient?.name, oldDate, oldTime, newDate: date, newTime: time
        });
        await Doctor.findByIdAndUpdate(secondOpinion.doctorId, {
            $push: { unseenNotifications: notification }
        });

        return res.json({ success: true, message: 'Second opinion rescheduled successfully.' });
    } catch (error) {
        console.error('Reschedule second opinion error:', error);
        return res.status(500).json({ success: false, message: 'Failed to reschedule second opinion.' });
    }
};
