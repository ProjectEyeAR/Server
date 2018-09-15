module.exports = ({init, db}) => {
  const errorMessage = require('../error_message')
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')
  const {upload, gfs} = require('../config/gridfs')(init, db);

  //HACK!! 왜 숫자 제외하는지 물어보기
  const hashtagRegex = /#.[^\s\d\t\n\r\.\*\\`~!@#$%^&()\-=+[{\]}|;:'",<>\/?]+/g //ex: #tag1#tag2 => #tag#tag

  //TODO 이미지 url 뿌리는 것으로, 아이디

  //TODO 이미지랑 위치만 뿌려주는 부분 

  //TODO 태그로 메모 찾는 부분

  //TODO follower, follwing

  //HACK!! get라우터 한번에 이미지 + memo 데이터 불러오고 싶은데 할 수 없음... memo에 이미지 id 넣고 이미지는 따로 라우터 통해서 불러오는 식으로... 

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
  api.get('/image', (req, res) => {
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
      'imgId': 'Server\\Pictures\\i14182109167',
      'text': 'Myself in seoul',
      'loc': {
        'type': 'Point',
        'coordinates': [-80, 20]
      },
      'tags': ['seoul', 'tour'],
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
      let images;
      let memos;
      
      await Memo.find({})
        .where('user')
        .equals(req.user._id)
        .sort('date')
        .populate('imgId')
        .exec(function (err, memos) {
          // memos.forEach(function(memo) {
          //   gfs.files.findOne({_id: memo.imgId}, function (err, file) {
          //     console.log(file);
          //   })
          // })
          console.log(memos);
        })

      res.status(200).json({ data: memos })

    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  

  //로그인된 유저의 메모를 추가함
  //@url POST http://localhost:3001/api/memo
  //img가 들어오면 imgId를 메모에 저장, img는 다른 컬렉션에 저장
  api.post('/', [checkLoggedIn, upload.single('img')], async (req, res) => {
    let hashtagsWithoutSharp = []
    if (req.body.tags) { 
      let hashtags = req.body.tags.match(hashtagRegex)

      hashtags.forEach(hashtag => {
        hashtagsWithoutSharp.push(hashtag.substring(1))
      })
    }
    try {
      let memo = await Memo.create({
        imgId: req.file.id,
        text: req.body.text,
        loc: req.body.loc,
        tags: hashtagsWithoutSharp,
        user: req.user._id
      })

      res.status(200).json({ data: memo })

    } catch (err) {
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
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/imgId
  api.put('/:id/imgId', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        imgId: req.body.imgId,
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
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/tags
  api.put('/:id/tags', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        tags: req.body.tags,
      })

      res.status(200).json({})
      
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })



  return api
}