const mongoose = require('mongoose')
const Schema = mongoose.Schema

const geoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
  }
});

const memoSchema = new Schema({
  imgId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Uploads.Files"
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    set: item => {
      if(Array.isArray(item)) {
        return item.join('')
      }
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  loc: geoSchema
});

memoSchema.index({
  loc: '2dsphere'
});

module.exports = mongoose.model('Memo', memoSchema)