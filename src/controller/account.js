const mongoose = require('mongoose')
const express = require('express')
const Account = require('../routes/model/account')
const bodyParser = require('body-parser')
const init = require('../config')


module.exports = ({ init, db }) => {
  let api = express()

  api.get('/register', (req, res) => {
    res.send("register")
  })

  return api
}
