exports.patientAuth = async (req, res, next) => {
    console.log("Checking patient authentication");
    console.log("Session:", req.session);
    if (!req.session || !req.session.isPatientLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).redirect('/api/patient/login');
    }
    console.log("Patient is authenticated");
    next();
};

exports.doctorAuth = async (req, res, next) => {
    console.log("Checking doctor authentication");
    console.log("Session:", req.session);
    if (!req.session || !req.session.isDoctorLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).redirect('/api/doctor/login');
    }
    console.log("Doctor is authenticated");
    next();
};

exports.adminAuth = async (req, res, next) => {
    console.log("Checking admin authentication");
    console.log("Session:", req.session);
    if (!req.session ||!req.session.isAdminLoggedIn) {
        console.log("Unauthorized Access - Returning 401");
        return res.status(401).json({ success: false, message: "Unauthorized access. Please log in as an admin." });
    }
    console.log("Admin is authenticated");
    next();
};
