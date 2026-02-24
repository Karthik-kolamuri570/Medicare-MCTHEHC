/**
 * Notification utility — creates a standardized notification object
 * with automatic timestamp.
 * 
 * @param {string} type  - Notification type (e.g., 'new-appointment', 'cancelled', 'reschedule')
 * @param {string} message - Human-readable notification message
 * @param {Object} data   - Additional data (doctorName, date, time, etc.)
 * @returns {Object} Standardized notification with createdAt timestamp
 */
function createNotification(type, message, data = {}) {
    return {
        type,
        message,
        data,
        createdAt: new Date(),
    };
}

module.exports = { createNotification };
