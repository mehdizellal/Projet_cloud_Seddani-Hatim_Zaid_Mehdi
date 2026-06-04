const mongoose = require('mongoose');

const rubriqueSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    poids: {
        type: Number,
        required: true,
        min: 0
    },
    ordre: {
        type: Number,
        default: 1
    },
    barremeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Barreme',
        required: true
    },
    epreuveId: {
        type: mongoose.Schema.Types.ObjectId, // Remplacer par la réf exacte si Epreuve existe
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Rubrique', rubriqueSchema);
