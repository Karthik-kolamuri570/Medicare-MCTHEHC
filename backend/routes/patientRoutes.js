const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');
const auth = require('../middleware/auth');
const Patient = require('../models/patient'); // Adjust the path as needed
const { uploadProfile: patientUploadProfile } = require('./../controller/patientController');
const { authLimiter } = require('../middleware/rateLimit');

router.post('/register', authLimiter, patientUploadProfile, patientController.registerPatient);
router.post('/login', authLimiter, patientController.loginPatient);
router.post('/forgot-password', authLimiter, patientController.forgotPassword);
router.post('/reset-password', authLimiter, patientController.resetPassword);
router.get('/me', auth.patientAuth, patientController.getPatientProfile);
// router.get('/:patientId',auth.patientAuth,patientController.getPatientById);
// router.get('/',patientController.getAllPatients);
router.put('/', auth.patientAuth, patientController.updatePatient);
router.post('/book-appointment/', auth.patientAuth, patientController.bookAppointment);
router.get('/appointments', auth.patientAuth, patientController.getPatientAppointments);
router.post('/cancel-appointment/:appointmentId', auth.patientAuth, patientController.cancelAppointment);
router.put('/reschedule-appointment/:appointmentId', auth.patientAuth, patientController.rescheduleAppointment);
router.post('/cancel-second-opinion/:id', auth.patientAuth, patientController.cancelSecondOpinion);
router.put('/reschedule-second-opinion/:id', auth.patientAuth, patientController.rescheduleSecondOpinion);
router.get('/notifications/', auth.patientAuth, patientController.getNotifications);
router.get('/notifications/count', auth.patientAuth, patientController.getNotificationCount);
router.post('/notifications/', auth.patientAuth, patientController.markNotificationAsSeen);
router.delete('/notifications/clear', auth.patientAuth, patientController.clearAllNotifications);
router.post('/notifications/delete', auth.patientAuth, patientController.deleteNotification);
router.get('/get-second-opinion/accepted', auth.patientAuth, patientController.getSecondOpinionsAccepted);
const { uploadFiles, getSecondOpinion, uploadProfile, updateProfileImage } = require('./../controller/patientController');
router.put('/profile-image', auth.patientAuth, uploadProfile, updateProfileImage);
router.get('/get-second-opinion', auth.patientAuth, patientController.getAllSecondOpinions);
router.post('/get-second-opinion', auth.patientAuth, uploadFiles, getSecondOpinion);
router.get('/logout', auth.patientAuth, patientController.logoutPatient);
router.get("/verify-auth", auth.patientAuth, (req, res) => {
    res.json({ message: "Authenticated", user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

// Medical records vault
router.post('/medical-records', auth.patientAuth, uploadFiles, patientController.uploadMedicalRecords);
router.get('/medical-records', auth.patientAuth, patientController.getMedicalRecords);
router.delete('/medical-records/:recordId', auth.patientAuth, patientController.deleteMedicalRecord);

// Review routes
const reviewController = require('../controller/reviewController');
router.post('/review', auth.patientAuth, reviewController.submitReview);
router.get('/review/:appointmentId', auth.patientAuth, reviewController.getReview);

// Prescription routes
const prescriptionController = require('../controller/prescriptionController');
router.get('/prescriptions', auth.patientAuth, prescriptionController.getPatientPrescriptions);
router.get('/prescription/:appointmentId', auth.patientAuth, prescriptionController.getPrescriptionByAppointment);
router.put('/prescriptions/:prescriptionId/medication/:medIndex', auth.patientAuth, prescriptionController.toggleMedicationTaken);

module.exports = router;