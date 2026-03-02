const mongoose = require('mongoose');
const Session = require('../models/Session');
const Absence = require('../models/Absence');

// @desc    Créer une nouvelle session de cours
// @route   POST /api/absences/session
// @access  Private / Formateur & Admin
exports.createSession = async (req, res) => {
    try {
        // Automatically assign the logged-in user as the formateur
        req.body.formateur = req.user.id; 

        const session = await Session.create(req.body);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Enregistrer les présences pour une session (Multiple stagiaires d'un coup)
// @route   POST /api/absences/session/:sessionId/mark
// @access  Private / Formateur & Admin
exports.markAttendance = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { attendances } = req.body; // Expecting an array: [{stagiaire: "id", status: "Absent"}, ...]

        // 1. Verify session exists
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session introuvable' });
        }

        // 2. Add the sessionId to every attendance record before saving
        const recordsToSave = attendances.map(record => ({
            session: sessionId,
            stagiaire: record.stagiaire,
            status: record.status,
            remarks: record.remarks || ''
        }));

        // 3. Insert all records into the database at once (Bulk Insert)
        const savedRecords = await Absence.insertMany(recordsToSave);

        res.status(201).json({ success: true, count: savedRecords.length, data: savedRecords });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Les présences ont déjà été saisies pour un ou plusieurs stagiaires de cette session.' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Voir l'historique de ses propres absences (Pour le stagiaire)
// @route   GET /api/absences/mes-absences
// @access  Private / Stagiaire
exports.getMyAbsences = async (req, res) => {
    try {
        // Find absences only for the logged-in user, and populate the session/module details!
        const absences = await Absence.find({ stagiaire: req.user.id })
            .populate({
                path: 'session',
                select: 'date startTime endTime',
                populate: { path: 'module', select: 'name code' }
            });

        res.status(200).json({ success: true, count: absences.length, data: absences });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
};
// @desc    Obtenir les statistiques d'absence d'un stagiaire
// @route   GET /api/absences/statistiques/:stagiaireId
// @access  Private / Formateur, Admin ou Stagiaire (lui-même)
exports.getAbsenceStats = async (req, res) => {
    try {
        const { stagiaireId } = req.params;

        // Security: A Stagiaire can only view their own stats
        if (req.user.role === 'Stagiaire' && req.user.id !== stagiaireId) {
            return res.status(403).json({ success: false, message: 'Accès refusé' });
        }

        // The MongoDB Aggregation Pipeline
        const stats = await Absence.aggregate([
            { $match: { stagiaire: new mongoose.Types.ObjectId(stagiaireId) } },
            { $group: {
                _id: '$status', // Group by the 'status' field (Présent, Absent, etc.)
                count: { $sum: 1 } // Count how many times each status appears
            }}
        ]);

        // Format the results into a clean object
        const formattedStats = {
            Présent: 0,
            Absent: 0,
            Retard: 0,
            Justifié: 0,
            totalSessions: 0
        };

        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.totalSessions += stat.count;
        });

        // Calculate attendance rate (Présent + Retard count as attending)
        let tauxPresence = 100;
        if (formattedStats.totalSessions > 0) {
            const totalPresent = formattedStats.Présent + formattedStats.Retard;
            tauxPresence = ((totalPresent / formattedStats.totalSessions) * 100).toFixed(2);
        }

        res.status(200).json({
            success: true,
            data: {
                details: formattedStats,
                tauxPresence: `${tauxPresence}%`
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};