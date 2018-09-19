module.exports = ({
  init,
  db,
  logger,
  check
}) => {
  const errorMessage = require('../error_message')
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {
    checkLoggedIn
  } = require('../middleware/authenticate')
  const upload = require('../services/file-upload')({
    init
  });
  const single = upload.single('img')
  const hashtagRegex = /#.[^\s\d\t\n\r\.\*\\`~!@#$%^&()\-=+[{\]}|;:'",<>\/?]+/g //ex: #tag1#tag2 => #tag#tag

  //@desc : 주어진 tag가 속한 모든 메모를 출력함
  //@router : GET http://localhost:3001/api/memos/findByTag
  //@query : tag: String,
  api.get('/findByTag', async (req, res) => {
    let tag = req.query.tag

    if (check.not.string(tag)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (tag)'
      })
    }

    try {
      let memos = await Memo.find({
          tags: tag
        })
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
  api.get('/:id/count', async (req, res) => {
    let id = req.params.id

    if (check.not.string(id)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
      })
    }

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

  //@desc : 자신에게 속한 모든 메모의 개수를 보여줌
  //@router : GET http://localhost:3001/api/memos/count
  api.get('/count', checkLoggedIn, async (req, res) => {
    let myUserId = req.user._id

    try {
      let count = await Memo.find({})
        .where('user')
        .equals(myUserId)
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

  //@desc : 주어진 좌표에서 가까운 메모 최대 30개 반환, loc img필드만 가져옴
  //@router : GET http://localhost:3001/api/memos/near
  //@query : 
  /*	
    lng: String,
		lat: String,
	*/
  api.get('/near', async (req, res) => {
    let lng = req.query.lng
    let lat = req.query.lat

    if (check.not.string(lng)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (lng)'
      })
    }

    if (check.not.string(lat)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (lat)'
      })
    }

    try {
      let memos = await Memo.find({})
        .where('loc')
        .near({
          center: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
            spherical: true,
            maxDistance: 2
          }
        })
        .select('img loc')
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

  //@desc : 특정 유저에 속해있는 모든 메모 출력
  //@router : GET http://localhost:3001/api/memos/:id
  //@params : id: String
  //@query : 
  /*	
  /*skip: String,
  /*limit: String,
	*/
  api.get('/:id', async (req, res) => {
    let id = req.params.id
    let skip = req.query.skip
    let limit = req.query.limit

    if (check.not.string(id)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
      })
    }

    if (check.not.string(skip)) {
      skip = 0
    }

    if (check.not.string(limit)) {
      limit = 30
    }

    try {
      let memos = await Memo.find({})
        .skip(parseInt(skip))
        .where('user')
        .equals(id)
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

  //@desc : 자신에게 속해있는 모든 메모 출력
  //@router : GET http://localhost:3001/api/memos/:id
  //@query : 
  /*	
  /*skip: String,
  /*limit: String,
	*/
  api.get('/', checkLoggedIn, async (req, res) => {
    let myUserId = req.user._id
    let skip = req.query.skip
    let limit = req.query.limit

    if (check.not.string(skip)) {
      skip = 0
    }

    if (check.not.string(limit)) {
      limit = 30
    }

    try {
      let memos = await Memo.find({})
        .skip(parseInt(skip))
        .where('user')
        .equals(myUserId)
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
  //@body : 	
  /*
  /*text: String,
	/*img: Object,
  /*tags: String,
  /*loc: Object
  */
  api.post('/', checkLoggedIn, (req, res) => {
    single(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
        })
      }

      let text = req.body.text
      let img = req.file
      let tags = req.body.tags
      let loc = req.body.loc
      let myUserId = req.user._id

      if (check.not.object(img)) {
        return res.status(400).json({
          message: errorMessage.INVALID_POST_REQUEST + ' (file)'
        })
      }

      if (check.not.object(loc)) {
        return res.status(400).json({
          message: errorMessage.INVALID_POST_REQUEST + ' (loc)'
        })
      }

      let hashtagsWithoutSharp = []
      if (check.string(tags)) {
        let hashtags = tags.match(hashtagRegex)
        try {
          hashtags.forEach(hashtag => {
            hashtagsWithoutSharp.push(hashtag.substring(1))
          })
        } catch (err) {
          return res.status(400).json({
            message: errorMessage.INVALID_POST_REQUEST + ' (tags)'
          })
        }
      }

      try {
        let memo = await Memo.create({
          img: img.location,
          text: text,
          loc: loc,
          tags: hashtagsWithoutSharp,
          user: myUserId
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
  api.delete('/:id', checkLoggedIn, async (req, res) => {
    let id = req.params.id
    let myUserId = req.user._id

    if (check.not.string(id)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
      })
    }

    let filter = {
      memo: id,
      user: myUserId
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

  //@desc : 자신의 특정한 memo의 사진을 바꿈
  //@router : PUT http://localhost:3001/api/memos/:id/image
  //@params : id: String
  //@body: img: Object
  api.put('/:id/image', checkLoggedIn, (req, res) => {
    single(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: errorMessage.UNEXPECTED_FIELD_ERROR + ' (img)'
        })
      }

      let id = req.params.id
      let myUserId = req.user._id
      let img = req.file

      if (check.not.object(img)) {
        return res.status(400).json({
          message: errorMessage.INVALID_POST_REQUEST + ' (img)'
        })
      }

      if (check.not.string(id)) {
        return res.status(400).json({
          message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
        })
      }

      let filter = {
        memo: id,
        user: myUserId
      }
      let update = {
        $set: {
          img: img.location,
        }
      }
      let option = {
        new: true,
        upsert: false //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
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
  })

  //@desc : 자신의 특정한 memo의 text를 바꿈
  //@router : PUT http://localhost:3001/api/memos/:id/text
  //@params : id: String 
  //@body : img: Object
  api.put('/:id/text', checkLoggedIn, async (req, res) => {
    let id = req.params.id
    let myUserId = req.user._id
    let text = req.body.text

    if (check.not.string(id)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (id)'
      })
    }

    if (check.not.string(text)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (text)'
      })
    }

    let filter = {
      memo: id,
      user: myUserId
    }
    let update = {
      $set: {
        text: text,
      }
    }
    let option = {
      new: true,
      upsert: false //업데이트된 데이터가 출력됨, 없으면 생성하지 않음
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