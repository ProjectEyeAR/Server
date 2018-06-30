const express = require('express')
const init = require('../config')
const auth = require('../controller/auth')
const initializeDB = require('../db_connection')
const memo = require('../controller/memo')
const router = express()

// http://localhost:3001/api/memo
initializeDB(db => {
  router.use('/memo', memo({ init, db }))
  router.use('/auth', auth({ init, db }))
})

module.exports = router
