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
 * @param {Object} [notification] - Optional notification object to push
 */
const emitNotification = async (io, userId, role, notification = null) => {
    try {
        if (!io || !userId) return;

        let count = 0;
        let lastNotif = notification;
        
        if (role === 'patient') {
            const user = await Patient.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
            if (!lastNotif && user?.unseenNotifications?.length > 0) {
                lastNotif = user.unseenNotifications[user.unseenNotifications.length - 1];
            }
        } else if (role === 'doctor') {
            const user = await Doctor.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
            if (!lastNotif && user?.unseenNotifications?.length > 0) {
                lastNotif = user.unseenNotifications[user.unseenNotifications.length - 1];
            }
        } else if (role === 'admin') {
            const user = await Admin.findById(userId).select('unseenNotifications');
            count = user?.unseenNotifications?.length || 0;
            if (!lastNotif && user?.unseenNotifications?.length > 0) {
                lastNotif = user.unseenNotifications[user.unseenNotifications.length - 1];
            }
        }

        io.to(userId.toString()).emit('newNotification', { count, notification: lastNotif });
    } catch (error) {
        console.error('Error emitting socket notification:', error);
    }
};

module.exports = { createNotification, emitNotification };
