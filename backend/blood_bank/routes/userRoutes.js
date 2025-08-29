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
const userAuth=require('./../../middleware/auth')
//In Future i have to include Blood bank Admin middleware because accept and rejection of donations and request arenreplaced there soo. 



router.get('/blood-requests', userAuth.patientAuth, bloodBankUserController.getAllBloodRequestsForBank);
router.get('/donation-requests', userAuth.patientAuth, bloodBankUserController.getAllDonationRequestsForBank);
router.post('/request-blood',bloodBankUserController.requestDonation);
router.post('/donation-request',bloodBankUserController.donateBlood);
router.post('/accept-request/:id', bloodBankUserController.acceptBloodRequest);
router.put('/reject-request/:id', bloodBankUserController.rejectBloodRequest);
router.post('/accept-donation/:id', bloodBankUserController.acceptDonation);
router.put('/reject-donation/:id', bloodBankUserController.rejectDonation);
router.get('/blood/urgent-requests', userAuth.patientAuth, bloodBankUserController.getUrgentRequests);

module.exports = router;
