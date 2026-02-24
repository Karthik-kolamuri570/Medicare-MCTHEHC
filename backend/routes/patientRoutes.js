const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');
const auth = require('../middleware/auth');
const Patient = require('../models/patient'); // Adjust the path as needed
router.post('/register', patientController.registerPatient);
router.post('/login', patientController.loginPatient);
router.post('/forgot-password', patientController.forgotPassword);
router.post('/reset-password', patientController.resetPassword);
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
const { uploadFiles, getSecondOpinion } = require('./../controller/patientController');
router.get('/get-second-opinion', auth.patientAuth, patientController.getAllSecondOpinions);
router.post('/get-second-opinion', auth.patientAuth, uploadFiles, getSecondOpinion);
router.get('/logout', auth.patientAuth, patientController.logoutPatient)
router.get("/verify-auth", auth.patientAuth, (req, res) => {
    res.json({ message: "Authenticated", user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});




module.exports = router;