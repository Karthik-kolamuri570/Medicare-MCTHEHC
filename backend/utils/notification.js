const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');

/**
 * Creates a notification object for the database.
 */
const createNotification = (type, message, data = {}) => {
    return {
        type,
        message,
        data,
        createdAt: new Date()
    };
};

/**
 * Emits a real-time notification event to a specific user and returns their updated notification count.
 * @param {Object} io - Socket.io instance
 * @param {String} userId - ID of the user to notify
 * @param {String} role - 'patient', 'doctor', or 'admin'
 */
const emitNotification = async (io, userId, role) => {
    try {
        if (!io || !userId) return;

        let count = 0;
        if (role === 'patient') {
            const user = await Patient.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
        } else if (role === 'doctor') {
            const user = await Doctor.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
        } else if (role === 'admin') {
            const user = await Admin.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
        }

        io.to(userId.toString()).emit('newNotification', { count });
    } catch (error) {
        console.error('Error emitting socket notification:', error);
    }
};

module.exports = { createNotification, emitNotification };
