const EFM = require('../models/EFM');
const efmService = require('../services/efmService');

exports.createEFM = async (req, res) => {
    try {
        const efm = new EFM(req.body);
        await efm.save();
        res.status(201).json(efm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEFM = async (req, res) => {
    try {
        const efm = await EFM.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(efm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEFMs = async (req, res) => {
    try {
        const efms = await EFM.find(req.query);
        res.status(200).json(efms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sealEFM = async (req, res) => {
    try {
        // En vrai, récupérer l'utilisateur depuis req.user (middleware d'auth)
        const userId = req.body.userId || '60d21b4667d0d8992e610c85'; 
        const efm = await efmService.sealExam(req.params.id, userId);
        res.status(200).json(efm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.exportPDF = async (req, res) => {
    try {
        const url = await efmService.exportPV(req.params.id, 'pdf');
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.exportExcel = async (req, res) => {
    try {
        const url = await efmService.exportPV(req.params.id, 'excel');
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
