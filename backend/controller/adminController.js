// controllers/adminController.js
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointments');
const Admin = require('../models/admin');

const adminController = {
  // Dashboard Statistics
  getDashboardStats: async (req, res) => {
    try {
      const stats = {
        doctors: await Doctor.countDocuments(),
        patients: await Patient.countDocuments(),
        appointments: await Appointment.countDocuments(),
        pendingApprovals: await Doctor.countDocuments({ verifiedByAdmin: 'pending' })
      };

      // Get revenue from appointments instead of Payment model
      const revenue = await Appointment.aggregate([
        {
          $match: {
            status: 'completed',
            fee: { $exists: true }
          }
        },
        {
          $group: {
            _id: { 
              month: { $month: "$date" },
              year: { $year: "$date" }
            },
            total: { $sum: "$fee" }
          }
        },
        {
          $sort: { 
            "_id.year": 1, 
            "_id.month": 1 
          }
        }
      ]);

      const doctorStats = await Doctor.aggregate([
        {
          $group: {
            _id: "$specialization",
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedRevenue = revenue.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        total: item.total || 0
      }));

      res.json({
        stats,
        revenue: formattedRevenue,
        doctorStats
      });
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getPendingDoctors: async (req, res) => {
    try {
      const pendingDoctors = await Doctor.find({ verifiedByAdmin: 'pending' })
        .select('name email specialization experience');
      res.json(pendingDoctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveDoctorRegistration: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { verifiedByAdmin: 'approved' },
        { new: true }
      );
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getRevenueDetails: async (req, res) => {
    try {
      const revenueByDoctor = await Appointment.aggregate([
        {
          $match: {
            status: 'completed',
            fee: { $exists: true }
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor'
          }
        },
        {
          $unwind: '$doctor'
        },
        {
          $group: {
            _id: {
              doctorId: '$doctorId',
              doctorName: '$doctor.name',
              specialization: '$doctor.specialization'
            },
            totalRevenue: { $sum: '$fee' },
            appointmentCount: { $sum: 1 }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ]);

      res.json(revenueByDoctor);
    } catch (error) {
      console.error('Error in getRevenueDetails:', error);
      res.status(500).json({ error: error.message });
    }
  }, // Added missing comma here

  getPatientAnalytics: async (req, res) => {
    try {
      const ageGroups = await Patient.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: ["$age", 20] }, then: "0-20" },
                  { case: { $lte: ["$age", 40] }, then: "21-40" },
                  { case: { $lte: ["$age", 60] }, then: "41-60" }
                ],
                default: "60+"
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(ageGroups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAppointmentAnalytics: async (req, res) => {
    try {
      const appointmentStats = await Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(appointmentStats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;