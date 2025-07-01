module.exports = {
  // Ensure user is authenticated
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to access this page');
    res.redirect('/users/login');
  },
  
  // Ensure user is not authenticated (for login/register pages)
  ensureNotAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  
  // Ensure user has completed payment
  ensurePaymentCompleted: function(req, res, next) {
    if (req.isAuthenticated() && req.user.paymentStatus === 'completed') {
      return next();
    }
    req.flash('error_msg', 'Please complete payment to access this page');
    res.redirect('/dashboard');
  }
};
