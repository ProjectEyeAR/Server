module.exports = ({init, db}) => {
  const User = require('../model/user')
  //@passport
  const passport = require('passport')
  const LocalStrategy = require('passport-local').Strategy;
  const api = require('express').Router()
  //@pwd
  const bkfd2Password = require("pbkdf2-password");
  const hasher = bkfd2Password();
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')

  api.post('/register', (req, res) => {
    let newUser

    return hasher({password:req.body.password}, function(err, pass, salt, hash) {
      if (err) return res.status(500).json({ message: err, success: falst })

      newUser = new User({
        authId: 'local:' + req.body.email,
        email: req.body.email,
        password: hash,
        salt: salt,
        displayName: req.body.displayName
      })

      newUser.save((err, newUser) => {
        if (err)
          return res.status(500).json({ message: err, success: false })
        else
          return res.status(200).json({ message: newUser, success: true })
      })
    })
  })

  //login 실패시
  api.get('/login', (req, res) => {
    if (req.flash) return res.status(400).json({ message: req.flash('error')[0], success: false })
  })

  api.post('/login', passport.authenticate('local', {
    session: true,
    failureRedirect: '/api/auth/login',
    failureFlash: true
  }), (req, res) => {
    res.status(200).json({ message: req.user, success: true })
  })

//TODO 로그아웃중복처리
  api.get('/logout', (req, res) => {
    req.logout()
    res.status(200).json({ message: "성공적으로 로그아웃함", success: true })
  })

  api.get('/me', checkLoggedIn, (req, res) => {
    res.status(401).json({ message: req.user, success: true })
  })

  return api
}
