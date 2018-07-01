module.exports = ({init, db}) => {
  const User = require('../model/user')
  //@passport
  const passport = require('passport')
  const LocalStrategy = require('passport-local').Strategy;
  const api = require('express').Router()

  api.post('/register', (req, res) => {
    //TODO: 비밀번호 암호화
    let newUser = new User({
      authId: 'local:' + req.body.email,
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName
    })
    console.log(newUser)
    newUser.save((err, newUser) => {
      if (err)
        return res.status(500).json({ message: err, seccess: false })
      else
        return res.status(200).json({ message: newUser, success: true })
    })
  })

  api.post('/login', passport.authenticate('local', {
    session: true,
    failureFlash: false,
    scope: []
  }), (req, res) => {
    //TODO: 로그인 실패시 에러처리
    res.status(200).json({ message: req.user, success: true })
  })

  api.get('/logout', (req, res) => {
    req.logout()
    res.status(200).json({ message: "성공적으로 로그아웃함", success: true })
  })

  api.get('/me', (req, res) => {
    console.log(req.user)
    if (!req.user)
      return res.status(401).json({ message: '허용되지 않은 접근: 로그인이 되었는지 확인', success: false })
    res.status(401).json({ message: req.user, success: true })
  })

  return api
}
