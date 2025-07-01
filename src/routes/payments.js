const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { ensureAuthenticated } = require('../config/auth');
const { paymentValidationRules, validate } = require('../utils/validators');

// Payment page - GET
router.get('/', ensureAuthenticated, paymentController.getPaymentPage);

// Submit payment - POST
router.post('/submit', ensureAuthenticated, paymentValidationRules(), validate, paymentController.submitPayment);

// Verify payment - GET (for admin use)
router.get('/verify/:id', ensureAuthenticated, paymentController.verifyPayment);

// Simulate payment verification - POST (for demonstration purposes)
router.post('/simulate-verification', ensureAuthenticated, paymentController.simulateVerification);

module.exports = router;
