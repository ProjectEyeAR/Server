module.exports = ({init, db}) => {
  const errorMessage = require('../error_message')
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
  const upload = require('../services/file-upload')({init});
  const logger = require('../config/logger')
  const hashtagRegex = /#.[^\s\d\t\n\r\.\*\\`~!@#$%^&()\-=+[{\]}|;:'",<>\/?]+/g //ex: #tag1#tag2 => #tag#tag
  //TODO follower, follwing

  isEmpthy = o => {
    if (!o) {
      return true
    }
    if (!(typeof (o) === 'number') && !Object.keys(o).length) {
      return true
    }
    return false
  }

  //테스트 필요함!
  api.post('/findByTag', async(req, res) => {
    if(!req.body.tag || req.body.tag === 'string') return

    let tag = Array.from(req.body.tag)

    try {
      let memos = await Memo.find({})
      .where('tags')
      .in(tag)
      .limit(30)

      res.status(200).json({ data: memos })
    } catch(err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })
  
  //로그인된 유저에게 속한 모든 메모의 개수를 보여줌
  //@url: GET http://localhost:3001/api/memo/count
  api.get('/count', checkLoggedIn, async (req, res) => {
    try {
      let count = await Memo.find({})
      .where('user')
      .equals(req.user._id)
      .count()

      res.status(200).json({ data: count })

    } catch(err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //로그인 상태에서, 주어진 좌표에서 가까운 메모 최대 30개 반환, loc img필드만 가져옴
  //@url: GET http://localhost:3001/api/memo/near?lng=-80&lat=20
  api.get('/near', checkLoggedIn, async (req, res) => {
    if (isEmpthy(req.query.lng)) {
      logger.error(err.message, err)
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (lng)'
      })
    }

    if (isEmpthy(req.query.lat)) {
      logger.error(err.message, err)
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
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
            spherical: true,
            maxDistance: 2
          }
        })
        .select('img loc')
        .limit(30)

      res.status(200).json({ data: memos })

    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //로그인된 유저에 속해있는 모든 메모 출력
  //@url : GET http://localhost:3001/api/memo
  api.get('/', checkLoggedIn, async (req, res) => {
    try {
      let memos = await Memo.find({})
        .where('user')
        .equals(req.user._id)
        .sort('date')

      res.status(200).json({ data: memos })

    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })
  

  //로그인된 유저의 메모를 추가함
  //@url POST http://localhost:3001/api/memo
  api.post('/', [checkLoggedIn, upload.single('img')], async (req, res) => {
    let hashtagsWithoutSharp = []
    if (req.body.text) { 
      let hashtags = req.body.text.match(hashtagRegex)
      hashtags.forEach(hashtag => {
        hashtagsWithoutSharp.push(hashtag.substring(1))
      })
    }

    let location = ""
    if (req.file) {
      location = req.file.location
    }

    try {
      let memo = await Memo.create({
        img: location, 
        text: req.body.text,
        loc: req.body.loc,
        tags: hashtagsWithoutSharp,
        user: req.user._id
      })

      res.status(200).json({ data: memo })

    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //로그인된 유저의 모든 메모를 삭제함
  //@url: DELETE http://localhost:3001/api/memo
  api.delete('/', checkLoggedIn, async (req, res) => {
    try {
      await Memo.deleteMany()
      .where('user')
      .equals(req.user._id)

      res.status(200).json({})

    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //로그인된 유저의 특정한 메모 한 개를 삭제함
  //@url: DELETE http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2
  api.delete('/:id', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .deleteOne()

      res.status(200).json({})

    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //memo의 사진을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/img
  api.put('/:id/image', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        img: req.body.img,
      })

      res.status(200).json({})
      
    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //memo의 text을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/text
  api.put('/:id/text', checkLoggedIn, async (req, res) => {
    let hashtagsWithoutSharp = []
    if (req.body.tags) { 
      let hashtags = req.body.text.match(hashtagRegex)
      hashtags.forEach(hashtag => {
        hashtagsWithoutSharp.push(hashtag.substring(1))
      })
    }

    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        text: req.body.text,
        tags: hashtagsWithoutSharp
      })

      res.status(200).json({})
      
    } catch (err) {
      logger.error(err.message, err)
      res.status(500).json({ message: err.message })
    }
  })

  //테스트 용, 더미 다큐먼트를 생성 후 콘솔창에 출력함
  //@url: GET http://localhost:3001/api/memo/test
  api.get('/test', checkLoggedIn, async (req, res) => {
    Memo.create({
      //TODO: 실제 서버에 저장되어있는 이미지 주소 쓰기
      'img': 'Server\\Pictures\\i14182109167',
      'text': 'Myself in seoul',
      'loc': {
        'type': 'Point',
        'coordinates': [-80, 20]
      },
      'tags': ['#seoul', '#tour'],
      'user': req.user._id
    }, (err, o) => {
      if (err) return console.log(err.message);
      //위에서 생성한 메모를 가져옴
      console.log(o);
      //로그인이 되어있으면 유저 정보를 가져옴
      //console.log(req.user);

      res.status(200).json({message: o})
    })
  })


  return api
}