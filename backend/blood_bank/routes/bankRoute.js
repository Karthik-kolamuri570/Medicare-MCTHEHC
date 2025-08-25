const express= require('express');
const router= express.Router();
const bankController= require('../controllers/bankController');
router.post('/bank-register',bankController.registerBank);
router.post('/bank-login',bankController.loginBank);
router.put('/update-profile', bankController.updateBank);
router.get('/my-bank', bankController.getBankDetails);
router.get('/banks',bankController.getAllBanks);
router.put('/update-stock', bankController.updateStock);
router.get('/bank-logout', bankController.logoutBank);






module.exports=router;