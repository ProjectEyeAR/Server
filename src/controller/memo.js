module.exports = ({
  init,
  db,
  logger
}) => {
  const Memo = require('../model/memo')
  const Comment = require('../model/comment')
  const api = require('express').Router()
  const {
    checkLoggedIn
  } = require('../middleware/authenticate')
  const {
    checkMemo,
    checkMemoTextAndImage,
    checkIdParams,
    checkUserIdQuery,
    checkSkipAndLimit,
    checkLngAndLat,
    checkTag
  } = require('../middleware/typeCheck')({
    logger,
    init
  })
  const axios = require('axios')

  api.get('/:id', checkIdParams, async (req, res) => {
    let id = req.params.id

    try {
      let query = { '_id': id }
      let memo = await Memo.findOne(query).populate('user')

      let commentCountQuery = { memo: id }
      let commentCount = await Comment.count(commentCountQuery)

      memo.set('commentCount', commentCount)

      if (req.isAuthenticated()) {
        let userId = req.user._id
        let commentQuery = { user: userId, memo: id }
        let count = await Comment.count(commentQuery)

        memo.set('hasComment', count > 0)
      }

      return res.status(200).json({
        data: memo
      })

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 주어진 tag가 속한 모든 메모를 출력함
  //@router : GET http://localhost:3001/api/memos/findByTag
  //@query : tag: String
  api.get('/findByTag', checkTag, async (req, res) => {
    let tag = req.query.tag

    try {
      let memos = await Memo.find({
          tags: tag
        })
        .populate('user')
        .limit(30)

      return res.status(200).json({
        data: memos
      })
    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 특정 유저에게 속한 모든 메모의 개수를 보여줌
  //@router : GET http://localhost:3001/api/memos/:id/count
  //@params : id: String
  api.get('/count', checkUserIdQuery, async (req, res) => {
    let id = req.query.userId

    try {
      let count = await Memo.find({})
        .where('user')
        .equals(id)
        .count()

      return res.status(200).json({
        data: count
      })

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 주어진 좌표에서 가까운 메모 최대 30개 반환, loc img address필드만 가져옴
  //@router : GET http://localhost:3001/api/memos/near
  //@query : lng: String, lat: String, skip: String, limit: String
  api.get('/near', [checkSkipAndLimit, checkLngAndLat], async (req, res) => {
    let lng = req.query.lng
    let lat = req.query.lat
    let skip = req.query.skip
    let limit = req.query.limit

    try {
      let memos = await Memo.find({})
        .skip(parseInt(skip))
        .where('loc')
        .near({
          center: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          maxDistance: 0.1 / 111.12,
          spherical: true
        })
        .populate('user')
        .limit(parseInt(limit))

      return res.status(200).json({
        data: memos
      })

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 특정 유저에 속해있는 모든 메모 출력
  //@router : GET http://localhost:3001/api/memos/:id
  //@params : id: String
  //@query : skip: String, limit: String
  api.get('/', [checkSkipAndLimit, checkUserIdQuery], async (req, res) => {
    let tagetUserId = req.query.userId
    let skip = req.query.skip
    let limit = req.query.limit

    try {
      let memos = await Memo.find({})
        .skip(parseInt(skip))
        .where('user')
        .equals(tagetUserId)
        .populate('user')
        .sort('date')
        .limit(parseInt(limit))

      return res.status(200).json({
        data: memos
      })

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 자신에게 메모를 추가함
  //@router : POST http://localhost:3001/api/memos
  //@body : text: String, img: Object, tags: String, loc: Object [lng, lat]
  api.post('/', [checkLoggedIn, checkMemo], async (req, res) => {
    let text = req.body.text
    let img = req.file
    let loc = req.body.loc
    let myUserId = req.user._id
    let tags = req.body.tags
    let address

    await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${loc.coordinates[1]}&lon=${loc.coordinates[0]}&email=${init.email}`)
      .then(res => {
        address = res.data.address
      })
      .catch(err => {
        logger.error(err.message)
        return res.status(500).json({
          message: err.message
        })
      })

    try {
      let memo = await Memo.create({
        img: img.location,
        text: text,
        loc: loc,
        tags: tags,
        user: myUserId,
        address: address
      })

      return res.status(201).json({
        data: memo
      })

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })


  //@desc : 자신의 모든 메모를 삭제함
  //@router : DELETE http://localhost:3001/api/memos
  api.delete('/', checkLoggedIn, async (req, res) => {
    let myUserId = req.user._id

    try {
      await Memo.deleteMany()
        .where('user')
        .equals(myUserId)

      return res.status(200).json({})

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 자신의 특정한 메모 한 개를 삭제함
  //@router : DELETE http://localhost:3001/api/memos/:id
  //@params : id: String
  api.delete('/:id', [checkLoggedIn, checkIdParams], async (req, res) => {
    let id = req.params.id

    let filter = {
      _id: id
    }

    try {
      await Memo.findOneAndDelete(filter)

      return res.status(200).json({})

    } catch (err) {
      logger.error(err.message)
      return res.status(500).json({
        message: err.message
      })
    }
  })

  //@desc : 자신의 특정한 memo의 사진, 텍스트를 바꿈
  //@router : PUT http://localhost:3001/api/memos/:id/TextAndImage
  //@params : id: String
  //@body: img: Object, text: String
  api.put('/:id/TextAndImage', [checkLoggedIn, checkMemoTextAndImage, checkIdParams], async (req, res) => {
    let id = req.params.id
    let myUserId = req.user._id
    let img = req.file
    let tags = req.body.tags

    let filter = {
      _id: id,
      user: myUserId
    }
    let update = {
      $set: {
        img: img.location,
        tags: tags
      }
    }
    let option = {
      new: true,
      upsert: false
    }

    try {
      let memo = await Memo.findOneAndUpdate(filter, update, option)

      return res.status(200).json({
        data: memo
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