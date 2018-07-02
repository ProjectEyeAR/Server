module.exports = (callback) => {
  const mongoose = require('mongoose')
  const init = require('./')

  let db =  mongoose.connect(init.mongoUrl)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(('Could not connect to MongoDB...\n'), err))

  return callback(db)
}
