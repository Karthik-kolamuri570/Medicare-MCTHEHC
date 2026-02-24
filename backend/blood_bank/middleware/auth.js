const BloodBank = require('../models/BloodBank');
const { verifyToken, extractToken } = require('../../utils/jwt');

/**
 * Blood Bank authentication middleware
 * Verifies JWT from Authorization header and attaches bank to req.bank
 */
const requireBankAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        const decoded = verifyToken(token);
        if (decoded.role !== 'bank') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Blood bank role required.'
            });
        }

        const bank = await BloodBank.findById(decoded.id).select('-password');
        if (!bank) {
            return res.status(401).json({
                success: false,
                message: 'Bank account not found. Please login again.'
            });
        }

        req.bankId = bank._id;
        req.bank = bank;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
        }
        console.error('Bank auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

module.exports = {
    requireBankAuth
};
