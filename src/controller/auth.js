module.exports = ({
  init,
  db,
  errorMessage
}) => {
  //@passport
  const passport = require('passport')
  require('passport-local').Strategy;
  const api = require('express').Router()
  const {
    checkLoggedIn
  } = require('../middleware/authenticate')

  //@desc : login 실패시 failureRedircet에 의해 작동되는 라우터
  api.get('/session/fail', (req, res) => {
    if (req.flash)
      return res.status(400).json({
        message: req.flash('error')[0]
      })
  })

  //@desc : 로컬 로그인
  //@router : POST http://localhost:3001/api/auth/session
  //@body : email: String, password: String
  api.post('/session', passport.authenticate('local', {
    session: true,
    failureRedirect: '/api/auth/session/fail',
    failureFlash: true
  }), (req, res) => {
    res.status(200).json({
      data: req.user
    })
  })

  //@desc : 로컬 & 페이스북 로그아웃
  //@router : GET http://localhost:3001/api/auth/session
  api.get('/session', (req, res) => {
    req.logout()
    res.status(200).json({})
  })

  //@desc : 페이스북 로그인
  api.get('/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }))

  //@desc : 페이스북 로그인 실패, 성공시 거쳐가는 콜백 
  api.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/api/users/me',
    failureRedirect: '/api/auth/facebook/fail'
  }))

  //@desc : 페이스북 로그인 실패
  api.get('/facebook/fail', (req, res) => {
    return res.status(500).json({
      message: errorMessage.FACEBOOK_LOGIN_FAIL
    })
  })

  return api
}