const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated, ensurePaymentCompleted } = require('../config/auth');

// Dashboard page - GET
router.get('/', ensureAuthenticated, dashboardController.getDashboard);

// Writing assignments - GET
router.get('/assignments', ensureAuthenticated, ensurePaymentCompleted, dashboardController.getWritingAssignments);

// Training materials - GET
router.get('/training', ensureAuthenticated, dashboardController.getTrainingMaterials);

// Complete training - POST
router.post('/training/complete', ensureAuthenticated, dashboardController.completeTraining);

module.exports = router;
