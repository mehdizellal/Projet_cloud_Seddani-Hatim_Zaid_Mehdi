const express = require('express');
const router = express.Router();
const { 
    createSession, 
    markAttendance, 
    getMyAbsences,
    getAbsenceStats
} = require('../controllers/absenceController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // All routes require login

// 1. Formateur / Admin routes
router.post('/session', authorize('Admin', 'Formateur'), createSession);
router.post('/session/:sessionId/mark', authorize('Admin', 'Formateur'), markAttendance);

// 2. Stagiaire route (Project 21: Historique par stagiaire)
router.get('/mes-absences', authorize('Stagiaire'), getMyAbsences);
router.get('/statistiques/:stagiaireId', getAbsenceStats);
module.exports = router;