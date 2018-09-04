const mongoose = require('mongoose')
const Schema = mongoose.Schema

const geoSchema = new Schema({
  type: {
      type: String,
      default: 'Point'
  },
  coordinates: {
      type: [Number],
      index: '2dsphere'
  }
});

const memoSchema = new Schema({
  imgUrl: {
    type: String
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  tag: {
    type: [String]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Memo'
  },
  geometry: geoSchema
});

module.exports = mongoose.model('Memo', memoSchema)
