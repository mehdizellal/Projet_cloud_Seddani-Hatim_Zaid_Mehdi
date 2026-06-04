const mongoose = require('mongoose');

const efmSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    niveau: {
        type: String,
        enum: ['local', 'regional'],
        default: 'local'
    },
    statut: {
        type: String,
        enum: ['OUVERT', 'FERME', 'SCELLE'],
        default: 'OUVERT'
    },
    dateOuverture: Date,
    dateFermeture: Date,
    region: String,
    centre: String,
    filiere: String,
    session: String
}, { timestamps: true });

module.exports = mongoose.model('EFM', efmSchema);
