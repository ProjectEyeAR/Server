const mongoose = require('mongoose')
// const passportLocalMongoose = require('passport-local-mongoose')

const accountSchema = new mongoose.Schema({
  displayName: {
    type: String
  },
  authId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Account = mongoose.model('Account', accountSchema)


// accountSchema.plugin(passportLocalMongoose)

module.exports = Account
