const express = require('express');
const router = express.Router();
const qcmController = require('../controllers/qcmController');

router.post('/upload', qcmController.uploadScan); // Middleware d'upload à rajouter
router.post('/process', qcmController.processScan);
router.get('/report/:id', qcmController.getReport);

module.exports = router;
