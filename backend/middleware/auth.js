const Patient = require('../models/patient'); // Adjust the path as needed
const Doctor = require('../models/doctor'); // Adjust the path as needed
// const Admin = require('../model/adminModel'); // Adjust the path as needed
exports.patientAuth = async (req, res, next) => {
    console.log("Checking patient authentication");
    console.log("Session:", req.session);
    if (!req.session || !req.session.isPatientLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).redirect('/api/patient/login');
    }
    try {
        const patient = await Patient.findById(req.session.patientId);
        if (!patient) {
            console.log("in assigning the patient to the req.user is failed")
            return res.status(401).redirect('/api/patient/login');
        }
        console.log("in assigning the patient to the req.user is success")
        req.user = patient;
        
        console.log(req.user._id.toString());
        console.log("Patient is authenticated");
        next();
    } catch (error) {
        console.error("Error in patient authentication:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.doctorAuth = async (req, res, next) => {
    console.log("Checking doctor authentication");
    console.log("Session:", req.session);
    if (!req.session || !req.session.isDoctorLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).redirect('/api/doctor/login');
    }
    try {
        const doctor = await Doctor.findById(req.session.doctorId);
        if (!doctor) {
            return res.status(401).redirect('/api/doctor/login');
        }
        req.user = doctor;
        console.log(req.user._id.toString());
        console.log("Doctor is authenticated");
        next();
    } catch (error) {
        console.error("Error in doctor authentication:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.adminAuth = async (req, res, next) => {
    console.log("Checking admin authentication");
    console.log("Session:", req.session);
    if (!req.session || !req.session.isAdminLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in as an admin." });
    }
    try {
        const admin = await Admin.findById(req.session.adminId);
        if (!admin) {
            return res.status(401).json({ success: false, message: "Unauthorized access. Please log in as an admin." });
        }
        req.user = admin;
        console.log("Admin is authenticated");
        next();
    } catch (error) {
        console.error("Error in admin authentication:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

