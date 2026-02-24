

const express = require('express');
const router = express.Router();
const campController = require('../controllers/bloodCampController');
const auth = require('../../middleware/auth');

// Protected routes (doctor auth required)
router.post('/create-camps', auth.doctorAuth, campController.createBloodCamp);
router.put('/update-camps/:id', auth.doctorAuth, campController.updateBloodCamp);
router.delete('/delete-camp/:id', auth.doctorAuth, campController.deleteBloodCamp);
router.get('/doctor/camps', auth.doctorAuth, campController.getCampsByDoctor);

// Public routes
router.get('/camps', campController.getBloodCamps);
router.get('/camps/:id', campController.getBloodCampById);
router.post('/:campId/add-donor', campController.addDonorToCamp);
router.get('/:campId/donors', campController.getDonorsByCamp);

module.exports = router;
