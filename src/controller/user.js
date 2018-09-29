module.exports = ({
	init,
	db,
	logger
}) => {
	const {
		checkLoggedIn
	} = require('../middleware/authenticate')
	const User = require('../model/user')
	const api = require('express').Router()
	const hasher = require('pbkdf2-password')()
	const {
		checkRegisterUser,
		checkIdParams,
		checkDuplicatedEmailAndDisplayName,
		checkProfile
	} = require('../middleware/typeCheck')({
		logger,
		User,
		init
	})

	//@desc : 로컬 회원가입
	//@router: DELETE http://localhost:3001/api/users
	//@body : email: String, password: String, displayName: String, img: Object
	api.post('/', [checkRegisterUser, checkDuplicatedEmailAndDisplayName], async (req, res) => {
		let email = req.body.email
		let password = req.body.password
		let displayName = req.body.displayName
		let img = req.file

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
				type: 'local',
				email: email,
				password: hash,
				profile: img.location,
				salt: salt,
				displayName: displayName,
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

	//@desc : 자신의 유저 정보 가져오기
	//@router : GET http://localhost:3001/api/users/me
	api.get('/me', checkLoggedIn, (req, res) => {
		let userId = req.query.userId

		try {
			let followingQuery = {user: userId}
			let followingCount = await Following.count(followingQuery)

			let followerQuery = {followUser: userId}
			let followerCount = await Following.count(followQuery)

			user.followingCount = followingCount 
			user.followerCount = followerCount

			return res.status(200).json({
				data: user
			})

		} catch (err) {
			logger.error(err.message)
			return res.status(500).json({
				message: err.message
			})
		}

		res.status(401).json({
			data: req.user
		})
	})

	//@desc : 특정 유저 정보 가져오기
	//@router : GET http://localhost:3001/api/users/:id
	//@params : id: String
	api.get('/:id', checkIdParams, async (req, res) => {
		let id = req.params.id

		try {
			let user = await User.find({})
				.where('_id')
				.equals(id)

			let followingQuery = {user: id}
			let followingCount = await Following.count(followingQuery)

			let followerQuery = {followUser: id}
			let followerCount = await Following.count(followQuery)

			user.followingCount = followingCount 
			user.followerCount = followerCount

			if (req.isAuthenticated()) {
				let userId = req.query.userId
				let query = {user: userId, followUser: id}
				let count = await Following.count(query)
				user.following = count > 0
			}

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

	//@desc : 자신의 로컬 계정을 수정
	//@router : PUT http://localhost:3001/api/users
	//@body : email: String, password: String, displayName: String, img: Object
	api.put('/', [checkLoggedIn, checkRegisterUser, checkDuplicatedEmailAndDisplayName], (req, res) => {
		let myUserId = req.user._id
		let img = req.file
		let email = req.body.email
		let password = req.body.password
		let displayName = req.body.displayName

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
				_id: myUserId
			}
			let update = {
				$set: {
					email: email,
					password: hash,
					salt: salt,
					displayName: displayName,
					profile: img.location
				}
			}
			let option = {
				new: true,
				upsert: false
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

	//@desc : 자신의 프로필 사진을 수정
	//@router : PUT http://localhost:3001/api/users/profile
	//@body : img: Object
	api.put('/profile', [checkLoggedIn, checkProfile], async (req, res) => {
		let myUserId = req.user._id
		let img = req.file

		let filter = {
			_id: myUserId
		}
		let update = {
			$set: {
				profile: img.location
			}
		}
		let option = {
			new: true,
			upsert: false 
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