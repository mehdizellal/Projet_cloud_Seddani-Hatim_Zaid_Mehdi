const Barreme = require('../models/Barreme');
const Rubrique = require('../models/Rubrique');
const barremeService = require('../services/barremeService');

exports.createBarreme = async (req, res) => {
    try {
        const barreme = new Barreme(req.body);
        await barreme.save();
        res.status(201).json(barreme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBarremes = async (req, res) => {
    try {
        const barremes = await Barreme.find();
        res.status(200).json(barremes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBarremeById = async (req, res) => {
    try {
        const barreme = await Barreme.findById(req.params.id);
        if (!barreme) return res.status(404).json({ message: "Barème introuvable" });
        res.status(200).json(barreme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateBarreme = async (req, res) => {
    try {
        const barreme = await Barreme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(barreme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteBarreme = async (req, res) => {
    try {
        await Barreme.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRubrique = async (req, res) => {
    try {
        const rubrique = new Rubrique(req.body);
        await rubrique.save();
        
        // Validation des poids après ajout
        const isValid = await barremeService.validateWeights(rubrique.barremeId);
        if (!isValid) {
            console.warn(`Attention: La somme des poids du barème ${rubrique.barremeId} n'est pas égale à 100%`);
        }

        res.status(201).json({ rubrique, validWeight: isValid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRubrique = async (req, res) => {
    try {
        const rubrique = await Rubrique.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(rubrique);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRubrique = async (req, res) => {
    try {
        await Rubrique.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
