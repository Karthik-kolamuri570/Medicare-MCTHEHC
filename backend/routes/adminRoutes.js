// // routes/adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const adminController = require('./../controller/adminController');
// const { adminAuth } = require('../middleware/auth');

// // Dashboard
// router.get('/dashboard-stats', adminAuth, adminController.getDashboardStats);

// // Doctor Management
// router.get('/pending-doctors', adminAuth, adminController.getPendingDoctors);
// router.put('/approve-doctor/:doctorId', adminAuth, adminController.approveDoctorRegistration);

// // Analytics
// router.get('/patient-analytics', adminAuth, adminController.getPatientAnalytics);
// router.get('/appointment-analytics', adminAuth, adminController.getAppointmentAnalytics);
// // routes/adminRoutes.js
// router.get('/revenue-details', adminAuth, adminController.getRevenueDetails);
// module.exports = router;








// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('./../controller/adminController');
const { adminAuth, ensureRole, ensurePermission } = require('../middleware/auth');

// ===== AUTHENTICATION =====
// No auth required for login
router.post('/auth/login', adminController.login);

// Auth required for logout and refresh
router.post('/auth/logout', adminAuth, adminController.logout);
router.post('/auth/refresh-token', adminController.refreshToken);

// ===== DASHBOARD =====
router.get('/dashboard-stats', adminAuth, ensureRole('super-admin', 'admin'), adminController.getDashboardStats);

// ===== DOCTOR MANAGEMENT =====
router.get('/pending-doctors', adminAuth, ensureRole('super-admin', 'admin'), adminController.getPendingDoctors);
router.put('/approve-doctor/:doctorId', adminAuth, ensureRole('super-admin', 'admin'), adminController.approveDoctorRegistration);
router.put('/reject-doctor/:doctorId', adminAuth, ensureRole('super-admin', 'admin'), adminController.rejectDoctorRegistration);
// Appointments
router.get('/appointments', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAllAppointments);
router.put('/appointments/:appointmentId/cancel', adminAuth, ensureRole('super-admin', 'admin'), adminController.cancelAppointment);
router.put('/appointments/bulk-cancel', adminAuth, ensureRole('super-admin', 'admin'), adminController.bulkCancelAppointments);
router.put('/appointments/:appointmentId/reschedule', adminAuth, ensureRole('super-admin', 'admin'), adminController.rescheduleAppointment);

// ===== USER MANAGEMENT =====
router.get('/users', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAllUsers);
router.get('/users/:userId', adminAuth, ensureRole('super-admin', 'admin'), adminController.getUserById);

// ===== ANALYTICS =====
router.get('/patient-analytics', adminAuth, ensureRole('super-admin', 'admin'), adminController.getPatientAnalytics);
router.get('/appointment-analytics', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAppointmentAnalytics);
router.get('/revenue-details', adminAuth, ensureRole('super-admin', 'admin'), adminController.getRevenueDetails);

module.exports = router;
