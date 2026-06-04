const express = require('express');
const router = express.Router();
const efmController = require('../controllers/efmController');

router.post('/', efmController.createEFM);
router.put('/:id', efmController.updateEFM);
router.get('/', efmController.getEFMs);
router.post('/:id/seal', efmController.sealEFM);
router.get('/:id/export-pdf', efmController.exportPDF);
router.get('/:id/export-excel', efmController.exportExcel);

module.exports = router;
