/**
 * Appointment Reminder Scheduler
 * Sends automated email reminders 24h and 1h before appointments
 */
const cron = require('node-cron');
const Appointment = require('../models/appointments');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const { sendAppointmentReminder } = require('./emailService');
const logger = require('./logger');

/**
 * Parse appointment date and time strings into a Date object
 * Handles formats: "2025-03-25" + "10:00" or "10:00 AM"
 */
function parseAppointmentDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    try {
        // Try combining date + time directly
        const combined = new Date(`${dateStr}T${timeStr}`);
        if (!isNaN(combined)) return combined;

        // Fallback: parse date separately and add time
        const dateParts = dateStr.split('-');
        const timeParts = timeStr.replace(/\s*(AM|PM)\s*/i, '').split(':');
        if (dateParts.length === 3 && timeParts.length >= 2) {
            const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2],
                parseInt(timeParts[0]), parseInt(timeParts[1]));
            // Handle AM/PM
            if (/PM/i.test(timeStr) && parseInt(timeParts[0]) < 12) {
                d.setHours(d.getHours() + 12);
            }
            if (/AM/i.test(timeStr) && parseInt(timeParts[0]) === 12) {
                d.setHours(0);
            }
            if (!isNaN(d)) return d;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Check and send reminders for upcoming appointments
 * @param {number} hoursAhead - How many hours ahead to check (24 or 1)
 */
async function checkAndSendReminders(hoursAhead) {
    try {
        const now = new Date();
        const targetTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

        // Get today's and tomorrow's date strings
        const todayStr = now.toISOString().split('T')[0];
        const tomorrowStr = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Find accepted/pending appointments for today and tomorrow
        const appointments = await Appointment.find({
            date: { $in: [todayStr, tomorrowStr] },
            status: { $in: ['Accepted', 'Pending'] },
            $or: [
                { 'remindersSent.twentyFourHour': false },
                { 'remindersSent.oneHour': false }
            ]
        }).populate('doctorId', 'name specialization').populate('patientId', 'name email');

        let sentCount = 0;

        for (const appt of appointments) {
            if (!appt.patientId?.email || !appt.doctorId?.name) continue;

            const apptDateTime = parseAppointmentDateTime(appt.date, appt.time);
            if (!apptDateTime) continue;

            // Calculate time difference in hours
            const diffHours = (apptDateTime - now) / (1000 * 60 * 60);

            // Send reminder if appointment is within the target window (±30 min tolerance)
            const lowerBound = hoursAhead - 0.5;
            const upperBound = hoursAhead + 0.5;

            // Check if this specific reminder type was already sent
            const alreadySent = hoursAhead === 24 ? appt.remindersSent?.twentyFourHour : appt.remindersSent?.oneHour;
            
            if (diffHours >= lowerBound && diffHours <= upperBound && !alreadySent) {
                try {
                    await sendAppointmentReminder(appt.patientId.email, {
                        patientName: appt.patientId.name,
                        doctorName: appt.doctorId.name,
                        specialization: appt.doctorId.specialization,
                        date: appt.date,
                        time: appt.time,
                        hoursAhead
                    });

                    // Update the appointment to mark reminder as sent
                    const updateField = hoursAhead === 24 ? 'remindersSent.twentyFourHour' : 'remindersSent.oneHour';
                    await Appointment.findByIdAndUpdate(appt._id, { $set: { [updateField]: true } });

                    sentCount++;
                    logger.info(`Sent ${hoursAhead}h reminder to ${appt.patientId.email} for appointment ${appt._id}`);
                } catch (emailErr) {
                    logger.error(`Failed to send reminder to ${appt.patientId.email}`, { error: emailErr.message });
                }
            }
        }

        if (sentCount > 0) {
            logger.info(`Sent ${sentCount} ${hoursAhead}-hour reminder(s)`);
        }

    } catch (error) {
        logger.error('Error in appointment reminder check', { error: error.message });
    }
}

/**
 * Start the reminder scheduler
 * - Runs every 30 minutes to check for appointments needing 24h or 1h reminders
 */
function startReminderScheduler() {
    // Run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        logger.info('Running appointment reminder check...');
        await checkAndSendReminders(24); // 24-hour reminders
        await checkAndSendReminders(1);  // 1-hour reminders
    });

    logger.info('✅ Appointment reminder scheduler started (runs every 30 minutes)');
}

module.exports = { startReminderScheduler, checkAndSendReminders };
