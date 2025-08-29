const BloodBank = require('../models/BloodBank');

// Middleware to check if blood bank is authenticated
const requireBankAuth = async (req, res, next) => {
    try {
        if (!req.session || !req.session.bankLogin || !req.session.bankLogin.bankId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }
        console.log("Authenticating the  User is Blood Bank Admin or Not....");
        // Verify bank exists and is active
        const bank = await BloodBank.findById(req.session.bankLogin.bankId);
        if (!bank) {
            req.session.destroy();
            return res.status(401).json({
                success: false,
                message: 'Bank account not found. Please login again.'
            });
        }

        // Add bank info to request object
        req.bankId = req.session.bankLogin.bankId;
        console.log(`User is Verified as Bank Admin... with UserId ${req.bankId}`)
        req.bank = bank;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

module.exports = {
    requireBankAuth
};
