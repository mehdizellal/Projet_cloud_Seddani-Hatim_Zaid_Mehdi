const EvaluationPratique = require('../models/EvaluationPratique');
const Rubrique = require('../models/Rubrique');

exports.calculateWeightedScore = async (rubriquesNotes) => {
    let noteFinale = 0;
    for (const rn of rubriquesNotes) {
        const r = await Rubrique.findById(rn.rubriqueId);
        if (r) {
            noteFinale += (rn.note * r.poids) / 100;
        }
    }
    return noteFinale;
};

exports.uploadEvidence = async (file) => {
    // Bouchon upload
    console.log(`Upload du fichier ${file.originalname}`);
    return `/uploads/${file.filename}`;
};

exports.generateFeedback = (evaluation) => {
    return `
    Observation: ${evaluation.commentaires.observation || ''}
    Forces: ${evaluation.commentaires.forces || ''}
    Faiblesses: ${evaluation.commentaires.faiblesses || ''}
    `;
};
