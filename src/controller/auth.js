module.exports = ({init, db}) => {
  const User = require('../model/user')
  //@passport
  const passport = require('passport')
  const LocalStrategy = require('passport-local').Strategy;
  const api = require('express').Router()
  //@security
  const bkfd2Password = require("pbkdf2-password");
  const hasher = bkfd2Password();
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')

  //TODO: profile구현

  api.post('/register', (req, res) => {
    let newUser

    return hasher({
      password: req.body.password
    }, function(err, pass, salt, hash) {
      if (err)
        return res.status(500).json({message: err, success: falst})

      //이메일, 비밀번호, 보여줄 이름, 전화번호 필요
      newUser = new User({
        authId: 'local:' + req.body.email,
        email: req.body.email,
        password: hash,
        salt: salt,
        displayName: req.body.displayName,
        phoneNumber: req.body.phoneNumber
      })

      newUser.save((err, newUser) => {
        if (err)
          return res.status(500).json({message: err, success: false})
        else
          return res.status(200).json({message: newUser, success: true})
      })
    })
  })

  //POST login 실패시 failureRedircet에 의해 작동되는 라우터
  api.get('/login', (req, res) => {
    if (req.flash)
      return res.status(400).json({
        message: req.flash('error')[0],
        success: false
      })
  })

  /*
  passport에 의해서 작동됨 
    usernameField: "email",
    passwordField: "password",
  */
  api.post('/login', passport.authenticate('local', {
    session: true,
    failureRedirect: '/api/auth/login',
    failureFlash: true
  }), (req, res) => {
    res.status(200).json({message: req.user, success: true})
  })

  api.get('/logout', (req, res) => {
    req.logout()
    res.status(200).json({message: "Successfully logged out", success: true})
  })

  api.get('/me', checkLoggedIn, (req, res) => {
    res.status(401).json({message: req.user, success: true})
  })

  //@facebook router
  api.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

  api.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login', successRedirect: '/me'}));

  return api
}
