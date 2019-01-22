module.exports = ({
	init,
	logger,
}) => {
	const {
		checkLoggedIn
	} = require('../middleware/authenticate')
	const Following = require('../model/following')
	const api = require('express').Router()
	const {
		checkSkipAndLimit,
		checkUserId,
		checkFollowUserId
	} = require('../middleware/type_check')({
		logger,
		init
	})

	//@desc : 자신이 특정 아이디를 following 추가
	//@api: POST http://localhost:3001/api/followings/
	//@body: followUserId: String
	api.post('/', [checkLoggedIn, checkFollowUserId], async (req, res) => {
		let userId = req.user._id
		let followUserId = req.body.followUserId

		try {
			let following = await Following.create({
				user: userId,
				followUser: followUserId
			})

			res.status(201).json({
				data: following
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 자신이 특정 아이디를 following 삭제
	//@api: DELETE http://localhost:3001/api/followings/
	//@body: followUserId: String
	api.delete('/', [checkLoggedIn, checkFollowUserId], async (req, res) => {
		let userId = req.user._id
		let followUserId = req.body.followUserId

		try {
			const query = {
				user: userId,
				followUser: followUserId
			}
			await Following.findOneAndDelete(query)

			res.status(200).json({})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 해당 아이디가 following하고 있는 사람 숫자
	//@api: GET http://localhost:3001/api/followings/count
	//@query : userId
	api.get('/count', [checkUserId], async (req, res) => {
		let userId = req.query.userId

		try {
			const query = {
				user: userId
			}
			let count = await Following.count(query)

			res.status(200).json({
				data: count
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 해당 아이디가 following하고 있는 유저 정보 가져옴
	//@api: GET http://localhost:3001/api/followings/
	//@query : userId, skip?, limit?
	api.get('/', [checkSkipAndLimit, checkUserId], async (req, res) => {
		let userId = req.query.userId
		let skip = req.query.skip
		let limit = req.query.limit

		//유저가 자기자신인 것
		const query = {
			user: userId
		} 
		
		const fields = 'followUser'
		const options = {
			skip: skip,
			limit: limit,
			sort: 'date'
		}

		try {
			let followings = await Following.find(query, fields, options)
				.populate('followUser')

			res.status(200).json({
				data: followings
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 해당 아이디의 follower 숫자
	//@api: GET http://localhost:3001/api/followings/followers/count
	//@query : userId
	api.get('/followers/count', [checkUserId], async (req, res) => {
		let userId = req.query.userId

		try {
			//팔로우 유저가 자기자신인 것
			const query = {
				followUser: userId
			} 
			
			let count = await Following.count(query)

			res.status(200).json({
				data: count
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 해당 아이디의 follower 유저 정보 가져옴
	//@api: GET http://localhost:3001/api/followings/followers
	//@query: userId, skip?, limit?
	api.get('/followers', [checkSkipAndLimit, checkUserId], async (req, res) => {
		let userId = req.query.userId
		let skip = req.query.skip
		let limit = req.query.limit

		const query = {
			followUser: userId
		}
		const fields = 'user'
		const options = {
			skip: skip,
			limit: limit,
			sort: 'date'
		}

		try {
			let followers = await Following.find(query, fields, options)
				.populate('user')

			res.status(200).json({
				data: followers
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	return api
}