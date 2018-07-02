const mongoose = require('mongoose')
const Memo = require('./memo')
const User = require('./user')
const Schema = mongoose.Schema

const memoReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String
  },
  memo: {
    type: Schema.Types.ObjectId,
    ref: 'Memo'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Memo_Reivew', memoReviewSchema)
