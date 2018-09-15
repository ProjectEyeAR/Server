module.exports = ({init, db}) => {
  const errorMessage = require('../error_message')
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
  const {upload, gfs} = require('../config/gridfs')(init, db);

  const hashtagRegex = /#.[^\s\d\t\n\r\.\*\\`~!@#$%^&()\-=+[{\]}|;:'",<>\/?]+/g

  //TODO 이미지 url 뿌리는 것으로, 아이디

  //TODO 이미지랑 위치만 뿌려주는 부분 

  //TODO 태그로 메모 찾는 부분

  //TODO follower, follwing

  isEmpthy = o => {
    if (!o) {
      return true;
    }
    if (!(typeof (o) === 'number') && !Object.keys(o).length) {
      return true;
    }
    return false;
  }

  // @route POST /upload
  // @desc  Uploads a file to DB
  api.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
  //res.redirect('/');
  });

  //HACK!! find를 2번 해야하나??

  // @route GET /image/:filename
  // @desc Display Image
  api.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }

      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });


  //테스트 용, 더미 다큐먼트를 생성 후 콘솔창에 출력함
  //@url: GET http://localhost:3001/api/memo/test
  api.get('/test', checkLoggedIn, async (req, res) => {
    Memo.create({
      //TODO: 실제 서버에 저장되어있는 이미지 주소 쓰기
      'imgUrl': 'Server\\Pictures\\i14182109167',
      'text': 'Myself in seoul',
      'loc': {
        'type': 'Point',
        'coordinates': [-80, 20]
      },
      'tag': ['seoul', 'tour'],
      'user': req.user._id
    }, (err, o) => {
      if (err) return console.log(err);
      //위에서 생성한 메모를 가져옴
      console.log(o);
      //로그인이 되어있으면 유저 정보를 가져옴
      //console.log(req.user);

      res.status(200).json({message: o})
    })
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
      res.status(500).json({ message: err.message })
    }

  })

  //로그인 상태에서, 주어진 좌표에서 가까운 메모 최대 30개 반환
  //@url: GET http://localhost:3001/api/memo/near?lng=-80&lat=20
  api.get('/near', checkLoggedIn, async (req, res) => {
    if (isEmpthy(req.query.lng)) {
      return res.status(400).json({
        message: errorMessage.INVALID_QUERY_PARAMETER + ' (lng)'
      })
    }

    if (isEmpthy(req.query.lat)) {
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
            spherical: true
          }
        })
        .limit(30)

      res.status(200).json({ data: memos })

    } catch (err) {
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
      res.status(500).json({ message: err.message })
    }
  })

  //로그인된 유저의 메모를 추가함
  //@url POST http://localhost:3001/api/memo
  api.post('/', checkLoggedIn, async (req, res) => {
    // let hashtags = req.body.text.match(hashtagRegex)
    // let hashtagsWithoutSharp = []

    // hashtags.foreach(hashtag => {
    //   hashtagsWithoutSharp.append(hashtag.substring(1))
    // })

    try {
      let memo = await Memo.create({
        imgUrl: req.body.imgUrl,
        text: req.body.text,
        loc: req.body.loc,
        tag: hashtagsWithoutSharp,
        user: req.user._id
      })

      res.status(200).json({ data: memo })

    } catch (err) {
      console.error(err)
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
      res.status(500).json({ message: err.message })
    }
  })

  //memo의 사진을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/img
  api.put('/:id/img', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        imgUrl: req.body.imgUrl,
      })

      res.status(200).json({})
      
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  //memo의 text을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/text
  api.put('/:id/text', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        text: req.body.text,
      })

      res.status(200).json({})
      
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

    //로그엔된 유저 memo의 tag을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/tag
  api.put('/:id/tag', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        tag: req.body.tag,
      })

      res.status(200).json({})
      
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })



  return api
}