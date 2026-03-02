const express = require('express');
const router = express.Router();
const { 
    createCompetence, 
    getCompetences, 
    getCompetence, 
    updateCompetence, 
    deleteCompetence 
} = require('../controllers/competenceController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getCompetences) 
    .post(authorize('Admin'), createCompetence); 

router.route('/:id')
    .get(getCompetence) 
    .put(authorize('Admin'), updateCompetence) 
    .delete(authorize('Admin'), deleteCompetence); 

module.exports = router;