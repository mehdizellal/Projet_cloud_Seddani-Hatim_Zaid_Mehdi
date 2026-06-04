const Rubrique = require('../models/Rubrique');

exports.validateWeights = async (barremeId) => {
    const rubriques = await Rubrique.find({ barremeId });
    const totalWeight = rubriques.reduce((sum, r) => sum + r.poids, 0);
    return totalWeight === 100;
};

exports.previewCalculation = (rubriques, notesRubriques) => {
    // rubriques: [{_id, poids}], notesRubriques: [{rubriqueId, note}]
    let noteFinale = 0;
    for (const r of rubriques) {
        const nr = notesRubriques.find(n => n.rubriqueId.toString() === r._id.toString());
        if (nr) {
            noteFinale += (nr.note * r.poids) / 100;
        }
    }
    return noteFinale;
};
