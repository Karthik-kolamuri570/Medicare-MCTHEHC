



// controllers/adminController.js
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointments');
const Admin = require('../models/admin');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {
  // ===== AUTHENTICATION =====
  
  // Admin Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      // Find admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Check password
      const isPasswordValid = await bcryptjs.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    
      // Generate JWT token
      const token = jwt.sign(
        { _id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();
      req.session.adminLogin=admin;
      req.session.save();
      res.json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin:admin.lastLogin
        }
      });
    } catch (error) {
      console.error('Error in admin login:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Admin Logout
  logout: async (req, res) => {
    try {
    const sessionId = req.sessionID;
    console.log("Logging out session ID:", sessionId);

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }

        // Manually remove session from MongoDB store (belt & suspenders approach)
        req.sessionStore.destroy(sessionId, (err) => {
            if (err) {
                console.error('Manual store destroy failed:', err);
            } else {
                console.log('Session manually removed from MongoDB store:', sessionId);
            }

            // Clear cookie from client
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                sameSite: 'lax'
            });
            res.json({
                success: true,
                message: ' Admin Logout successful'
            });

            // res.redirect('/api/patient/login'); // Redirect to login page
        });
    });
     
    } catch (error) {
      console.error('Error in admin logout:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Refresh Token
  refreshToken: async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ success: false, message: 'Token is required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
      const admin = await Admin.findById(decoded._id);

      if (!admin) {
        return res.status(401).json({ success: false, message: 'Admin not found' });
      }

      // Generate new token
      const newToken = jwt.sign(
        { _id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken
      });
    } catch (error) {
      console.error('Error in token refresh:', error);
      res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
  },

  // ===== DASHBOARD STATISTICS =====
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
