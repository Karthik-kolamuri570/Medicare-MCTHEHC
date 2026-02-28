// const express = require('express');
// const router= express.Router();
// const userController=require("./../controllers/userController");
// router.get('/',(req,res)=>{
//     res.send("Blood bank Home Pagee");
// })
// router.post('/request-blood',userController.requestDonation);
// router.post('/donation-request',userController.donateBlood);
// router.post('/accept-request/:requestId',userController.acceptBloodRequest);
// router.post('/accept-donation/:donationId',userController.acceptDonation);
// router.put('/reject-request/:requestId',userController.rejectBloodRequest);
// router.put('/reject-donation/:donationId',userController.rejectDonation);
// router.get('/blood-requests',userController.getAllBloodRequests);
// router.get('/donation-requests',userController.getAllDonationRequests);
// module.exports=router;




const express = require('express');
const router = express.Router();
const bloodBankUserController = require('../controllers/bloodBankUserController');
const userAuth=require('./../../middleware/auth');
const { requireBankAuth } = require('../middleware/auth');
//In Future i have to include Blood bank Admin middleware because accept and rejection of donations and request arenreplaced there soo. 



router.get('/blood-requests', userAuth.patientAuth, bloodBankUserController.getAllBloodRequestsForBank);
router.get('/donation-requests', userAuth.patientAuth, bloodBankUserController.getAllDonationRequestsForBank);
router.post('/request-blood', userAuth.patientAuth, bloodBankUserController.requestDonation);
router.post('/donation-request', userAuth.patientAuth, bloodBankUserController.donateBlood);
router.put('/accept-request/:id', requireBankAuth, bloodBankUserController.acceptBloodRequest);
router.put('/reject-request/:id', requireBankAuth, bloodBankUserController.rejectBloodRequest);
router.put('/accept-donation/:id', requireBankAuth, bloodBankUserController.acceptDonation);
router.put('/reject-donation/:id', requireBankAuth, bloodBankUserController.rejectDonation);
router.get('/blood/urgent-requests',  bloodBankUserController.getUrgentRequests);

module.exports = router;
