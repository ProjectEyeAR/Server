const mongoose = require('mongoose')
const MemoReview = require('./memo_review')
const Schema = mongoose.Schema

const memoSchema = new Schema({
  ar: {
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  geometry: {
    coordinates: {
      type: [Number]
    }
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'MemoReview'
  }],
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Memo', memoSchema)
