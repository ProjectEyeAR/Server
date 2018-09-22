module.exports = ({
  init,
  db
}) => {
  //@passport
  const passport = require('passport')
  require('passport-local').Strategy;
  const api = require('express').Router()
  const {
    checkLoggedIn
  } = require('../middleware/authenticate')

  //POST login 실패시 failureRedircet에 의해 작동되는 라우터
  api.get('/session/fail', (req, res) => {
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
    failureRedirect: '/api/auth/session/fail',
    failureFlash: true
  }), (req, res) => {
    res.status(200).json({
      data: req.user
    })
  })

  api.get('/session', (req, res) => {
    req.logout()
    res.status(200).json({})
  })

  //@facebook router
  api.get('/facebook', passport.authenticate('facebook'))

  api.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/api/auth/facebook/',
    failureRedirect: '/api/auth/facebook/fail',
    failureFlash: true
  }))


  api.get('/facebook/fail', (req, res) => {
    if (req.flash)
      return res.status(400).json({
        message: req.flash('error')[0]
      })
  })

  return api
}