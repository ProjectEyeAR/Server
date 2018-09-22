module.exports = ({
    logger,
    User,
    init
}) => {
    const upload = require('../services/file-upload')({
        init
    })
    const single = upload.single('img')

    const errorMessage = require('../error_message')
    const check = require('check-types')

    const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
    const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const DISPLAY_NAME_REGEX = /^[^\s\t\n\r\`\~\!\@\#\$\%\^\&\*\(\)\+\=\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\?]+$/

    const checkEmoji = function (req, res, next) {
        let emoji = req.body.emoji
        let memoId = req.body.memoId

        if (check.not.string(memoId)) {
            return res.status(404).json({
                message: errorMessage.INVALID_POST_REQUEST + ' (memoId)'
            })
        }

        if (check.not.string(emoji)) {
            return res.status(404).json({
                message: errorMessage.INVALID_POST_REQUEST + ' (emoji)'
            })
        }
        return next()
    }

    const checkRegisterUser = function (req, res, next) {
        single(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
                })
            }

            let img = req.file
            let email = req.body.email
            let password = req.body.password
            let displayName = req.body.displayName

            if (check.not.object(img)) {
                return res.status(400).json({
                    message: errorMessage.INVALID_POST_REQUEST + ' (img)'
                })
            }

            if (check.not.string(email) || !EMAIL_REGEX.test(email)) {
                return res.status(400).json({
                    message: errorMessage.INVALID_POST_REQUEST + ' (email)'
                })
            }

            if (check.not.string(password) || !PASSWORD_REGEX.test(password)) {
                return res.status(400).json({
                    message: errorMessage.INVALID_POST_REQUEST + ' (password)'
                })
            }

            if (check.not.string(displayName) || !DISPLAY_NAME_REGEX.test(displayName)) {
                return res.status(400).json({
                    message: errorMessage.INVALID_POST_REQUEST + ' (displayName)'
                })
            }

            return next()
        })
    }

    const checkIdParams = function (req, res, next) {
        let id = req.params.id

        if (check.not.string(id)) {
            return res.status(400).json({
                message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
            })
        }

        return next()
    }

    const checkEmailAndDisplayName = async function (req, res, next) {
        let email = req.body.email
        let displayName = req.body.displayName

        try {
            //이미 가입한 이메일 있는지 확인
            const emailQuery = {
                'email': email
            }
            let emailCount = await User.count(emailQuery)

            if (emailCount > 0) {
                return res.status(409).json({
                    message: errorMessage.CONFLICT_PARAMETER + ' (email)'
                })
            }

            //이미 가입한 displayName있는지 확인
            const displayNameQuery = {
                'displayName': displayName
            }
            let displayNameCount = await User.count(displayNameQuery)

            if (displayNameCount > 0) {
                return res.status(409).json({
                    message: errorMessage.CONFLICT_PARAMETER + ' (displayName)'
                })
            }

            return next()
        } catch (err) {
            logger.error(err.message)
            res.status(500).json({
                message: err.message
            })
        }
    }

    const checkProfile = function (req, res, next) {
        single(req, res, function (err) {
            if (err) {
                return res.status(400).json({
                    message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
                })
            }

            let img = req.file

            if (check.not.object(img)) {
                return res.status(400).json({
                    message: errorMessage.INVALID_POST_REQUEST + ' (img)'
                })
            }

            return next()
        })
    }

    return {
        checkEmoji,
        checkRegisterUser,
        checkIdParams,
        checkEmailAndDisplayName,
        checkProfile
    }
}