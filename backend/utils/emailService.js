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

module.exports = {
    sendPasswordResetEmail,
};
