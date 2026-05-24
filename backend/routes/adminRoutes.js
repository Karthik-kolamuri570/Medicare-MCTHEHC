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
const { authLimiter } = require('../middleware/rateLimit');

// ===== AUTHENTICATION =====
// No auth required for login
router.post('/auth/login', authLimiter, adminController.login);

// Auth required for logout and refresh
router.post('/auth/logout', adminAuth, adminController.logout);
router.post('/auth/refresh-token', authLimiter, adminController.refreshToken);

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
router.delete('/appointments/:appointmentId', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteAppointment);

// Second Opinions
router.get('/second-opinions', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAllSecondOpinions);
router.put('/second-opinions/:opinionId/cancel', adminAuth, ensureRole('super-admin', 'admin'), adminController.cancelSecondOpinion);
router.delete('/second-opinions/:opinionId', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteSecondOpinion);

// ===== USER MANAGEMENT =====
router.get('/users', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAllUsers);
router.get('/users/:userId', adminAuth, ensureRole('super-admin', 'admin'), adminController.getUserById);

// ===== ANALYTICS =====
router.get('/patient-analytics', adminAuth, ensureRole('super-admin', 'admin'), adminController.getPatientAnalytics);
router.get('/appointment-analytics', adminAuth, ensureRole('super-admin', 'admin'), adminController.getAppointmentAnalytics);
router.get('/revenue-details', adminAuth, ensureRole('super-admin', 'admin'), adminController.getRevenueDetails);

// Payments
router.get('/payments', adminAuth, ensureRole('super-admin', 'admin'), adminController.getPayments);
router.post('/payments/:paymentId/refund', adminAuth, ensureRole('super-admin', 'admin'), adminController.refundPayment);
router.get('/payments/debug', adminAuth, ensureRole('super-admin', 'admin'), adminController.getPaymentsDebug);
// Blog moderation (admin)
router.get('/blogs', adminAuth, ensureRole('super-admin', 'admin'), adminController.getBlogsAdmin);
router.delete('/blogs/:id', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteBlogAdmin);
router.get('/blogs/:id/comments', adminAuth, ensureRole('super-admin', 'admin'), adminController.getBlogCommentsAdmin);
router.delete('/comments/:commentId', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteCommentAdmin);

// Blood Bank Admin
router.get('/blood-banks', adminAuth, ensureRole('super-admin', 'admin'), adminController.getBloodBanksAdmin);

// Blood Camp Admin
router.get('/blood-camps', adminAuth, ensureRole('super-admin', 'admin'), adminController.getBloodCampsAdmin);
router.delete('/blood-camps/:id', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteBloodCampAdmin);

// ===== NOTIFICATIONS =====
router.get('/notifications', adminAuth, ensureRole('super-admin', 'admin'), adminController.getNotifications);
router.get('/notifications/count', adminAuth, ensureRole('super-admin', 'admin'), adminController.getNotificationCount);
router.post('/notifications/mark-seen', adminAuth, ensureRole('super-admin', 'admin'), adminController.markNotificationsAsSeen);
router.delete('/notifications/clear', adminAuth, ensureRole('super-admin', 'admin'), adminController.clearAllNotifications);
router.post('/notifications/delete', adminAuth, ensureRole('super-admin', 'admin'), adminController.deleteNotification);

module.exports = router;
