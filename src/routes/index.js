const express = require('express')
const init = require('../config')
const account = require('../controller/account')
const initializeDB = require('../db_connection')

const router = express()

initializeDB(db => {
  router.use('/account', account({ init, db }))
})


module.exports = router
