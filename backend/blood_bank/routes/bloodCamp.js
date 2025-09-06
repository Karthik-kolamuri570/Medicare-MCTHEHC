

const express = require('express');
const router = express.Router();
const campController = require('../controllers/bloodCampController');
// const requireAuth = require('../middleware/requireAuth'); // authentication (JWT/session)
// const requireDoctor = require('../middleware/requireDoctor'); // must be doctor


router.post('/create-camps',  campController.createBloodCamp);

router.get('/camps',  campController.getBloodCamps);

router.get('/camps/:id',  campController.getBloodCampById);

router.put('/update-camps/:id',  campController.updateBloodCamp);

router.delete('/delete-camps/:id',   campController.deleteBloodCamp);

// router.get('/doctor/:doctorId/blood-camps',  campController.getCampsByDoctor);

router.get('/doctor',  campController.getCampsByDoctor);

module.exports = router;
