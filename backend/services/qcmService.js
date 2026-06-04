const Scan = require('../models/Scan');
const ReponseQCM = require('../models/ReponseQCM');

exports.extractCandidateData = async (filePath) => {
    // Bouchon OCR
    console.log(`Extraction OCR depuis ${filePath}`);
    return { matricule: "A001", nom: "Doe", prenom: "John" };
};

exports.detectAnswers = async (filePath) => {
    // Bouchon OMR
    console.log(`Détection OMR depuis ${filePath}`);
    return [
        { questionId: "64a2b1c3e4d5f6a7b8c9d0e1", reponseDetectee: "A" }
    ];
};

exports.calculateScore = async (scanId) => {
    const reponses = await ReponseQCM.find({ scanId });
    let score = 0;
    for (const rep of reponses) {
        if (rep.correct) score += 1; // Exemple : 1 point par question
    }
    return score;
};

exports.generateReport = async (scanId) => {
    const scan = await Scan.findById(scanId);
    return { scanId: scan._id, fichier: scan.fichier, statut: scan.statut, erreurs: scan.rapport };
};
