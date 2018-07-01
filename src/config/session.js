module.exports = ({app, init}) => {
  const Store = require('express-session').Store;
  const MongooseStore = require('mongoose-express-session')(Store);
  const mongoose = require('mongoose');
  
  app.use(require('express-session')({
      secret: 'keyboard cat', //TODO: 키 감출것
      resave: false,
      rolling: false,
      saveUninitialized: true,
      store: new MongooseStore({ connection: init.mongoUrl, mongoose: mongoose })
  }));
}
