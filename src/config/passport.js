module.exports = ({app, init}) => {
  const passport = require('passport');
  const FacebookStrategy = require('passport-facebook').Strategy;
  const LocalStrategy = require('passport-local').Strategy;
  const User = require('../model/user');
  const bkfd2Password = require("pbkdf2-password");
  const hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, function(req, username, password, done) {
    User.findOne({
      authId: 'local:' + username
    }, function(err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, req.flash('error', 'Incorrect username.'));
      console.log(user);
      return hasher({
        password: password,
        salt: user.salt
      }, function(err, pass, salt, hash) {
        if (hash === user.password) {
          console.log('접속한 유저 - ', `username: ${username} password: ${password}`);
          return done(null, user);
        }
        return done(null, false, req.flash('error', 'Incorrect password.'));
      })
    });
  }));

  passport.use(new FacebookStrategy({
    //TODO: 키 감추기!
    clientID: init.clientID,
    clientSecret: init.clientSecret,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: [
      'id',
      'email',
      'gender',
      'link',
      'locale',
      'name',
      'timezone',
      'updated_time',
      'verified',
      'displayName'
    ]
  }, function(accessToken, refreshToken, profile, done) {
    let authId = 'facebook:' + profile.id;

    //find user
    return done(null, user);
    //create user
    //return done(null, newuser);
  }));
}
