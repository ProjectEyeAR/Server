const mongoose = require('mongoose')

//TODO: validate 처리
const userSchema = new mongoose.Schema({
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
  photo: { //Or can change to value(The URL of the image)

  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
