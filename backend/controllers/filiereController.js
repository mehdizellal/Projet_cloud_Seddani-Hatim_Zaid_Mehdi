const Filiere = require('../models/Filiere');

// @desc    Créer une nouvelle filière
// @route   POST /api/filieres
// @access  Private / Admin Only
exports.createFiliere = async (req, res) => {
    try {
        const filiere = await Filiere.create(req.body);
        res.status(201).json({ success: true, data: filiere });
    } catch (error) {
        // Handle duplicate code error (Mongoose error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Ce code de filière existe déjà' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir toutes les filières
// @route   GET /api/filieres
// @access  Private / All logged-in users
exports.getFilieres = async (req, res) => {
    try {
        const filieres = await Filiere.find({ isActive: true }); // Only fetch active ones
        res.status(200).json({ success: true, count: filieres.length, data: filieres });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};

// @desc    Obtenir une seule filière par ID
// @route   GET /api/filieres/:id
// @access  Private / All logged-in users
exports.getFiliere = async (req, res) => {
    try {
        const filiere = await Filiere.findById(req.params.id);
        if (!filiere) {
            return res.status(404).json({ success: false, message: 'Filière introuvable' });
        }
        res.status(200).json({ success: true, data: filiere });
    } catch (error) {
        res.status(400).json({ success: false, message: 'ID invalide' });
    }
};

// @desc    Mettre à jour une filière
// @route   PUT /api/filieres/:id
// @access  Private / Admin Only
exports.updateFiliere = async (req, res) => {
    try {
        const filiere = await Filiere.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Returns the updated document
            runValidators: true // Ensures the update respects our schema rules
        });

        if (!filiere) {
            return res.status(404).json({ success: false, message: 'Filière introuvable' });
        }
        res.status(200).json({ success: true, data: filiere });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer (Archiver) une filière
// @route   DELETE /api/filieres/:id
// @access  Private / Admin Only
exports.deleteFiliere = async (req, res) => {
    try {
        // Instead of hard deleting, we set isActive to false (Project 18: Archivage)
        const filiere = await Filiere.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        
        if (!filiere) {
            return res.status(404).json({ success: false, message: 'Filière introuvable' });
        }
        res.status(200).json({ success: true, message: 'Filière archivée avec succès' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};