const qcmService = require('../services/qcmService');
const Scan = require('../models/Scan');

exports.uploadScan = async (req, res) => {
    try {
        const filePath = req.file ? req.file.path : 'dummy_scan.pdf';
        const scan = new Scan({ fichier: filePath });
        await scan.save();
        res.status(201).json(scan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.processScan = async (req, res) => {
    try {
        const { scanId } = req.body;
        const scan = await Scan.findById(scanId);
        if (!scan) return res.status(404).json({ message: "Scan introuvable" });

        const candidateData = await qcmService.extractCandidateData(scan.fichier);
        const answers = await qcmService.detectAnswers(scan.fichier);
        const score = await qcmService.calculateScore(scanId);

        scan.statut = 'TRAITE';
        await scan.save();

        res.status(200).json({ candidateData, answers, score, scan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const report = await qcmService.generateReport(req.params.id);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
