const init = require('./config')
//@express
const express = require('express')
const app = express()
const router = express.Router()
const routes = require('./routes')({router, init})
const bodyParser = require('body-parser')
//@development
const dev = require('./config/development')(app)
//@production
const prod = require('./config/production')(app)
//require('express-async-errors')
//@session
const session = require('./config/session')({app, init})
//@passport
const passport = require('./config/passport')({app, init})
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
//@security
const helmet = require('helmet')
app.use(helmet())

app.use(cookieParser());
app.use(flash());
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
