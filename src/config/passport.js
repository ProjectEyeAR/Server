module.exports = (app) => {
  const passport = require('passport')
  const FacebookStrategy = require('passport-facebook').Strategy;
  const LocalStrategy = require('passport-local').Strategy;
  const User = require('../model/user')

  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  passport.use(new LocalStrategy(
    {usernameField:"email", passwordField:"password"},
    function(username, password, done) {
      console.log(username, password)
      User.findOne({ authId: 'local:'+username }, function(err, user) {
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'Incorrect username.', success: false });

        //password 맞는지 처리
        return done(null, user);
      });
    }
  ));
}
