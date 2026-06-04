const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

router.post('/', evaluationController.createEvaluation);
router.put('/:id', evaluationController.updateEvaluation);
router.get('/:id', evaluationController.getEvaluationById);
router.post('/upload', evaluationController.uploadEvidence); // Middleware d'upload à rajouter

module.exports = router;
