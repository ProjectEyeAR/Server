const init = require('./config')
//@express
const express = require('express')
const app = express()
const router = express.Router()
const routes = require('./routes')({router, init})
var bodyParser = require('body-parser')
//@development
const dev = require('./config/development')
//@security
const helmet = require('helmet')
require('express-async-errors')
//@session
const session = require('./config/session')({app, init})
//@passport
const passport = require('./config/passport')(app)

app.disable('x-powered-by')
app.use(helmet())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//localhost:3001/api
app.use('/api', routes)

app.listen(init.port, () => {
console.log(`listening port: " ${init.port}...`)
})
