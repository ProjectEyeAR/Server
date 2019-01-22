module.exports = ({
  app,
  init
}) => {
  const Store = require('express-session').Store;
  const MongooseStore = require('mongoose-express-session-beta')(Store);
  const mongoose = require('mongoose');

  const thirtyDaysToMillis = 30 * 86400 * 1000
  const thirtyDaysToSecs = 2592000
  const expiry = new Date(Date.now() + thirtyDaysToMillis)

  app.use(require('express-session')({
    secret: init.SESSION_SECRET_KEY,
    resave: false,
    rolling: false,
    store: new MongooseStore({
      connection: init.mongoUrl,
      mongoose,
      sessionLifespan: thirtyDaysToSecs,
      modelName: 'Session'
    }),
    cookie: {
      maxAge: expiry,
      httpOnly: true
    }
  }));
}