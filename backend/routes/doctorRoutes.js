const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
// const authMiddleware = require('../middleware/authMiddleware');
const Doctor = require('../models/doctor'); // Adjust the path as needed
const auth = require('../middleware/auth');

router.get('/me', auth.doctorAuth, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.json({
            success: true,
            data: doctor
        })
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})
router.post('/register', doctorController.registerDoctor);
router.post('/login', doctorController.loginDoctor);
router.post('/forgot-password', doctorController.forgotPassword);
router.post('/reset-password', doctorController.resetPassword);


router.get('/profile/:id', doctorController.getDoctorById);
router.put('/profile/:id', auth.doctorAuth, doctorController.updateDoctor);

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Delete doctor (admin only)
router.delete('/:id', auth.adminAuth, doctorController.deleteDoctor);

// Update doctor availability
router.put('/availability/', auth.adminAuth, doctorController.updateAvailability);
router.get('/appointments/', auth.doctorAuth, doctorController.getDoctorAppointments);
router.get('/patients/', auth.doctorAuth, doctorController.getDoctorPatients);
router.get('/specializations/:specialization', doctorController.getDoctorBySpecialization);
router.get('/location/:location', doctorController.getDoctorByLocation); // Corrected the path
// router.get('/search/:search', doctorController.searchDoctors);
router.put('/accept-appointment/:id', auth.doctorAuth, doctorController.acceptAppointment);
router.put('/reject-appointment/:id', auth.doctorAuth, doctorController.rejectAppointment);
router.get('/logout', auth.doctorAuth, doctorController.logoutDoctor);
router.get('/accepted-appointments', auth.doctorAuth, doctorController.getAcceptedAppointments);
router.get('/get-second-opinion', auth.doctorAuth, doctorController.getSecondOpinion);
router.put('/get-second-opinion/:id', auth.doctorAuth, doctorController.acceptGetSecondOpinion);
router.get('/get-second-opinion/accept', auth.doctorAuth, doctorController.getAcceptedSecondOpinion);
router.get('/all-specializations', doctorController.getAllSpecializations);

// Notifications
router.get('/notifications', auth.doctorAuth, doctorController.getNotifications);
router.get('/notifications/count', auth.doctorAuth, doctorController.getNotificationCount);
router.post('/notifications/mark-seen', auth.doctorAuth, doctorController.markNotificationsAsSeen);
router.delete('/notifications/clear', auth.doctorAuth, doctorController.clearAllNotifications);
router.post('/notifications/delete', auth.doctorAuth, doctorController.deleteNotification);

module.exports = router;

