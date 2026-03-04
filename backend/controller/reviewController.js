const Review = require('../models/review');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointments');

/**
 * Calculate weighted rating using Bayesian-style formula:
 * weightedRating = avgRating × (1 - e^(-totalRatings / 5))
 * 
 * This ensures doctors with more reviews get a more reliable score.
 * A doctor needs ~5 reviews before their rating stabilizes near its true value.
 */
function calculateWeightedRating(totalRatingScore, totalRatings) {
    if (totalRatings === 0) return 0;
    const avgRating = totalRatingScore / totalRatings;
    const confidence = 1 - Math.exp(-totalRatings / 5);
    return parseFloat((avgRating * confidence).toFixed(2));
}

/**
 * POST /api/patient/review
 * Submit a review for a completed appointment
 */
exports.submitReview = async (req, res) => {
    try {
        let { appointmentId, doctorId, rating, message } = req.body;
        const patientId = req.user._id;

        // Validate required fields
        if (!doctorId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'doctorId and rating are required'
            });
        }

        // Validate rating range (0.1 to 5, rounded to 1 decimal)
        const parsedRating = parseFloat(parseFloat(rating).toFixed(1));
        if (isNaN(parsedRating) || parsedRating < 0.1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 0.1 and 5'
            });
        }

        // Auto-find the most recent appointment if appointmentId not provided
        if (!appointmentId) {
            const recentAppointment = await Appointment.findOne({
                doctorId,
                patientId,
                status: { $in: ['Accepted', 'accepted', 'Completed', 'completed'] }
            }).sort({ _id: -1 });

            if (!recentAppointment) {
                return res.status(404).json({
                    success: false,
                    message: 'No appointment found for this doctor-patient pair'
                });
            }
            appointmentId = recentAppointment._id;
        }

        // Verify appointment exists and belongs to this patient
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        if (appointment.patientId.toString() !== patientId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only review your own appointments'
            });
        }

        // Check for duplicate review
        const existingReview = await Review.findOne({ appointmentId });
        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this appointment'
            });
        }

        // Create the review
        const review = new Review({
            doctorId,
            patientId,
            appointmentId,
            rating: parsedRating,
            message: message || ""
        });
        await review.save();

        // Update doctor's rating stats
        const doctor = await Doctor.findById(doctorId);
        if (doctor) {
            doctor.totalRatings = (doctor.totalRatings || 0) + 1;
            doctor.totalRatingScore = (doctor.totalRatingScore || 0) + parsedRating;
            doctor.rating = calculateWeightedRating(doctor.totalRatingScore, doctor.totalRatings);
            await doctor.save();
        }

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: {
                review,
                updatedDoctorRating: doctor?.rating || 0
            }
        });

    } catch (error) {
        console.error('Error submitting review:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this appointment'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while submitting review'
        });
    }
};

/**
 * GET /api/patient/review/:appointmentId
 * Check if a review already exists for an appointment
 */
exports.getReview = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const review = await Review.findOne({ appointmentId });

        res.status(200).json({
            success: true,
            data: {
                exists: !!review,
                review: review || null
            }
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching review'
        });
    }
};
