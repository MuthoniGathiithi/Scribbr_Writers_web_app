const { body, validationResult } = require('express-validator');

// User registration validation rules
const registerValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 10 })
      .withMessage('Password must be at least 10 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('password2')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ];
};

// Login validation rules
const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
  ];
};

// Payment transaction code validation rules
const paymentValidationRules = () => {
  return [
    body('transactionCode')
      .trim()
      .notEmpty()
      .withMessage('Transaction code is required')
      .isLength({ min: 8, max: 15 })
      .withMessage('Transaction code must be between 8 and 15 characters')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Transaction code must contain only uppercase letters and numbers')
  ];
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  
  req.flash('error_msg', errors.array()[0].msg);
  return res.redirect('back');
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  paymentValidationRules,
  validate
};
