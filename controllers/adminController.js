const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const db = require('../db'); // Ensure you have a proper DB module

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const admin = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
      if (admin.rows.length === 0) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const match = await bcrypt.compare(password, admin.rows[0].password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, admin.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await db.query('SELECT * FROM admins WHERE id = $1', [id]);
    done(null, admin.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

exports.login = (req, res) => {
  res.render('admin/login');
};

exports.loginSubmit = passport.authenticate('local', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin',
  failureFlash: true
});

exports.dashboard = (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect('/admin');
  }
  res.render('admin/dashboard');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/admin');
};

exports.viewSubmissions = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect('/admin');
  }
  try {
    const submissions = await db.query('SELECT * FROM form_submissions');
    // Decrypt the submissions here...
    res.render('admin/submissions', { submissions: submissions.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.exportToExcel = async (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect('/admin');
  }
  // Implement export to Excel functionality here...
};

module.exports = exports;
