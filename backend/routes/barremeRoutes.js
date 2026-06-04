const express = require('express');
const router = express.Router();
const barremeController = require('../controllers/barremeController');

// Barremes
router.post('/', barremeController.createBarreme);
router.get('/', barremeController.getBarremes);
router.get('/:id', barremeController.getBarremeById);
router.put('/:id', barremeController.updateBarreme);
router.delete('/:id', barremeController.deleteBarreme);

// Rubriques
router.post('/rubriques', barremeController.createRubrique);
router.put('/rubriques/:id', barremeController.updateRubrique);
router.delete('/rubriques/:id', barremeController.deleteRubrique);

module.exports = router;
