const User = require('../models/User');
const passport = require('passport');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/users/register');
    }
    
    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    
    await newUser.save();
    
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred during registration');
    res.redirect('/users/register');
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/users/profile');
    }

    const isMatch = await user.matchPassword(currentPassword || '');
    if (!isMatch) {
      req.flash('error_msg', 'Current password is incorrect');
      return res.redirect('/users/profile');
    }

    if (!newPassword || newPassword.length < 10) {
      req.flash('error_msg', 'New password must be at least 10 characters long');
      return res.redirect('/users/profile');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      req.flash('error_msg', 'New password must include uppercase, lowercase, number, and special character');
      return res.redirect('/users/profile');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/users/profile');
    }

    user.password = newPassword;
    await user.save();

    req.flash('success_msg', 'Password changed successfully');
    res.redirect('/users/profile');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while changing password');
    res.redirect('/users/profile');
  }
};

// Handle user login
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
};

// Handle user logout
exports.logoutUser = (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
};

// Get user profile
exports.getUserProfile = (req, res) => {
  res.render('profile', {
    title: 'Profile',
    user: req.user
  });
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Update user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/dashboard');
    }
    
    user.name = name;
    user.onboardingSteps.profileCompleted = true;
    
    await user.save();
    
    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while updating profile');
    res.redirect('/dashboard');
  }
};
