module.exports = ({
  init,
  db
}) => {
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {
    checkLoggedIn,
    checkLoggedOut
  } = require('../middleware/authenticate')

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

  //테스트 용, 더미 다큐먼트를 생성 후 콘솔창에 출력함
  //@url: GET http://localhost:3001/api/memo/test
  api.get('/test', checkLoggedIn, async (req, res) => {
    Memo.create({
      "imgUrl": "Server\\Pictures\\i14182109167",
      "text": "Myself in seoul",
      "loc": {
        "type": "Point",
        "coordinates": [-80, 20]
      },
      "tag": ["seoul", "tour"],
      "user": req.user._id
    }, (err, o) => {
      if (err) return console.log(err);
      //위에서 생성한 메모를 가져옴
      console.log(o);
      //로그인이 되어있으면 유저 정보를 가져옴
      //console.log(req.user);

      res.status(200).json({message: o, success: true})
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

      res.status(200).json({message: count, success: true})

    } catch(err) {
      res.status(500).json({message: err.message, success: true})
    }

  })
  //로그인 상태에서, 주어진 좌표에서 가까운 메모 최대 30개 반환
  //@url: GET http://localhost:3001/api/memo/near?lng=-80&lat=20
  api.get('/near', checkLoggedIn, async (req, res) => {
    if (isEmpthy((req.query.lng) || isEmpthy(req.query.lat))) {
      return res.status(400).json({
        message: "lng or lat query is empty. Plase check your get request whether it be added lng and lat query.",
        success: false
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

      res.status(200).json({
        message: memos,
        success: true
      })

    } catch (err) {
      res.status(500).json({
        message: err.message,
        success: false
      })
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

      res.status(200).json({
        message: memos,
        success: true
      })

    } catch (err) {
      res.status(500).json({
        message: err.message,
        success: false
      })
    }
  })

  //로그인된 유저의 메모를 추가함
  //@url POST http://localhost:3001/api/memo
  api.post('/', checkLoggedIn, async (req, res) => {
    try {
      let memo = await Memo.create({
        imgUrl: req.body.imgUrl,
        text: req.body.text,
        loc: req.body.loc,
        tag: req.body.tag,
        user: req.user._id
      })

      res.status(200).json({
        message: memo,
        success: true
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({
        message: err.message,
        success: false
      })
    }
  })

  //로그인된 유저의 모든 메모를 삭제함
  //@url: DELETE http://localhost:3001/api/memo
  api.delete('/', checkLoggedIn, async (req, res) => {
    try {
      await Memo.deleteMany()
      .where('user')
      .equals(req.user._id)

      res.status(200).json({message: "Successfully deleted all documents belongs to the logged in user", success: true})

    } catch (err) {
      res.status(500).json({message: err.message, success: false})
    }
  })

  //로그인된 유저의 특정한 메모 한 개를 삭제함
  //@url: DELETE http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2
  api.delete('/:id', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .deleteOne()

      res.status(200).json({message: "Successfully deleted one document belongs to the logged in user", success: true})

    } catch (err) {
      res.status(500).json({message: err.message, success: false})
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

      res.status(200).json({message: "", success: true})
      
    } catch (err) {
      res.status(500).json({message: err.message, success: false})
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

      res.status(200).json({message: "", success: true})
      
    } catch (err) {
      res.status(500).json({message: err.message, success: false})
    }
  })

    //memo의 tag을 바꿈
  //@url: PUT http://localhost:3001/api/memo/5b8e3895e1d5b36e086078a2/tag
  api.put('/:id/tag', checkLoggedIn, async (req, res) => {
    try {
      await Memo.where('_id')
      .equals(req.params.id)
      .updateOne({
        tag: req.body.tag,
      })

      res.status(200).json({message: "", success: true})
      
    } catch (err) {
      res.status(500).json({message: err.message, success: false})
    }
  })
  //TODO follower, follwing
  return api
}