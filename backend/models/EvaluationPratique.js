const mongoose = require('mongoose');

const evaluationPratiqueSchema = new mongoose.Schema({
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    examinateurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rubriques: [{
        rubriqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rubrique'
        },
        note: {
            type: Number,
            min: 0
        }
    }],
    noteFinale: {
        type: Number,
        min: 0,
        max: 20
    },
    commentaires: {
        observation: String,
        forces: String,
        faiblesses: String
    },
    piecesJointes: [{
        url: String,
        type: String // ex: 'image', 'video', 'pdf'
    }]
}, { timestamps: true });

module.exports = mongoose.model('EvaluationPratique', evaluationPratiqueSchema);
