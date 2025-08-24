const express = require('express');
const router= express.Router();
const userController=require("./../controllers/userController");
router.get('/',(req,res)=>{
    res.send("Blood bank Home Pagee");
})
router.post('/request-donation',userController.requestDonation);
router.post('/donation-request',userController.donateBlood);
router.post('/accept-request/:requestId',userController.acceptBloodRequest);
router.post('/accept-donation/:donationId',userController.acceptDonation);
router.post('/reject-request',userController.rejectBloodRequest);
router.post('/reject-donation',userController.rejectDonation);
router.get('blood-requests',userController.getAllBloodRequests);
router.get('/donation-requests',userController.getAllDonationRequests);
module.exports=router;