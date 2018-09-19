module.exports = ({
	init,
	db,
	logger,
	check
}) => {
	const {
		checkLoggedIn
	} = require('../middleware/authenticate')
	const upload = require('../services/file-upload')({
		init
	});
	const single = upload.single('img')
	const errorMessage = require('../error_message')
	const User = require('../model/user')
	const api = require('express').Router()
	const hasher = require('pbkdf2-password')()
	const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{4,6}$/im
	/* The following REGEX will validate any of these formats:
	/* (123) 456-7890
	/* 123-456-7890
	/* 123.456.7890
	/* 1234567890
	/* 123-4567-7890 ...
	*/

	//@desc : 로컬 회원가입
	//@router: DELETE http://localhost:3001/api/users
	//@body : 
	/*
	/*email: String, 
	/*password: String, 
	/*displayName: String, 
	/*phoneNumber: String, 
	/*img: Object
	*/
	api.post('/', (req, res) => {
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
			let phoneNumber = req.body.phoneNumber

			if (check.not.object(img)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (file)'
				})
			}

			if (check.not.string(email)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (email)'
				})
			}

			if (check.not.string(password)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (password)'
				})
			}

			if (check.not.string(displayName)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (displayName)'
				})
			}

			if (check.not.string(phoneNumber)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (phoneNumber)'
				})
			}

			phoneNumber = phoneNumber.match(phoneNumberRegex)
			if (check.not.array(phoneNumber)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (phoneNumber)'
				})
			}
			phoneNumber.join('')

			return hasher({
				password: password
			}, async function (err, pass, salt, hash) {
				if (err) {
					logger.error(err.message)
					return res.status(500).json({
						message: err.message
					})
				}

				let newUser = new User({
					authId: 'local:' + email,
					email: email,
					password: hash,
					salt: salt,
					displayName: displayName,
					phoneNumber: phoneNumber,
					profile: img.location
				})

				await newUser.save((err, newUser) => {
					if (err) {
						logger.error(err.message)
						return res.status(500).json({
							message: err.message
						})
					} else
						return res.status(201).json({
							data: newUser
						})
				})
			})
		})
	})

	//@desc : 자신의 유저 정보 가져오기
	//@router : GET http://localhost:3001/api/users/me
	api.get('/me', checkLoggedIn, (req, res) => {
		res.status(401).json({
		  data: req.user
		})
	  })

	//@desc : 특정 유저 정보 가져오기
	//@router : GET http://localhost:3001/api/users/:id
	//@params : id: String
	api.get('/:id', async (req, res) => {
		let id = req.params.id

		if (check.not.string(id)) {
			return res.status(400).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
			})
		}

		try {
			let user = await User.find({})
				.where('user')
				.equals(id)

			return res.status(200).json({
				data: user
			})

		} catch (err) {
			logger.error(err.message)
			return res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 자신의 계정을 삭제함
	//@router : DELETE http://localhost:3001/api/users
	api.delete('/', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id

		try {
			await User.where('_id')
				.equals(myUserId)
				.deleteOne()

			return res.status(200).json({})

		} catch (err) {
			logger.error(err.message)
			return res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 자신의 계정을 수정
	//@router : PUT http://localhost:3001/api/users
	//@body : 
	/*
	/*email: String, 
	/*password: String, 
	/*displayName: String, 
	/*phoneNumber: String, 
	/*img: Object
	*/
	api.put('/', checkLoggedIn, (req, res) => {
		single(req, res, function (err) {
			if (err) {
				return res.status(400).json({
					message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
				})
			}

			let myUserId = req.user._id
			let img = req.file
			let email = req.body.email
			let password = req.body.password
			let displayName = req.body.displayName
			let phoneNumber = req.body.phoneNumber

			if (check.not.object(img)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (file)'
				})
			}

			if (check.not.string(email)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (email)'
				})
			}

			if (check.not.string(password)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (password)'
				})
			}

			if (check.not.string(displayName)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (displayName)'
				})
			}

			if (check.not.string(phoneNumber)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (phoneNumber)'
				})
			}

			phoneNumber = phoneNumber.match(phoneNumberRegex)
			if (check.not.array(phoneNumber)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (phoneNumber)'
				})
			}
			phoneNumber.join('')

			return hasher({
				password: password
			}, async function (err, pass, salt, hash) {
				if (err) {
					logger.error(err.message)
					return res.status(500).json({
						message: err.message
					})
				}

				let filter = {
					user: myUserId
				}
				let update = {
					$set: {
						authId: 'local:' + email,
						email: email,
						password: hash,
						salt: salt,
						displayName: displayName,
						phoneNumber: phoneNumber,
						profile: img.location
					}
				}
				let option = {
					new: true,
					upsert: false //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
				}

				try {
					let user = await User.findOneAndUpdate(filter, update, option)
					return res.status(200).json({
						data: user
					})
				} catch (err) {
					logger.error(err.message)
					return res.status(500).json({
						message: err.message
					})
				}
			})
		})
	})

	//@desc : 자신의 프로필 사진을 수정
	//@router : PUT http://localhost:3001/api/users/profile
	//@body : img: Object
	api.put('/profile', checkLoggedIn, (req, res) => {
		single(req, res, async function (err) {
			if (err) {
				return res.status(400).json({
					message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
				})
			}

			let myUserId = req.user._id
			let img = req.file

			if (check.not.object(img)) {
				return res.status(400).json({
					message: errorMessage.INVALID_POST_REQUEST + ' (file)'
				})
			}

			let filter = {
				user: myUserId
			}
			let update = {
				$set: {
					authId: 'local:' + email,
					email: email,
					password: hash,
					salt: salt,
					displayName: displayName,
					phoneNumber: phoneNumber,
					profile: img.location
				}
			}
			let option = {
				new: true,
				upsert: false //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
			}

			try {
				let user = await User.findOneAndUpdate(filter, update, option)
				return res.status(200).json({
					data: user
				})
			} catch (err) {
				logger.error(err.message)
				return res.status(500).json({
					message: err.message
				})
			}
		})
	})

	//@desc : 자신의 프로필 사진 삭제
	//@router : DELETE http://localhost:3001/api/users/profile
	api.delete('/profile', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id

		let filter = {
			user: myUserId
		}
		let option = {
			projection: 'profile'
		}

		try {
			let user = await User.findOneAndDelete(filter, option)
			return res.status(200).json({
				data: user
			})
		} catch (err) {
			logger.error(err.message)
			return res.status(500).json({
				message: err.message
			})
		}
	})

	return api
}