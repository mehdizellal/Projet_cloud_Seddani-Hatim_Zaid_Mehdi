const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    fichier: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'TRAITE', 'ERREUR'],
        default: 'EN_ATTENTE'
    },
    rapport: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
