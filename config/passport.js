// config/passport.js

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport, db) {
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
};
