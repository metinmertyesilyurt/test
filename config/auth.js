// config/auth.js

// This middleware ensures that the user is logged in
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/admin/login');
  };
  
  // This middleware forwards the user to the dashboard if they are already logged in
  exports.forwardAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin/dashboard');      
  };
  