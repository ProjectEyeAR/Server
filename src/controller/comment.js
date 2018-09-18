module.exports = ({db, init, logger}) => {
    const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
	const errorMessage = require('../error_message')
	const api = require('express').Router()
	const Comment = require('../model/comment')
	const check = require('check-types')

	//@desc : 특정 메모에 속해있는 이모찌와 유저를 전부 가져옴
	//@router : POST  http://localhost:3001/api/comments/:id
	//@params : 
	//id: String,
	//skip: Number,
	//limit: Number
	api.get('/:id', async (req, res) => {
		let targetMemoId = req.params.id
		let skip = req.query.skip
		let limit = req.query.limit

		if (check.not.number(skip)) {
			skip = 0
		}
		if (check.not.number(limit)) {
			limit = 30
		}

		try {
			let comments = await Comment.find({})
			.skip(skip)
			.where('memo')
			.equals(targetMemoId)
			.select('user emoji')
			.populate('user')
			.limit(limit)
			.sort('date')

			res.status(200).json({ data: comments })
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({ message: err.message })
		}
	})
	//HACK!! 이미 추가됐는지 확인해야될까?
	//@desc : 코멘트 추가
	//@router : POST  http://localhost:3001/api/comments
	//@params : 
	//targetMemoId: String,
	//emoji: String
	api.post('/', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id
		let targetMemoId = req.body.targetMemoId
		let emoji = req.body.emoji

		if (check.not.string(targetMemoId)) {
			return res.status(404).json({
				message: errorMessage.INVALID_POST_REQUEST + ' (targetMemoId)'
			})
		}

		if (check.not.string(emoji)) {
			return res.status(404).json({
				message: errorMessage.INVALID_POST_REQUEST + ' (emoji)'
			})
		}

		try {
			let query = {
				user: myUserId,
				memo: targetMemoId,
				emoji: emoji
			}
			let comment = await Comment.create(query)

			res.status(201).json({ data: comment })
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({ message: err.message })
		}
	})

	
	//@desc : 코멘트 추가
	//@ router: DELETE http://localhost:3001/api/comments
	//@params : targetMemoId: String
	api.delete('/', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id
		let targetMemoId = req.query.targetMemoId

		if (check.not.string(targetMemoId)) {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (targetMemoId)'
			})
		}

		try {
			const query = {user: myUserId, memo: targetMemoId}
			await Comment.findOneAndDelete(query)

			res.status(200).json({})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({ message: err.message })
		}
	})

	//@desc : 주어진 메모 id에서 자신의 코멘트 수정
	//@router: DELETE http://localhost:3001/api/comments/:id
	//@params : emoji: String
	api.put('/:id', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id
		let targetMemoId = req.params.id
		let emoji = req.body.emoji

		if (check.not.string(emoji)) {
			return res.status(404).json({
				message: errorMessage.INVALID_POST_REQUEST + ' (emoji)'
			})
		}

		let filter = { memo: targetMemoId , user: myUserId }
		let update = { $set: { emoji: emoji, date: Date.now() }}
		let option = { new: true , upsert: false} //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
	
		try {
			let comment = await Comment.findOneAndUpdate(filter, update, option)

			res.status(200).json({ data: comment })
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({ message: err.message })
		}
	})
    
    return api;
}