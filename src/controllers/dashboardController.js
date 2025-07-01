const User = require('../models/User');
const Payment = require('../models/Payment');

// Get dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Get user with latest data
    const user = await User.findById(req.user.id);
    
    // Get payment history
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Calculate onboarding progress
    const stepsCompleted = Object.values(user.onboardingSteps).filter(Boolean).length;
    const totalSteps = Object.keys(user.onboardingSteps).length;
    const progress = Math.round((stepsCompleted / totalSteps) * 100);
    
    res.render('dashboard', {
      title: 'Writer Dashboard',
      user,
      payments,
      progress
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while loading dashboard');
    res.redirect('/');
  }
};

// Get writing assignments
exports.getWritingAssignments = async (req, res) => {
  try {
    // Check if payment is completed
    if (req.user.paymentStatus !== 'completed') {
      req.flash('error_msg', 'Please complete payment to access writing assignments');
      return res.redirect('/dashboard');
    }
    
    // Mock assignments data (in a real app, this would come from a database)
    const assignments = [
      {
        id: 1,
        title: 'Blog Post: 10 Tips for Effective Writing',
        description: 'Write a 1000-word blog post about effective writing techniques.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'available'
      },
      {
        id: 2,
        title: 'Product Description: Smart Home Device',
        description: 'Write a compelling 500-word product description for a new smart home device.',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'available'
      },
      {
        id: 3,
        title: 'Email Newsletter: Summer Sale',
        description: 'Create an engaging email newsletter for a summer sale campaign.',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'available'
      }
    ];
    
    res.render('assignments', {
      title: 'Writing Assignments',
      assignments
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while loading assignments');
    res.redirect('/dashboard');
  }
};

// Get training materials
exports.getTrainingMaterials = async (req, res) => {
  try {
    res.render('training', {
      title: 'Training Materials'
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while loading training materials');
    res.redirect('/dashboard');
  }
};

// Complete training
exports.completeTraining = async (req, res) => {
  try {
    // Update user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/dashboard');
    }
    
    user.onboardingSteps.trainingCompleted = true;
    
    await user.save();
    
    req.flash('success_msg', 'Training completed successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while completing training');
    res.redirect('/dashboard');
  }
};
