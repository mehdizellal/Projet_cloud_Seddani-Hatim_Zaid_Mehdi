const Note = require('../models/Note');

exports.importCsvService = async (filePath) => {
    // Bouchon pour la lecture CSV. Dans une vraie implémentation, utiliser csv-parser.
    console.log(`Lecture du fichier CSV: ${filePath}`);
    const notesToImport = [
        // Exemple de données extraites
        // { matricule: 'A001', note: 15 }
    ];
    return notesToImport;
};

exports.validateNote = (noteObj) => {
    if (noteObj.note < 0 || noteObj.note > 20) {
        throw new Error('La note doit être comprise entre 0 et 20.');
    }
    return true;
};

exports.publishResults = async (epreuveId) => {
    const notes = await Note.find({ epreuveId, statut: 'VALIDE' });
    for (const note of notes) {
        note.statut = 'PUBLIE';
        await note.save();
    }
    return { success: true, count: notes.length };
};
