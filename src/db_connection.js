const mongoose = require('mongoose')
const init = require('./config')

module.exports = callback => {
  let db =  mongoose.connect(init.mongoUrl)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(('Could not connect to MongoDB...'), err))

  callback(db)
}
