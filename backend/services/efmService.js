const EFM = require('../models/EFM');
const AuditLog = require('../models/AuditLog');

exports.sealExam = async (efmId, userId) => {
    const efm = await EFM.findById(efmId);
    if (!efm) throw new Error("EFM introuvable");
    if (efm.statut === 'SCELLE') throw new Error("Déjà scellé");

    const oldData = { statut: efm.statut };
    efm.statut = 'SCELLE';
    await efm.save();

    await this.auditService(userId, 'SCELLEMENT_EFM', oldData, { statut: 'SCELLE' });
    return efm;
};

exports.exportPV = async (efmId, format) => {
    // Bouchon export PDF/Excel
    console.log(`Génération du PV pour EFM ${efmId} au format ${format}`);
    return `/exports/pv_${efmId}.${format}`;
};

exports.auditService = async (userId, action, oldData, newData) => {
    const log = new AuditLog({ userId, action, oldData, newData });
    await log.save();
    return log;
};
