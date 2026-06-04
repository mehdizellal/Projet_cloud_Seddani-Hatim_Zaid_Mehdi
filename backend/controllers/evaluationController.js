const EvaluationPratique = require('../models/EvaluationPratique');
const evaluationService = require('../services/evaluationService');

exports.createEvaluation = async (req, res) => {
    try {
        const evaluation = new EvaluationPratique(req.body);
        evaluation.noteFinale = await evaluationService.calculateWeightedScore(evaluation.rubriques);
        await evaluation.save();
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEvaluation = async (req, res) => {
    try {
        if (req.body.rubriques) {
            req.body.noteFinale = await evaluationService.calculateWeightedScore(req.body.rubriques);
        }
        const evaluation = await EvaluationPratique.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await EvaluationPratique.findById(req.params.id);
        if (!evaluation) return res.status(404).json({ message: "Evaluation introuvable" });
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadEvidence = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier fourni" });
        const url = await evaluationService.uploadEvidence(req.file);
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
