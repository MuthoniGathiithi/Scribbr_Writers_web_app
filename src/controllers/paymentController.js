const User = require('../models/User');
const Payment = require('../models/Payment');

// Get payment page
exports.getPaymentPage = async (req, res) => {
  try {
    // Get payment history
    const payments = await Payment.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.render('payment', {
      title: 'Make Payment',
      user: req.user,
      payments,
      mpesaTillNumber: '123456' // This would be your actual M-Pesa till number
    });
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while loading payment page');
    res.redirect('/dashboard');
  }
};

// Submit payment transaction code
exports.submitPayment = async (req, res) => {
  try {
    const { transactionCode } = req.body;
    
    // Check if transaction code already exists
    const existingPayment = await Payment.findOne({ transactionCode });
    
    if (existingPayment) {
      req.flash('error_msg', 'Transaction code has already been used');
      return res.redirect('/payments');
    }
    
    // Create new payment record
    const newPayment = new Payment({
      user: req.user.id,
      transactionCode,
      amount: 1000, // This would be your actual payment amount
      status: 'pending'
    });
    
    await newPayment.save();
    
    // Update user payment status
    const user = await User.findById(req.user.id);
    user.transactionCode = transactionCode;
    user.onboardingSteps.paymentSubmitted = true;
    
    await user.save();
    
    req.flash('success_msg', 'Payment submitted successfully. It will be verified shortly.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while submitting payment');
    res.redirect('/payments');
  }
};

// Mock function to verify payment (in a real app, this would be an API call to M-Pesa)
exports.verifyPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    // Get payment
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      req.flash('error_msg', 'Payment not found');
      return res.redirect('/dashboard');
    }
    
    // Update payment status
    payment.status = 'verified';
    payment.verifiedAt = Date.now();
    
    await payment.save();
    
    // Update user payment status
    const user = await User.findById(payment.user);
    user.paymentStatus = 'completed';
    
    await user.save();
    
    req.flash('success_msg', 'Payment verified successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while verifying payment');
    res.redirect('/dashboard');
  }
};

// For demonstration purposes - simulate payment verification
// In a real app, this would be handled by a webhook from M-Pesa
exports.simulateVerification = async (req, res) => {
  try {
    const { transactionCode } = req.body;
    
    // Find payment by transaction code
    const payment = await Payment.findOne({ transactionCode });
    
    if (!payment) {
      req.flash('error_msg', 'Payment not found');
      return res.redirect('/dashboard');
    }
    
    // Update payment status
    payment.status = 'verified';
    payment.verifiedAt = Date.now();
    
    await payment.save();
    
    // Update user payment status
    const user = await User.findById(payment.user);
    user.paymentStatus = 'completed';
    
    await user.save();
    
    req.flash('success_msg', 'Payment verified successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An error occurred while verifying payment');
    res.redirect('/dashboard');
  }
};
