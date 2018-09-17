module.exports = ({init, db}) => {
	const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
	const errorMessage = require('../error_message')
	const Following = require('../model/following')
	const api = require('express').Router()

	api.get('/count', async (req, res) => {
		let userId = req.query.userId

		if (!userId || typeof(userId) !== 'number') {
			//TODO: 400 or 404?
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (userId)'
			})
		}

		try {
			let users = []
			const query = {user: userId}
			const fields = 'followUser'
			let count = await Following.count(query)

			res.status(200).json({ data: count })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	api.get('/followers/count', async (req, res) => {
		let userId = req.query.userId

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (userId)'
			})
		}

		try {
			let users = []
			const query = {followUser: userId}
			const fields = 'user'
			let count = await Following.count(query)

			res.status(200).json({ data: count })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	//자신이 팔로우하고있는 유저 정보 가져옴
	api.get('/', async (req, res) => {
		let userId = req.query.userId
		let skip = req.query.skip
		let limit = req.query.limit

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (userId)'
			})
		}

		if (!skip || typeof(skip) !== 'number') {
			skip = 0
		}

		if (!limit || typeof(limit) !== 'number') {
			limit = 30
		}

		let users = []
		const query = {user: userId}
		const fields = 'followUser'
		const options = { skip: skip, limit: limit, sort: 'date' }

		try {
			let followings = await Following.find(query, fields, options)
			.populate('followUser')

			followings.forEach(following => {
				users.append(followings.followUser)
			})

			res.status(200).json({ data: users })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	//자신을 팔로우 하고있는 유저 정보를 가져옴
	api.get('/followers', async (req, res) => {
		let userId = req.query.userId
		let skip = req.query.skip
		let limit = req.query.limit

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (userId)'
			})
		}

		//HACK!!
		if (!skip || typeof(skip) !== 'number') {
			skip = 0
		}
		//HACK!!
		if (!limit || typeof(limit) !== 'number') {
			limit = 30
		}

		let followUsers = []
		const query = {followUser: userId}
		const fields = 'user'
		const options = { skip: skip, limit: limit, sort: 'date' }

		try {
			let users = await Following.find(query, fields, options)
			.populate('user')

			followings.forEach(following => {
				followUsers.append(followings.user)
			})

			res.status(200).json({ data: followUsers })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	//팔로우 추가
	api.post('/', checkLoggedIn, async (req, res) => {
		let userId = req.user._id
		//HACK!!
		let followUserId = req.query.followUserId

		if (!followUserId || typeof(followUserId) !== 'number') {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (followUserId)'
			})
		}

		try {
			let following = await Following.create({
				user: userId,
				followUser: followUserId
			})

			res.status(200).json({ data: following })
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	api.delete('/', checkLoggedIn, async (req, res) => {
		let userId = req.user._id
		let followUserId = req.query.followUserId

		if (!followUserId || typeof(followUserId) !== 'number') {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (followUserId)'
			})
		}

		try {
			const query = {user: userId, followUser: followUserId}
			await Following.findOneAndDelete(query)

			res.status(200).json({})
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	})

	return api
}