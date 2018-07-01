const mongoose = require('mongoose')

const memoSchema = new mongoose.Schema({
  img: {
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  coordinates: {
    type: [Number]
  }
})

module.exports = mongoose.model('Memo', memoSchema)