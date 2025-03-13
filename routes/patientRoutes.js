const express=require('express');
const router=express.Router();
const patientController=require('../controllers/patientController');
router.get('/api/patient/register',patientController.registerPatient);
router.get('/api/patient/login',patientController.loginPatient);

module.exports=router;