module.exports = ({app, init}) => {
  const Store = require('express-session').Store;
  const MongooseStore = require('mongoose-express-session')(Store);
  const mongoose = require('mongoose');

  app.use(require('express-session')({
      secret: init.SESSION_SECRET_KEY,
      resave: false,
      rolling: false,
      saveUninitialized: true,
      store: new MongooseStore({ connection: init.mongoUrl, mongoose: mongoose }),
      cookie:{ maxAge:3000000000,  httpOnly: true } //약 30일 
  }));
}
