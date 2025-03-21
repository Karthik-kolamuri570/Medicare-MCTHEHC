const express=require('express');
const router=express.Router();
const patientController=require('../controller/patientController');
const auth=require('../middleware/auth');
router.post('/register',patientController.registerPatient);
router.post('/login',patientController.loginPatient);
// router.get('/:patientId',auth.patientAuth,patientController.getPatientById);
// router.get('/',patientController.getAllPatients);
router.put('/:patientId',auth.patientAuth,patientController.updatePatient);
router.post('/book-appointment/',auth.patientAuth,patientController.bookAppointment);
router.get('/appointments/',auth.patientAuth,patientController.getPatientAppointments);
router.post('/cancel-appointment/:appointmentId',auth.patientAuth,patientController.cancelAppointment);
router.get('/notifications/:patientId',auth.patientAuth,patientController.getNotifications);
router.post('/notifications/:patientId',auth.patientAuth,patientController.markNotificationAsSeen);
// router.delete('/notifications/:notificationId',patientController.deleteNotification);
router.get("/test-session", (req, res) => {
    console.log("Session Data:", req.session);
    console.log("Session User:", req.session.user);
    
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Unauthorized - No session found" });
    }

    res.json({ message: "Session is active", session: req.session });
});


module.exports=router;