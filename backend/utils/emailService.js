const nodemailer = require('nodemailer');

/**
 * Create reusable transporter using Gmail SMTP
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
};

/**
 * Send a password reset email with a styled HTML template
 * @param {string} toEmail - Recipient email
 * @param {string} resetUrl - Password reset URL
 * @param {string} userName - User's name for personalization
 */
const sendPasswordResetEmail = async (toEmail, resetUrl, userName = 'User') => {
    const transporter = createTransporter();

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #0072ff 0%, #00c6ff 100%); padding: 30px 40px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">Medicare</h1>
                                <p style="margin:5px 0 0; color:rgba(255,255,255,0.9); font-size:13px;">The Healthcare</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin:0 0 10px; color:#1a1a2e; font-size:20px;">Password Reset Request</h2>
                                <p style="color:#555; font-size:15px; line-height:1.6; margin:0 0 25px;">
                                    Hi <strong>${userName}</strong>,<br><br>
                                    We received a request to reset your password. Click the button below to set a new password. This link will expire in <strong>1 hour</strong>.
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center">
                                            <a href="${resetUrl}" style="display:inline-block; background:linear-gradient(135deg, #0072ff 0%, #00c6ff 100%); color:#fff; text-decoration:none; padding:14px 40px; border-radius:8px; font-size:16px; font-weight:600; letter-spacing:0.5px;">
                                                Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color:#888; font-size:13px; line-height:1.5; margin:25px 0 0;">
                                    If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
                                </p>
                                <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">
                                <p style="color:#aaa; font-size:12px; margin:0;">
                                    If the button doesn't work, copy and paste this link into your browser:<br>
                                    <a href="${resetUrl}" style="color:#0072ff; word-break:break-all;">${resetUrl}</a>
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color:#f8f9fa; padding:20px 40px; text-align:center;">
                                <p style="margin:0; color:#aaa; font-size:12px;">
                                    © ${new Date().getFullYear()} Medicare - The Healthcare. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Reset Your Password — Medicare',
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};


const sendBookingConfirmation = async (toEmail, details) => {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #0072ff; text-align: center;">Appointment Confirmed!</h2>
            <p>Hi <strong>${details.patientName}</strong>,</p>
            <p>Your appointment has been successfully booked. Here are your details:</p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Doctor:</strong> Dr. ${details.doctorName}</li>
                <li style="margin-bottom: 10px;"><strong>Date:</strong> ${details.date}</li>
                <li style="margin-bottom: 10px;"><strong>Time:</strong> ${details.time}</li>
            </ul>
            <p>Please log in to your patient portal if you need to reschedule or view more details.</p>
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} Medicare - The Healthcare. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Appointment Confirmation — Medicare',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send booking confirmation email:', error);
    }
};

// Send a payment receipt email
const sendPaymentReceipt = async (toEmail, details) => {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; text-align: center;">Payment Successful</h2>
            <p>Hi <strong>${details.patientName}</strong>,</p>
            <p>We have successfully received your payment. Here is your receipt:</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p><strong>Amount Paid:</strong> ₹${details.amount}</p>
                <p><strong>Transaction ID:</strong> ${details.transactionId}</p>
                <p><strong>Appointment ID:</strong> ${details.appointmentId}</p>
            </div>
            <p>Thank you for choosing Medicare.</p>
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} Medicare - The Healthcare. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Payment Receipt — Medicare',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment receipt email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send payment receipt email:', error);
    }
};

// Send a notification to the doctor about a new booking
const sendDoctorNotification = async (toEmail, details) => {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #0072ff; text-align: center;">New Appointment Request</h2>
            <p>Hi <strong>Dr. ${details.doctorName}</strong>,</p>
            <p>You have a new appointment request from <strong>${details.patientName}</strong>.</p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Date:</strong> ${details.date}</li>
                <li style="margin-bottom: 10px;"><strong>Time:</strong> ${details.time}</li>
                <li style="margin-bottom: 10px;"><strong>Type:</strong> ${details.type || 'Standard Appointment'}</li>
            </ul>
            <p>Please log in to your portal to accept or reject this request.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'New Appointment Request — Medicare',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Doctor notification email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send doctor notification email:', error);
    }
};

// Send a cancellation email to the patient
const sendCancellationEmail = async (toEmail, details) => {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; text-align: center;">Appointment Cancelled</h2>
            <p>Hi <strong>${details.patientName}</strong>,</p>
            <p>We're writing to inform you that your appointment with <strong>Dr. ${details.doctorName}</strong> on <strong>${details.date}</strong> at <strong>${details.time}</strong> has been cancelled.</p>
            <p>If you have already paid, a refund will be processed according to our policy.</p>
            <p>You can book another appointment through your portal at any time.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Appointment Cancellation — Medicare',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Cancellation email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send cancellation email:', error);
    }
};

// Send an acceptance email to the patient
const sendAcceptanceEmail = async (toEmail, details) => {
    const transporter = createTransporter();
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; text-align: center;">Appointment Accepted</h2>
            <p>Hi <strong>${details.patientName}</strong>,</p>
            <p>Great news! Your appointment with <strong>Dr. ${details.doctorName}</strong> on <strong>${details.date}</strong> at <strong>${details.time}</strong> has been accepted.</p>
            <p>Please ensure you are available at the scheduled time.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: 'Appointment Accepted — Medicare',
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Acceptance email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send acceptance email:', error);
    }
};

// Send an appointment reminder email
const sendAppointmentReminder = async (toEmail, details) => {
    const transporter = createTransporter();

    const isOneHour = details.hoursAhead === 1;
    const urgencyColor = isOneHour ? '#ff6b35' : '#0072ff';
    const timeLabel = isOneHour ? '1 Hour' : '24 Hours';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f7fa; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, ${urgencyColor} 0%, #00c6ff 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <h2 style="color: #ffffff; margin: 0;">⏰ Appointment Reminder</h2>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px;">Your appointment is in ${timeLabel}</p>
            </div>
            <div style="padding: 20px;">
                <p>Hi <strong>${details.patientName}</strong>,</p>
                <p>This is a friendly reminder that you have an upcoming appointment:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid ${urgencyColor};">
                    <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${details.doctorName}</p>
                    <p style="margin: 5px 0;"><strong>Specialization:</strong> ${details.specialization || 'General'}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${details.date}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${details.time}</p>
                </div>
                <p>Please ensure you are available at the scheduled time. If you need to reschedule, please log in to your portal.</p>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
                © ${new Date().getFullYear()} Medicare - The Healthcare. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Medicare - The HealthCare'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: toEmail,
        subject: `⏰ Appointment Reminder (${timeLabel}) — Medicare`,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${toEmail}`);
    } catch (error) {
        console.error('Failed to send reminder email:', error);
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendBookingConfirmation,
    sendPaymentReceipt,
    sendDoctorNotification,
    sendCancellationEmail,
    sendAcceptanceEmail,
    sendAppointmentReminder
};
