const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
// const authMiddleware = require('../middleware/authMiddleware');
const Doctor = require('../models/doctor'); // Adjust the path as needed
const auth=require('../middleware/auth');

router.get('/me', async(req,res)=>{
    // here i need to display the doctor details who Logged in...
    try
    {
        const doctorId=req.session.doctorId;
        console.log(`Trying to Login with Doctor Id ${doctorId}`)
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        return res.json({
            success:true,
            data:doctor
        })
    }
    catch(err){
        res.status(500).json({ message: 'Server error' });
    }
})
router.post('/register', doctorController.registerDoctor);
router.post('/login', doctorController.loginDoctor);


router.get('/profile/:id', doctorController.getDoctorById);
router.put('/profile/:id',auth.doctorAuth, doctorController.updateDoctor);

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Delete doctor
router.delete('/:id', doctorController.deleteDoctor);

// Update doctor availability
router.put('/availability/',auth.adminAuth, doctorController.updateAvailability);
router.get('/appointments/',auth.doctorAuth, doctorController.getDoctorAppointments);
router.get('/patients/', auth.doctorAuth, doctorController.getDoctorPatients);
router.get('/specializations/:specialization', doctorController.getDoctorBySpecialization);
router.get('/location/:location', doctorController.getDoctorByLocation); // Corrected the path
// router.get('/search/:search', doctorController.searchDoctors);
router.put('/accept-appointment/:id', auth.doctorAuth, doctorController.acceptAppointment);
router.put('/reject-appointment/:id', auth.doctorAuth, doctorController.rejectAppointment);
router.get('/logout', doctorController.logoutDoctor);
router.get('/accepted-appointments', auth.doctorAuth, doctorController.getAcceptedAppointments);
router.get('/get-second-opinion', auth.doctorAuth, doctorController.getSecondOpinion);
router.put('/get-second-opinion/:id', auth.doctorAuth, doctorController.acceptGetSecondOpinion);
router.get('/get-second-opinion/accept',auth.doctorAuth, doctorController.getAcceptedSecondOpinion);

module.exports = router;

