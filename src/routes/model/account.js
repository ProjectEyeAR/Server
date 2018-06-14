const mongoose = require('mongoose')

let accountSchema = new mongoose.Schema({
  id: String,
  passward: String,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Account', accountSchema)
