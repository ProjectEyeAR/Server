const express = require('express')
const init = require('./config')
const http = require('http')
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const debug = require('debug')('app:startup')
const mongoose = require('mongoose')
const routes = require('./routes')
var bodyParser = require('body-parser')
require('express-async-errors')
//@passport
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

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
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//localhost:3000/api
app.use('/api', routes)

//@passport
app.use(passport.initialize());
let Account = require('./routes/model/account')

passport.use(new FacebookStrategy({
  clientID: '184175998929190',
  clientSecret: '63c4db76ea6d23097b0bc2b6bed4f668',
  callbackURL: "http://localhost:3001/auth/facebook/callback"
}, function(accessToken, refreshToken, profile, done) {
  Account.find({
    authId: 'facebook:' + profile.id
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user.length != 0) {
      return done(null, user);
    }
    let newAccount = new Account({
      authId: 'facebook:' + profile.id,
      displayName: profile.displayName
    })
    newAccount.save(function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user)
    })
  })
}))

passport.serializeUser(function(user, done) {
console.log("test")
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
Account.find({
  authId: 'facebook:' + profile.id
}, function(err, user) {
  if (err) {
    return done(err);
  }
  if (user) {
    return done(null, user);
  }
})
})

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false}), (req, res) => {
  res.status(200).send("페이스북 데이터 디비에 저장됨")
});

app.listen(init.port, () => {
console.log(`listening port: " ${init.port}...`)
})
