const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
// const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', doctorController.registerDoctor);
router.post('/login', doctorController.loginDoctor);

// // Protected routes
// router.use(authMiddleware);

// Doctor profile routes
router.get('/profile/:id', doctorController.getDoctorById);
router.put('/profile/:id', doctorController.updateDoctor);

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Delete doctor
router.delete('/:id', doctorController.deleteDoctor);

// Update doctor availability
router.put('/availability/:id', doctorController.updateAvailability);

module.exports = router;
