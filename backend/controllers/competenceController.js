const Competence = require('../models/Competence');
const Module = require('../models/Module');

// @desc    Créer une nouvelle compétence
// @route   POST /api/competences
// @access  Private / Admin Only
exports.createCompetence = async (req, res) => {
    try {
        // 1. Verify that the parent module exists
        const moduleExists = await Module.findById(req.body.module);
        if (!moduleExists) {
            return res.status(404).json({ success: false, message: 'Le module spécifié est introuvable' });
        }

        // 2. Create the competence
        const competence = await Competence.create(req.body);
        res.status(201).json({ success: true, data: competence });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ce code de compétence existe déjà' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir toutes les compétences
// @route   GET /api/competences
// @access  Private / All logged-in users
exports.getCompetences = async (req, res) => {
    try {
        // Populate the parent module details
        const competences = await Competence.find().populate({
            path: 'module',
            select: 'name code',
            populate: { path: 'filiere', select: 'name code' } // Deep populate: get the filiere of the module too!
        });
        
        res.status(200).json({ success: true, count: competences.length, data: competences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// @desc    Obtenir une seule compétence par ID
// @route   GET /api/competences/:id
// @access  Private / All logged-in users
exports.getCompetence = async (req, res) => {
    try {
        const competence = await Competence.findById(req.params.id).populate('module', 'name code');
        
        if (!competence) {
            return res.status(404).json({ success: false, message: 'Compétence introuvable' });
        }
        res.status(200).json({ success: true, data: competence });
    } catch (error) {
        res.status(400).json({ success: false, message: 'ID invalide' });
    }
};

// @desc    Mettre à jour une compétence
// @route   PUT /api/competences/:id
// @access  Private / Admin Only
exports.updateCompetence = async (req, res) => {
    try {
        const competence = await Competence.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!competence) {
            return res.status(404).json({ success: false, message: 'Compétence introuvable' });
        }
        res.status(200).json({ success: true, data: competence });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer une compétence
// @route   DELETE /api/competences/:id
// @access  Private / Admin Only
exports.deleteCompetence = async (req, res) => {
    try {
        const competence = await Competence.findByIdAndDelete(req.params.id);
        
        if (!competence) {
            return res.status(404).json({ success: false, message: 'Compétence introuvable' });
        }
        res.status(200).json({ success: true, message: 'Compétence supprimée avec succès' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};