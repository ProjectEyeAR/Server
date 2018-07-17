const mongoose = require('mongoose')
const MemoReview = require('./memo_review')
const Schema = mongoose.Schema

const memoSchema = new Schema({
  ar: { //TODO: 이미지서버 알아보기
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  geometry: { //TODO: 좌표처리부분 알아보기
    coordinates: {
      type: [Number]
    }
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'MemoReview'
  }]
})

module.exports = mongoose.model('Memo', memoSchema)
