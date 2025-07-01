const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Match user
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Update last login time
        user.lastLogin = Date.now();
        await user.save();
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
