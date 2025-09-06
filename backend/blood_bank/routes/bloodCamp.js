

const express = require('express');
const router = express.Router();
const campController = require('../controllers/bloodCampController');
// const requireAuth = require('../middleware/requireAuth'); // authentication (JWT/session)
// const requireDoctor = require('../middleware/requireDoctor'); // must be doctor


router.post('/create-camps',  campController.createBloodCamp);
router.get('/camps',  campController.getBloodCamps);
router.get('/camps/:id',  campController.getBloodCampById);
router.put('/update-camps/:id',  campController.updateBloodCamp);
router.delete('/delete-camp/:id',   campController.deleteBloodCamp);
router.post('/:campId/add-donor', campController.addDonorToCamp);
// router.post('/:campId/add-donors', campController.addDonorsToCamp);
router.get('/doctor/camps',  campController.getCampsByDoctor);

module.exports = router;
