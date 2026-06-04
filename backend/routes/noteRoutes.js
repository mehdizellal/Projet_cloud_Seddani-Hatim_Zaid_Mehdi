const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.put('/:id', noteController.updateNote);
router.post('/import-csv', noteController.importCsv); // Middleware d'upload à rajouter dans une implémentation complète
router.post('/:id/validate', noteController.validateNoteStatus);
router.post('/:id/publish', noteController.publishNote);

module.exports = router;
