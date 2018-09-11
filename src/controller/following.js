module.exports = ({init, db}) => {
	const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
	const Following = require('../model/following')
	const Api = require('express').Router()

	Api.get('/following/count', async (req, res) => {
		let userId = req.userId

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find user.',
				success: false
			})
		}

		try {
			let users = []
			const query = {user: userId}
			const fields = 'followUser'
			let count = await Following.count(query)

			res.status(200).json({
				message: count,
				success: true
			})
		} catch (err) {
			res.status(500).json({
				message: err.message,
				success: false
			})
		}
	})

	Api.get('/follower/count', async (req, res) => {
		let userId = req.userId

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find user.',
				success: false
			})
		}

		try {
			let users = []
			const query = {followUser: userId}
			const fields = 'user'
			let count = await Following.count(query)

			res.status(200).json({
				message: count,
				success: true
			})
		} catch (err) {
			res.status(500).json({
				message: err.message,
				success: false
			})
		}
	})

	Api.get('/following', async (req, res) => {
		let userId = req.userId

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find user.',
				success: false
			})
		}

		if (!req.skip || typeof(req.skip) !== 'number') {
			req.skip = 0
		}

		if (!req.limit || typeof(req.limit) !== 'number') {
			req.limit = 30
		}

		let users = []
		const query = {user: userId}
		const fields = 'followUser'
		const options = { skip: req.skip, limit: req.limit, sort: 'date' }

		try {
			let followings = await Following.find(query, fields, options)
			.populate('followUser')

			followings.forEach(following => {
				users.append(followings.followUser)
			})

			res.status(200).json({
				message: users,
				success: true
			})
		} catch (err) {
			res.status(500).json({
		        message: err.message,
		        success: false
      		})
		}
	})

	Api.get('/follower', async (req, res) => {
		let userId = req.userId

		if (!userId || typeof(userId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find user.',
				success: false
			})
		}

		if (!req.skip || typeof(req.skip) !== 'number') {
			req.skip = 0
		}

		if (!req.limit || typeof(req.limit) !== 'number') {
			req.limit = 30
		}

		let followUsers = []
		const query = {followUser: userId}
		const fields = 'user'
		const options = { skip: req.skip, limit: req.limit, sort: 'date' }

		try {
			let users = await Following.find(query, fields, options)
			.populate('user')

			followings.forEach(following => {
				followUsers.append(followings.user)
			})

			res.status(200).json({
				message: followUsers,
				success: true
			})
		} catch (err) {
			res.status(500).json({
		        message: err.message,
		        success: false
      		})
		}
	})

	Api.post('/', checkLoggedIn, async (req, res) => {
		let userId = req.user._id
		let followUserId = req.followUserId

		if (!followUserId || typeof(followUserId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find follow user.',
				success: false
			})
		}

		try {
			let following = await Following.create({
				user: userId,
				followUser: followUserId
			})

			res.status(200).json({
		        message: following,
		        success: true
		    })
		} catch (err) {
			res.status(500).json({
		        message: err.message,
		        success: false
      		})
		}
	})

	Api.delete('/', (req, res) => {
		int userId = req.user._id
		int followUserId = req.followUserId

		if (!followUserId || typeof(followUserId) !== 'number') {
			return res.status(404).json({
				message: 'Can\'t find follow user.',
				success: false
			})
		}

		try {
			const query = {user: userId, followUser: followUserId}
			await Following.findOneAndDelete(query)

			res.status(200).json({success: true})
		} catch (err) {
			res.status(500).json({
		        message: err.message,
		        success: false
      		})
		}
	})
}