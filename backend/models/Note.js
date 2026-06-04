const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    epreuveId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    note: {
        type: Number,
        min: 0,
        max: 20
    },
    statut: {
        type: String,
        enum: ['BROUILLON', 'SOUMIS', 'VALIDE', 'PUBLIE', 'ABS', 'NON_PRESENT', 'ELIMINE'],
        default: 'BROUILLON'
    },
    saisiePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    validePar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
