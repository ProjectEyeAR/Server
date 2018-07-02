const mongoose = require('mongoose')
const Memo = require('./memo')
// const MemoReview = require('./memo_review')
const Schema = mongoose.Schema

//TODO: validate 처리
const userSchema = new Schema({
  displayName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  authId: {
    type: String
  },
  salt: {
    type: String
  },
  photo: { //Or It can change to value(The URL of the image)
    type: String
  },
  // memos: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Memo'
  // },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
