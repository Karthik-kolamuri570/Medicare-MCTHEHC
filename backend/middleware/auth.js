const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Admin = require('../models/admin');
const { verifyToken, extractToken } = require('../utils/jwt');

/**
 * Patient authentication middleware
 * Verifies JWT from Authorization header and attaches patient to req.user
 */
exports.patientAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please login.' });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied. Patient role required.' });
    }

    const patient = await Patient.findById(decoded.id).select('-password');
    if (!patient) {
      return res.status(401).json({ message: 'Patient account not found. Please login again.' });
    }

    req.user = patient;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    console.error('Patient auth error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * Doctor authentication middleware
 * Verifies JWT from Authorization header and attaches doctor to req.user
 */
exports.doctorAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please login.' });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. Doctor role required.' });
    }

    const doctor = await Doctor.findById(decoded.id).select('-password');
    if (!doctor) {
      return res.status(401).json({ message: 'Doctor account not found. Please login again.' });
    }

    req.user = doctor;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    console.error('Doctor auth error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * Admin authentication middleware
 * Verifies JWT from Authorization header and attaches admin to req.user
 */
exports.adminAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin account not found.' });
    }

    req.user = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    console.error('Admin auth error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * Role-based authorization middleware for admin users
 * @param {...string} roles - Allowed roles
 */
exports.ensureRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient role privileges' });
    }
    next();
  };
};

/**
 * Permission-based authorization middleware for admin users
 * @param {string} permission - Required permission
 */
exports.ensurePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: `Missing required permission: ${permission}` });
    }
    next();
  };
};
