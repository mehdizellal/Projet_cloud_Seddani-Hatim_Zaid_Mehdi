const Module = require('../models/Module');
const Filiere = require('../models/Filiere');

// @desc    Créer un nouveau module
// @route   POST /api/modules
// @access  Private / Admin Only
exports.createModule = async (req, res) => {
    try {
        // 1. Verify that the provided filiere ID actually exists
        const filiereExists = await Filiere.findById(req.body.filiere);
        if (!filiereExists) {
            return res.status(404).json({ success: false, message: 'La filière spécifiée est introuvable' });
        }

        // 2. Create the module
        const newModule = await Module.create(req.body);
        res.status(201).json({ success: true, data: newModule });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ce code de module existe déjà' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir tous les modules (avec les infos de leur filière)
// @route   GET /api/modules
// @access  Private / All logged-in users
exports.getModules = async (req, res) => {
    try {
        // .populate() grabs the parent Filiere document. 
        // We pass 'name code' so we only get those specific fields, not the whole massive object.
        const modules = await Module.find().populate('filiere', 'name code');
        
        res.status(200).json({ success: true, count: modules.length, data: modules });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// @desc    Obtenir un seul module par ID
// @route   GET /api/modules/:id
// @access  Private / All logged-in users
exports.getModule = async (req, res) => {
    try {
        const singleModule = await Module.findById(req.params.id).populate('filiere', 'name code');
        
        if (!singleModule) {
            return res.status(404).json({ success: false, message: 'Module introuvable' });
        }
        res.status(200).json({ success: true, data: singleModule });
    } catch (error) {
        res.status(400).json({ success: false, message: 'ID invalide' });
    }
};

// @desc    Mettre à jour un module
// @route   PUT /api/modules/:id
// @access  Private / Admin Only
exports.updateModule = async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedModule) {
            return res.status(404).json({ success: false, message: 'Module introuvable' });
        }
        res.status(200).json({ success: true, data: updatedModule });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer un module
// @route   DELETE /api/modules/:id
// @access  Private / Admin Only
exports.deleteModule = async (req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);
        
        if (!deletedModule) {
            return res.status(404).json({ success: false, message: 'Module introuvable' });
        }
        res.status(200).json({ success: true, message: 'Module supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};