



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
        .select('name email specialization experience hospital location feePerConsultation fromTime toTime contact');

      // Add createdAt timestamp derived from ObjectId if not present
      const enriched = pendingDoctors.map(d => ({
        ...d.toObject(),
        createdAt: d.createdAt || (d._id ? d._id.getTimestamp() : null)
      }));

      res.json(enriched);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveDoctorRegistration: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { verifiedByAdmin: 'approved', status: 'active' },
        { new: true }
      );
      // Notify doctor about approval
      if (doctor) {
        const notification = {
          type: 'doctor-approved',
          message: 'Your application has been approved. You can now receive appointments.',
          data: { doctorId: doctor._id }
        };
        await Doctor.findByIdAndUpdate(doctorId, { $push: { unseenNotifications: notification } });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reject doctor application
  rejectDoctorRegistration: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { verifiedByAdmin: 'rejected', status: 'rejected' },
        { new: true }
      );
      // Notify doctor about rejection
      if (doctor) {
        const notification = {
          type: 'doctor-rejected',
          message: 'Your application has been rejected. Contact support for more details.',
          data: { doctorId: doctor._id }
        };
        await Doctor.findByIdAndUpdate(doctorId, { $push: { unseenNotifications: notification } });
      }
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
,

  // ===== USER MANAGEMENT =====
  // Get all patients (users)
  getAllUsers: async (req, res) => {
    try {
      const users = await Patient.find().select('name email contact address gender age').lean();

      // Add a createdAt value derived from the ObjectId timestamp if not present
      const usersWithCreatedAt = users.map(u => ({
        ...u,
        createdAt: u.createdAt || (u._id ? u._id.getTimestamp() : null)
      }));

      res.json({ success: true, users: usersWithCreatedAt });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get single user by id
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await Patient.findById(userId).lean();
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // Add createdAt if missing
      const result = {
        ...user,
        createdAt: user.createdAt || (user._id ? user._id.getTimestamp() : null)
      };

      res.json({ success: true, user: result });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  ,

  // ===== APPOINTMENTS (Admin) =====
  // Get all appointments with patient & doctor info (supports filters & pagination)
  getAllAppointments: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, doctorId, fromDate, toDate, q } = req.query;
      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

      const baseMatch = {};
      if (status) baseMatch.status = status;
      if (doctorId) baseMatch.doctorId = doctorId;
      if (fromDate || toDate) {
        baseMatch.date = {};
        if (fromDate) baseMatch.date.$gte = fromDate;
        if (toDate) baseMatch.date.$lte = toDate;
      }

      // Build aggregation to support text search and total count
      const pipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor'
          }
        },
        { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
          }
        },
        { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            doctorName: '$doctor.name',
            patientName: '$patient.name'
          }
        }
      ];

      // If free-text search 'q' is provided, match after adding fields
      if (q) {
        pipeline.push({ $match: { $or: [ { doctorName: { $regex: q, $options: 'i' } }, { patientName: { $regex: q, $options: 'i' } } ] } });
      }

      const countPipeline = [...pipeline, { $count: 'total' }];
      const dataPipeline = [...pipeline, { $sort: { date: -1 } }, { $skip: skip }, { $limit: Number(limit) }];

      const [countRes, dataRes] = await Promise.all([
        Appointment.aggregate(countPipeline),
        Appointment.aggregate(dataPipeline)
      ]);

      const total = (countRes[0] && countRes[0].total) || 0;

      res.json({ success: true, data: dataRes, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      console.error('Error in getAllAppointments:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Cancel a single appointment
  cancelAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appt = await Appointment.findByIdAndUpdate(appointmentId, { status: 'Cancelled' }, { new: true });
      if (appt) {
        // notify patient and doctor
        const patientNotify = { type: 'appointment-cancelled', message: `Your appointment on ${appt.date} ${appt.time} was cancelled by admin`, data: { appointmentId: appt._id } };
        const doctorNotify = { type: 'appointment-cancelled', message: `An appointment on ${appt.date} ${appt.time} was cancelled by admin`, data: { appointmentId: appt._id } };
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: patientNotify } }).catch(()=>{});
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: doctorNotify } }).catch(()=>{});
      }
      res.json({ success: true, data: appt });
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Bulk cancel appointments
  bulkCancelAppointments: async (req, res) => {
    try {
      const { appointmentIds } = req.body;
      if (!Array.isArray(appointmentIds) || appointmentIds.length === 0) return res.status(400).json({ success: false, message: 'appointmentIds array required' });
      const result = await Appointment.updateMany({ _id: { $in: appointmentIds } }, { $set: { status: 'Cancelled' } });
      // Optionally push notifications in background
      const appts = await Appointment.find({ _id: { $in: appointmentIds } });
      for (const appt of appts) {
        const pNotify = { type: 'appointment-cancelled', message: `Your appointment on ${appt.date} ${appt.time} was cancelled by admin`, data: { appointmentId: appt._id } };
        const dNotify = { type: 'appointment-cancelled', message: `An appointment on ${appt.date} ${appt.time} was cancelled by admin`, data: { appointmentId: appt._id } };
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: pNotify } }).catch(()=>{});
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: dNotify } }).catch(()=>{});
      }
      res.json({ success: true, modifiedCount: result.nModified || result.modifiedCount || 0 });
    } catch (error) {
      console.error('Error in bulkCancelAppointments:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Reschedule an appointment (update date/time)
  rescheduleAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { date, time } = req.body;
      if (!date || !time) return res.status(400).json({ success: false, message: 'date and time are required' });
      const appt = await Appointment.findByIdAndUpdate(appointmentId, { date, time, status: 'Scheduled' }, { new: true });
      if (appt) {
        const pNotify = { type: 'appointment-rescheduled', message: `Your appointment was rescheduled to ${date} ${time}`, data: { appointmentId: appt._id } };
        const dNotify = { type: 'appointment-rescheduled', message: `An appointment was rescheduled to ${date} ${time}`, data: { appointmentId: appt._id } };
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: pNotify } }).catch(()=>{});
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: dNotify } }).catch(()=>{});
      }
      res.json({ success: true, data: appt });
    } catch (error) {
      console.error('Error in rescheduleAppointment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = adminController;
