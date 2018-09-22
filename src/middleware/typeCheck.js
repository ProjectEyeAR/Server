const errorMessage = require('../error_message')
const check = require('check-types')

const checkEmoji = function (req, res, next) {
    let emoji = req.body.emoji

    if (check.not.string(emoji)) {
        return res.status(404).json({
            message: errorMessage.INVALID_POST_REQUEST + ' (emoji)'
        })
    }
    return next()
}

module.exports = {
    checkEmoji
}