const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointments');
const Admin = require('../models/admin');
const Blog = require('../Blogs/models/Blogs');
const Comment = require('../Blogs/models/Comment');
const BloodBank = require('../blood_bank/models/BloodBank');
const BloodCamp = require('../blood_bank/models/BloodCamp');
const GetSecondOpinion = require('../models/GetSecondOpinion');
const bcryptjs = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { createNotification } = require('../utils/notification');
const Stripe = require('stripe');
const { generatePresignedUrl } = require('../utils/s3Config');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

      // Generate JWT tokens
      const tokenPayload = { id: admin._id, role: 'admin' };
      const token = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      res.json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        refreshToken,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
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
      // JWT is stateless — client clears the token
      res.json({
        success: true,
        message: 'Admin Logout successful'
      });
    } catch (error) {
      console.error('Error in admin logout:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Refresh Token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
      }

      // Verify the refresh token (must NOT be expired)
      const decoded = verifyToken(refreshToken);

      if (decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Invalid token role' });
      }

      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Admin not found' });
      }

      // Generate new access token
      const newToken = generateAccessToken({ id: admin._id, role: 'admin' });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken
      });
    } catch (error) {
      console.error('Error in token refresh:', error);
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
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

  // ===== PAYMENTS =====
  // List payments derived from appointments (supports filters, search, pagination)
  getPayments: async (req, res) => {
    try {
      const { page = 1, limit = 10, q, status, transactionId, customer, fromDate, toDate } = req.query;
      console.log('getPayments request query:', req.query);
      const match = {};

      // By default include records which have a paymentStatus set (paid/refunded/etc)
      match.paymentStatus = { $exists: true };

      if (status && status !== 'All') match.paymentStatus = status;
      if (transactionId) match.paymentId = { $regex: transactionId, $options: 'i' };

      // Date filters (assume appointment.date is ISO string or parsable)
      if (fromDate || toDate) {
        match.date = {};
        if (fromDate) match.date.$gte = new Date(fromDate).toISOString();
        if (toDate) match.date.$lte = new Date(toDate).toISOString();
      }

      const pipeline = [
        { $match: match },
        // Lookup patient and doctor
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
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
          $addFields: {
            patient: { $arrayElemAt: ['$patient', 0] },
            doctor: { $arrayElemAt: ['$doctor', 0] },
            // Use fields that actually exist in schema
            patientName: { $ifNull: ['$patient.name', ''] },
            patientEmail: { $ifNull: ['$patient.email', ''] },
            doctorName: { $ifNull: ['$doctor.name', ''] },
            doctorFee: { $ifNull: ['$doctor.feePerConsultation', 0] },
            amount: { $ifNull: ['$fee', { $ifNull: ['$price', { $ifNull: ['$doctor.feePerConsultation', 0] }] }] }
          }
        },
      ];

      console.log('payments pipeline initial stages', pipeline);

      // Free-text search (customer name/email or doctor)
      if (q || customer) {
        const search = q || customer;
        pipeline.push({ $match: { $or: [{ patientName: { $regex: search, $options: 'i' } }, { patientEmail: { $regex: search, $options: 'i' } }, { doctorName: { $regex: search, $options: 'i' } }] } });
      }

      // Count total
      const countPipeline = [...pipeline, { $count: 'total' }];
      const countResult = await Appointment.aggregate(countPipeline);
      const total = (countResult[0] && countResult[0].total) || 0;

      // Pagination & sort (most recent first)
      pipeline.push({ $sort: { date: -1, _id: -1 } });
      pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
      pipeline.push({ $limit: Number(limit) });

      // Final projection
      pipeline.push({
        $project: {
          _id: 1,
          paymentId: 1,
          paymentStatus: 1,
          amount: 1,
          date: 1,
          status: 1,
          patientName: 1,
          patientEmail: 1,
          doctorName: 1
        }
      });

      console.log('payments pipeline final stages', pipeline);

      const results = await Appointment.aggregate(pipeline);

      // Add reconciliation status: simple heuristic
      const data = results.map(r => ({
        ...r,
        reconciliation: (r.paymentStatus === 'Paid' && r.amount && r.amount > 0) ? 'Matched' : (r.paymentStatus === 'Refunded' ? 'Matched' : (r.paymentStatus === 'Paid' ? 'Mismatched' : 'Pending'))
      }));

      res.json({ success: true, data, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      console.error('Error in getPayments:', error);
      res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
  },

  // Refund a payment (via Stripe) and update appointment status
  refundPayment: async (req, res) => {
    try {
      const { paymentId } = req.params;
      if (!paymentId) return res.status(400).json({ success: false, message: 'paymentId required' });

      // Create refund on Stripe
      const refund = await stripe.refunds.create({ payment_intent: paymentId });

      // Update any appointments with this paymentId
      const updated = await Appointment.updateMany({ paymentId }, { $set: { paymentStatus: 'Refunded', status: 'Refunded' } });

      // Optionally notify patient(s) - best-effort: push a notification to the patient document
      const affected = await Appointment.find({ paymentId });
      for (const appt of affected) {
        if (appt.patientId) {
          await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: createNotification('payment-refund', `Payment for appointment ${appt._id} has been refunded.`, { appointmentId: appt._id, refundId: refund.id }) } });
        }
      }

      res.json({ success: true, message: 'Refund issued', refund, updatedCount: updated.nModified || updated.modifiedCount || 0 });
    } catch (error) {
      console.error('Error in refundPayment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Debug helper: return a few appointments with payment fields (no aggregation)
  getPaymentsDebug: async (req, res) => {
    try {
      const docs = await Appointment.find({ paymentStatus: { $exists: true } }).sort({ _id: -1 }).limit(20).populate('patientId', 'name email').populate('doctorId', 'name feePerConsultation');
      const data = docs.map(d => ({
        _id: d._id,
        paymentId: d.paymentId,
        paymentStatus: d.paymentStatus,
        // show appointment fee/price and fall back to doctor's fee
        amount: d.fee || d.price || (d.doctorId && d.doctorId.feePerConsultation) || 0,
        date: d.date,
        patientName: d.patientId ? d.patientId.name : null,
        patientEmail: d.patientId ? d.patientId.email : null,
        doctorName: d.doctorId ? d.doctorId.name : null,
        doctorFee: d.doctorId ? d.doctorId.feePerConsultation : null
      }));
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error in getPaymentsDebug:', error);
      res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
  },

  // ===== BLOGS (ADMIN) =====
  // List blogs (all doctors) with filters for status, search, pagination
  getBlogsAdmin: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, q, doctorId } = req.query;
      const filter = {};

      if (status && status !== 'All') filter.status = status;
      if (doctorId) filter.doctor_id = doctorId;

      if (q) {
        const regex = new RegExp(q, 'i');
        filter.$or = [
          { title: regex },
          { description: regex },
          { content: regex }
        ];
      }

      const pageNum = Math.max(1, Number(page));
      const lim = Math.min(100, Math.max(1, Number(limit)));
      const skip = (pageNum - 1) * lim;

      const [blogs, total] = await Promise.all([
        Blog.find(filter)
          .populate('doctor_id', 'name email profileImage')
          .sort({ published_at: -1, createdAt: -1 })
          .skip(skip).limit(lim),
        Blog.countDocuments(filter)
      ]);

      // Sign profile images of blog authors
      const enrichedBlogs = await Promise.all(blogs.map(async (blog) => {
        const blogObj = blog.toObject();
        if (blogObj.doctor_id && blogObj.doctor_id.profileImage) {
          blogObj.doctor_id.profileImage = await generatePresignedUrl(blogObj.doctor_id.profileImage);
        }
        return blogObj;
      }));

      res.json({ success: true, blogs: enrichedBlogs, meta: { total, page: pageNum, limit: lim } });
    } catch (error) {
      console.error('Error in getBlogsAdmin:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete a blog as admin (removes authored blog regardless of owner)
  deleteBlogAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ success: false, message: 'Blog id required' });
      const blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

      await blog.deleteOne();
      // Note: optionally remove associated comments/likes in their collections if needed

      res.json({ success: true, message: 'Blog deleted by admin' });
    } catch (error) {
      console.error('Error in deleteBlogAdmin:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Get comments for a specific blog (Admin)
  getBlogCommentsAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await Comment.find({ blog_id: id })
        .populate('patient_id', 'name email') // Populate patient details
        .sort({ createdAt: -1 });

      res.json({ success: true, comments });
    } catch (error) {
      console.error('Error fetching comments for admin:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete a comment (Admin)
  deleteCommentAdmin: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      // Decrement the comment count on the blog
      await Blog.findByIdAndUpdate(comment.blog_id, {
        $inc: { comments_count: -1 }
      });

      await Comment.findByIdAndDelete(commentId);

      res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
  },

  // ===== BLOOD CAMPS (ADMIN) =====
  getBloodCampsAdmin: async (req, res) => {
    try {
      const camps = await BloodCamp.find()
        .populate("organizer", "name email contact")
        .sort({ start_date: 1 });
      res.json({ success: true, data: camps });
    } catch (error) {
      console.error("Failed to fetch blood camps for admin:", error);
      res.status(500).json({ success: false, message: "Failed to fetch blood camps" });
    }
  },

  deleteBloodCampAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const camp = await BloodCamp.findById(id);
      if (!camp) return res.status(404).json({ success: false, message: "Camp not found" });

      await camp.deleteOne();
      res.json({ success: true, message: "Blood camp deleted successfully" });
    } catch (error) {
      console.error("Failed to delete blood camp:", error);
      res.status(500).json({ success: false, message: "Failed to delete blood camp" });
    }
  },

  // Get all blood banks with inventory
  getBloodBanksAdmin: async (req, res) => {
    try {
      const banks = await BloodBank.find().select('-password');
      res.status(200).json({ success: true, count: banks.length, data: banks });
    } catch (error) {
      console.error('Get blood banks error:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch blood banks' });
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
        const notification = createNotification('doctor-approved', 'Your application has been approved. You can now receive appointments.', { doctorId: doctor._id });
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
        const notification = createNotification('doctor-rejected', 'Your application has been rejected. Contact support for more details.', { doctorId: doctor._id });
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
        pipeline.push({ $match: { $or: [{ doctorName: { $regex: q, $options: 'i' } }, { patientName: { $regex: q, $options: 'i' } }] } });
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

  // Delete a single appointment
  deleteAppointment: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      await Appointment.findByIdAndDelete(appointmentId);

      res.json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
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
        const patientNotify = createNotification('appointment-cancelled', `Your appointment on ${appt.date} ${appt.time} was cancelled by admin`, { appointmentId: appt._id });
        const doctorNotify = createNotification('appointment-cancelled', `An appointment on ${appt.date} ${appt.time} was cancelled by admin`, { appointmentId: appt._id });
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: patientNotify } }).catch(() => { });
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: doctorNotify } }).catch(() => { });
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
        const pNotify = createNotification('appointment-cancelled', `Your appointment on ${appt.date} ${appt.time} was cancelled by admin`, { appointmentId: appt._id });
        const dNotify = createNotification('appointment-cancelled', `An appointment on ${appt.date} ${appt.time} was cancelled by admin`, { appointmentId: appt._id });
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: pNotify } }).catch(() => { });
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: dNotify } }).catch(() => { });
      }
      res.json({ success: true, modifiedCount: result.nModified || result.modifiedCount || 0 });
    } catch (error) {
      console.error('Error in bulkCancelAppointments:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ===== SECOND OPINIONS (Admin) =====
  // Get all second opinion requests with patient & doctor info
  getAllSecondOpinions: async (req, res) => {
    try {
      const { page = 1, limit = 20, status, q } = req.query;
      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

      const query = {};
      if (status && status !== 'all') query.status = status;

      const data = await GetSecondOpinion.find(query)
        .populate('patientId', 'name email contact')
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await GetSecondOpinion.countDocuments(query);

      // Map to a consistent format for the frontend
      const formatted = data.map(item => ({
        ...item.toObject(),
        patient: item.patientId,
        doctor: item.doctorId,
        type: 'Second Opinion'
      }));

      res.json({
        success: true,
        data: formatted,
        meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Error in getAllSecondOpinions:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Cancel a second opinion request
  cancelSecondOpinion: async (req, res) => {
    try {
      const { opinionId } = req.params;
      const opinion = await GetSecondOpinion.findByIdAndUpdate(opinionId, { status: 'rejected' }, { new: true });

      if (!opinion) {
        return res.status(404).json({ success: false, message: 'Second opinion request not found' });
      }

      res.json({ success: true, data: opinion, message: 'Second opinion request cancelled' });
    } catch (error) {
      console.error('Error in cancelSecondOpinion:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Delete a second opinion request
  deleteSecondOpinion: async (req, res) => {
    try {
      const { opinionId } = req.params;
      const opinion = await GetSecondOpinion.findById(opinionId);

      if (!opinion) {
        return res.status(404).json({ success: false, message: 'Second opinion request not found' });
      }

      await GetSecondOpinion.findByIdAndDelete(opinionId);

      res.json({
        success: true,
        message: 'Second opinion request deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteSecondOpinion:', error);
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
        const pNotify = createNotification('appointment-rescheduled', `Your appointment was rescheduled to ${date} ${time}`, { appointmentId: appt._id });
        const dNotify = createNotification('appointment-rescheduled', `An appointment was rescheduled to ${date} ${time}`, { appointmentId: appt._id });
        await Patient.findByIdAndUpdate(appt.patientId, { $push: { unseenNotifications: pNotify } }).catch(() => { });
        await Doctor.findByIdAndUpdate(appt.doctorId, { $push: { unseenNotifications: dNotify } }).catch(() => { });
      }
      res.json({ success: true, data: appt });
    } catch (error) {
      console.error('Error in rescheduleAppointment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // ============ ADMIN NOTIFICATIONS ============
  getNotifications: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

      res.json({
        success: true,
        data: {
          unseenNotifications: admin.unseenNotifications || [],
          seenNotifications: admin.seenNotifications || []
        }
      });
    } catch (err) {
      console.error('Get admin notifications error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  },

  getNotificationCount: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id).select('unseenNotifications');
      if (!admin) return res.status(404).json({ success: false, count: 0 });
      res.json({ success: true, count: (admin.unseenNotifications || []).length });
    } catch (err) {
      res.status(500).json({ success: false, count: 0 });
    }
  },

  markNotificationsAsSeen: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

      admin.seenNotifications = [
        ...(admin.seenNotifications || []),
        ...(admin.unseenNotifications || [])
      ];
      admin.unseenNotifications = [];
      await admin.save({ validateBeforeSave: false });
      res.json({ success: true, message: 'All notifications marked as seen' });
    } catch (err) {
      console.error('Mark admin notifications error:', err);
      res.status(500).json({ success: false, message: 'Failed to mark notifications' });
    }
  },

  clearAllNotifications: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

      admin.unseenNotifications = [];
      admin.seenNotifications = [];
      await admin.save({ validateBeforeSave: false });
      res.json({ success: true, message: 'All notifications cleared' });
    } catch (err) {
      console.error('Clear admin notifications error:', err);
      res.status(500).json({ success: false, message: 'Failed to clear notifications' });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { index, type } = req.body;
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

      if (type === 'unseen') {
        admin.unseenNotifications.splice(index, 1);
      } else {
        admin.seenNotifications.splice(index, 1);
      }

      admin.markModified('unseenNotifications');
      admin.markModified('seenNotifications');
      await admin.save({ validateBeforeSave: false });
      res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
      console.error('Delete admin notification error:', err);
      res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
  }
};

module.exports = adminController;
