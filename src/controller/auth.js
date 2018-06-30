const mongoose = require('mongoose')
const express = require('express')
const Account = require('../routes/model/account')
const bodyParser = require('body-parser')
const init = require('../config')
//@passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const { generateAccessToken, respond, authenticate } = require('../middleware/auth')

module.exports = ({ init, db }) => {
  const api = express()
  api.post('/register', (req, res) => {
    Account.register(new Account({ username: req.body.email }), req.body.password, function(err, acount) {
      if (err) {
        res.send(err)
      }
      passport.authenticate(
        'local', {
          session: false
        })(req, res, () => {
          res.status(200).json({ message: 'Successfully created new account' })
        })
    })
  })

  api.post('/login', passport.authenticate('local', {
    session: false,
    scope: []
  }), generateAccessToken, respond)

  api.get('/logout', authenticate, (req, res) => {
    res.logout()
    res.status(200).json({ message: 'Successfully created new account' })
  })

  api.get('/me', authenticate, (req, res) => {
    res.status(200).json({ 'user': req.user })
  })

  return api
}
