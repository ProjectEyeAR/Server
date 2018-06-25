const mongoose = reuqire('mongoose')

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
  geometry: {
    type: String,
    coordinates: [ Number ]
  }
})

module.exports = mongoose.model('Memo', memoSchema)
