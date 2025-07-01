const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { registerValidationRules, loginValidationRules, validate } = require('../utils/validators');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../config/auth');

// Register page - GET
router.get('/register', ensureNotAuthenticated, (req, res) => {
  res.render('register', {
    title: 'Register'
  });
});

// Register - POST
router.post('/register', ensureNotAuthenticated, registerValidationRules(), validate, userController.registerUser);

// Login page - GET
router.get('/login', ensureNotAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

// Login - POST
router.post('/login', ensureNotAuthenticated, loginValidationRules(), validate, userController.loginUser);

// Logout - GET
router.get('/logout', userController.logoutUser);

// Profile page - GET
router.get('/profile', ensureAuthenticated, userController.getUserProfile);

// Profile update - POST
router.post('/profile', ensureAuthenticated, userController.updateUserProfile);

module.exports = router;
