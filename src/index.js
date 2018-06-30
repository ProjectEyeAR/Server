const express = require('express')
const init = require('./config')
const http = require('http')
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('config')
const debug = require('debug')('app:startup')
const routes = require('./routes')
var bodyParser = require('body-parser')
const User = require('./model/user')
require('express-async-errors')
//@session
const Store = require('express-session').Store;
const MongooseStore = require('mongoose-express-session')(Store);
const mongoose = require('mongoose');
//@passport
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

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
//@session
app.use(require('express-session')({
    secret: 'keyboard cat', //TODO: 키 감출것
    resave: false,
    rolling: false,
    saveUninitialized: true,
    store: new MongooseStore({ connection: init.mongoUrl, mongoose: mongoose })
}));
//@passport
app.use(passport.initialize())
app.use(passport.session())

//localhost:3000/api
app.use('/api', routes)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  {usernameField:"email", passwordField:"password"},
  function(username, password, done) {
    console.log(username, password)
    User.findOne({ authId: 'local:'+username }, function(err, user) {
      if (err) return done(err)
      if (!user) return done(null, false, { message: 'Incorrect username.', success: false });

      //password 맞는지 처리
      return done(null, user);
    });
  }
));

app.listen(init.port, () => {
console.log(`listening port: " ${init.port}...`)
})
