const mongoose = require('mongoose');

const reponseQCMSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reponseDetectee: {
        type: String,
        required: true
    },
    bonneReponse: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    },
    scanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scan'
    }
}, { timestamps: true });

module.exports = mongoose.model('ReponseQCM', reponseQCMSchema);
