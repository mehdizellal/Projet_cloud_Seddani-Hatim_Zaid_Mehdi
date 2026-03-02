const express = require('express');
const router = express.Router();
const { 
    createModule, 
    getModules, 
    getModule, 
    updateModule, 
    deleteModule 
} = require('../controllers/moduleController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // Ensure user is logged in for all routes below

router.route('/')
    .get(getModules) 
    .post(authorize('Admin'), createModule); 

router.route('/:id')
    .get(getModule) 
    .put(authorize('Admin'), updateModule) 
    .delete(authorize('Admin'), deleteModule); 

module.exports = router;