const express = require('express')
const init = require('./config')
const http = require('http')
const logger = require('./middleware/logger')
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const debug = require('debug')('app:startup')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

console.log('Applicatoin Name:' + config.get('name'))
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`)

if (app.get('env') === 'development') {
  app.use(morgan('tiny'))
  debug('Morgan enabled...')
}

app.use(helmet())
app.disable('x-powered-by')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
//localhost:3000/api
app.use('/api', routes)

app.listen(init.port, () => {
  console.log(`listening port: " ${init.port}...`)
})
