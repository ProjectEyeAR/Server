const mongoose = require('mongoose')
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
  profile: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  phoneNumber: {
    type: String
  }
})

module.exports = mongoose.model('User', userSchema)
