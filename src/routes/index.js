const express = require('express')
const init = require('../config')
const account = require('../controller/account')
const initializeDB = require('../db_connection')
const memo = require('../controller/memo')
const router = express()

// http://localhost:3001/api/memo
initializeDB(db => {
  router.use('/account', account({ init, db }))
  router.use('/memo', memo({ init, db }))
})


module.exports = router
