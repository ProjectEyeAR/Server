module.exports = ({init, db}) => {
  const User = require('../model/user')
  //@passport
  const passport = require('passport')
  const LocalStrategy = require('passport-local').Strategy;
  const api = require('express').Router()
  //@security
  const bkfd2Password = require('pbkdf2-password');
  const hasher = bkfd2Password();
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')

  //POST login 실패시 failureRedircet에 의해 작동되는 라우터
  api.get('/session', (req, res) => {
    if (req.flash)
      return res.status(400).json({
        message: req.flash('error')[0]
      })
  })

  /*
  passport에 의해서 작동됨 
    usernameField: "email",
    passwordField: "password",
  */
  api.post('/session', passport.authenticate('local', {
    session: true,
    failureRedirect: '/api/auth/session',
    failureFlash: true
  }), (req, res) => {
    res.status(200).json({data: req.user})
  })

  api.get('/session', (req, res) => {
    req.logout()
    res.status(200).json({})
  })

  api.get('/me', checkLoggedIn, (req, res) => {
    res.status(401).json({data: req.user})
  })

  //@facebook router
  api.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

  api.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login', successRedirect: '/me'}));

  return api
}
