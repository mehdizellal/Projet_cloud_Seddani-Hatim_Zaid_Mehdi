const mongoose = require('mongoose');

const barremeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    statut: {
        type: String,
        enum: ['brouillon', 'actif', 'archivé'],
        default: 'brouillon'
    }
}, { timestamps: true });

module.exports = mongoose.model('Barreme', barremeSchema);
