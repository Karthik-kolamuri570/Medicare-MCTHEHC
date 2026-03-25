const Appointment = require('../models/appointments');
const Review = require('../models/review');
const Prescription = require('../models/prescription');
const GetSecondOpinion = require('../models/GetSecondOpinion');

/**
 * Get analytics data for the logged-in doctor
 * Aggregates: appointment counts, revenue, ratings, busiest days, completion rates
 */
exports.getDoctorAnalytics = async (req, res) => {
    try {
        const doctorId = req.user._id;

        // Run all queries in parallel
        const [
            allAppointments,
            secondOpinions,
            reviews,
            prescriptionCount
        ] = await Promise.all([
            Appointment.find({ doctorId }),
            GetSecondOpinion.find({ doctorId }),
            Review.find({ doctorId }),
            Prescription.countDocuments({ doctorId })
        ]);

        // --- Appointment Stats ---
        const totalAppointments = allAppointments.length;
        const statusCounts = {
            pending: 0,
            accepted: 0,
            rejected: 0,
            cancelled: 0,
            completed: 0
        };
        allAppointments.forEach(a => {
            const status = (a.status || '').toLowerCase();
            if (statusCounts.hasOwnProperty(status)) statusCounts[status]++;
        });

        // --- Monthly Appointments (last 6 months) ---
        const monthlyData = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[key] = { month: key, appointments: 0, revenue: 0 };
        }

        allAppointments.forEach(a => {
            if (!a.date) return;
            // date format is YYYY-MM-DD or similar string
            const parts = a.date.split('-');
            if (parts.length >= 2) {
                const key = `${parts[0]}-${parts[1]}`;
                if (monthlyData[key]) {
                    monthlyData[key].appointments++;
                }
            }
        });

        // --- Revenue ---
        const paidAppointments = allAppointments.filter(a => 
            (a.paymentStatus || '').toLowerCase() === 'paid'
        );
        const paidSecondOpinions = secondOpinions.filter(a => 
            (a.paymentStatus || '').toLowerCase() === 'paid'
        );
        const totalRevenue = paidAppointments.length * (req.user.feePerConsultation || 0)
            + paidSecondOpinions.length * (req.user.feePerConsultation || 0);

        // --- Review Stats ---
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(1)
            : 0;

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(r => {
            const rounded = Math.round(r.rating || 0);
            if (rounded >= 1 && rounded <= 5) ratingDistribution[rounded]++;
        });

        // --- Busiest Day of Week ---
        const dayOfWeekCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        allAppointments.forEach(a => {
            if (!a.date) return;
            try {
                const d = new Date(a.date);
                if (!isNaN(d)) {
                    dayOfWeekCounts[dayNames[d.getDay()]]++;
                }
            } catch {}
        });

        // --- Second Opinion Stats ---
        const totalSecondOpinions = secondOpinions.length;
        const acceptedSecondOpinions = secondOpinions.filter(s => s.status === 'accepted').length;

        // --- Cancellation Rate ---
        const cancellationRate = totalAppointments > 0
            ? ((statusCounts.cancelled / totalAppointments) * 100).toFixed(1)
            : 0;

        // --- Completion Rate ---
        const completionRate = totalAppointments > 0
            ? (((statusCounts.accepted + statusCounts.completed) / totalAppointments) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                statusCounts,
                monthlyData: Object.values(monthlyData),
                totalRevenue,
                totalReviews,
                averageRating: parseFloat(averageRating),
                ratingDistribution,
                dayOfWeekCounts,
                totalSecondOpinions,
                acceptedSecondOpinions,
                prescriptionCount,
                cancellationRate: parseFloat(cancellationRate),
                completionRate: parseFloat(completionRate),
                totalPatients: new Set(allAppointments.map(a => a.patientId?.toString())).size
            }
        });

    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ success: false, message: "Error fetching analytics" });
    }
};
