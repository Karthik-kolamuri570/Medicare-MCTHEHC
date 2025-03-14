const express=require('express');
const router=express.Router();
const patientController=require('../controllers/patientController');
router.post('/register',patientController.registerPatient);
router.post('/login',patientController.loginPatient);
router.get('/:patientId',patientController.getPatientById);
// router.get('/',patientController.getAllPatients);
router.put('/:patientId',patientController.updatePatient);
module.exports=router;