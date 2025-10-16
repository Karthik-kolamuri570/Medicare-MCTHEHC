// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('./../controller/adminController');
const { adminAuth } = require('../middleware/auth');

// Dashboard
router.get('/dashboard-stats', adminAuth, adminController.getDashboardStats);

// Doctor Management
router.get('/pending-doctors', adminAuth, adminController.getPendingDoctors);
router.put('/approve-doctor/:doctorId', adminAuth, adminController.approveDoctorRegistration);

// Analytics
router.get('/patient-analytics', adminAuth, adminController.getPatientAnalytics);
router.get('/appointment-analytics', adminAuth, adminController.getAppointmentAnalytics);
// routes/adminRoutes.js
router.get('/revenue-details', adminAuth, adminController.getRevenueDetails);
module.exports = router;