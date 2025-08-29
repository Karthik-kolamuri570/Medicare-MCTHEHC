// const express= require('express');
// const router= express.Router();
// const bankController= require('../controllers/bankController');
// router.post('/bank-register',bankController.registerBank);
// router.post('/bank-login',bankController.loginBank);
// router.put('/update-profile', bankController.updateBank);
// router.get('/my-bank', bankController.getBankDetails);
// router.get('/banks',bankController.getAllBanks);
// router.put('/update-stock', bankController.updateStock);
// router.get('/bank-logout', bankController.logoutBank);






// module.exports=router;

const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBankController');
const { requireBankAuth } = require('../middleware/auth');

// Public routes (no auth required)
router.post('/bank-login', bloodBankController.bankLogin);
router.post('/register', bloodBankController.registerBank);

// Protected routes (require bank authentication)
router.get('/verify-auth', bloodBankController.verifyAuth);
router.get('/my-bank', requireBankAuth, bloodBankController.getMyBank);
router.get('/notifications', requireBankAuth, bloodBankController.getNotifications);
router.put('/notifications/mark-all-read', requireBankAuth, bloodBankController.markNotificationsRead);
router.get('/bank-logout', requireBankAuth, bloodBankController.bankLogout);
router.put('/update-profile', requireBankAuth, bloodBankController.updateProfile);
router.get('/banks',bloodBankController.getAllBanks);

module.exports = router;
