module.exports = ({
	db,
	init,
	logger,
	check
}) => {
	const {
		checkLoggedIn
	} = require('../middleware/authenticate')
	const errorMessage = require('../error_message')
	const api = require('express').Router()
	const Comment = require('../model/comment')
	const {checkEmoji} = require('../middleware/typeCheck')

	//@desc : 특정 메모에 속해있는 이모찌와 유저를 전부 가져옴
	//@router : POST http://localhost:3001/api/comments/:id
	//@params : id: String
	//@query : skip: String, limit: String

	api.get('/:id', async (req, res) => {
		let targetMemoId = req.params.id
		let skip = req.query.skip
		let limit = req.query.limit

		if (check.not.string(skip)) {
			skip = 0
		}
		if (check.not.string(limit)) {
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

			res.status(200).json({
				data: comments
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//HACK!! 이미 추가됐는지 확인해야될까?
	//@desc : 코멘트 추가
	//@router : POST http://localhost:3001/api/comments
	//@body :
	/* 
		id: String,
		emoji: String,
		memoId: String
	*/
	api.post('/', [checkLoggedIn, checkEmoji], async (req, res) => {
		let myUserId = req.user._id
		let memoId = req.body.memoId
		let emoji = req.body.emoji

		if (check.not.string(memoId)) {
			return res.status(404).json({
				message: errorMessage.INVALID_POST_REQUEST + ' (memoId)'
			})
		}

		try {
			let query = {
				user: myUserId,
				memo: memoId,
				emoji: emoji
			}
			let comment = await Comment.create(query)

			res.status(201).json({
				data: comment
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 자신의 특정 코멘트 삭제
	//@router: DELETE http://localhost:3001/api/comments/:id
	//@params : id: String
	api.delete('/:id', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id
		let id = req.params.id

		if (check.not.string(id)) {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
			})
		}

		try {
			const filter = {
				user: myUserId,
				comment: id
			}
			await Comment.findOneAndDelete(filter)

			res.status(200).json({})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	//@desc : 자신의 특정 코멘트 수정
	//@router: PUT http://localhost:3001/api/comments/:id
	//@params : id: String
	//@body : emoji: String
	api.put('/:id', checkLoggedIn, async (req, res) => {
		let myUserId = req.user._id
		let id = req.params.id
		let emoji = req.body.emoji

		if (check.not.string(id)) {
			return res.status(404).json({
				message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
			})
		}

		if (check.not.string(emoji)) {
			return res.status(404).json({
				message: errorMessage.INVALID_POST_REQUEST + ' (emoji)'
			})
		}

		let filter = {
			comment: id,
			user: myUserId
		}
		let update = {
			$set: {
				emoji: emoji,
				date: Date.now()
			}
		}
		let option = {
			new: true,
			upsert: false //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
		}

		try {
			let comment = await Comment.findOneAndUpdate(filter, update, option)

			res.status(200).json({
				data: comment
			})
		} catch (err) {
			logger.error(err.message)
			res.status(500).json({
				message: err.message
			})
		}
	})

	return api;
}