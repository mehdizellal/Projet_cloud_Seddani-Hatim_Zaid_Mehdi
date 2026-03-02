const express = require('express');
const router = express.Router();
const { 
    createFiliere, 
    getFilieres, 
    getFiliere, 
    updateFiliere, 
    deleteFiliere 
} = require('../controllers/filiereController');

const { protect, authorize } = require('../middlewares/authMiddleware');

// Force ALL routes in this file to require a logged-in user
router.use(protect); 

// Routes for /api/filieres
router.route('/')
    .get(getFilieres) // Anyone logged in can read
    .post(authorize('Admin'), createFiliere); // Only Admin can create

// Routes for /api/filieres/:id
router.route('/:id')
    .get(getFiliere) // Anyone logged in can read specific ID
    .put(authorize('Admin'), updateFiliere) // Only Admin can update
    .delete(authorize('Admin'), deleteFiliere); // Only Admin can delete

module.exports = router;