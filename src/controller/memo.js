module.exports = ({
  init,
  db
}) => {
  //const User = require('../model/user')
  const Memo = require('../model/memo')
  const api = require('express').Router()
  const {checkLoggedIn, checkLoggedOut} = require('../middleware/authenticate')

  //TODO 이미지 url 뿌리는 것으로, 아이디

  //TODO 이미지랑 위치만 뿌려주는 부분 

  //TODO 태그로 메모 찾는 부분

  //TODO 현재 유저기준 메모 개수

  //TODO: 해당 유저 메모 전체삭제 구현

  //TODO: error출력 수정하기

  //TODO: user id로 메모 찾기

  //TODO: user id로 메모 업데이트, 삭제

  isEmpthy = o => {
    if (!o){
        return true;
    }
    if (!(typeof(o) === 'number') && !Object.keys(o).length){
        return true;
    }
    return false;
  }

  //@url: GET http://localhost:3001/api/memo/test
  api.get('/test', checkLoggedIn, async (req, res) => {
    // let memos = await Memo.find({})
    // res.send(memos)

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
    })
  })

  //@url: GET http://localhost:3001/api/memo/near?lng=-80&lat=20
  api.get('/near', checkLoggedIn, async (req, res) => {
    let memos = await Memo
      .find({})
      .where('loc')
      .near({
        center: {
          type: 'Point',
          coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          spherical: true
        }
      })
      .limit(30)

    //check whther empthy
    if (isEmpthy(memos)) {
      return res.statusMessage(404).json({
        message: 'Data doesn\'t exist',
        success: false
      })
    }

    res.status(200).json({
      message: memos,
      success: true
    })
  })

  api.get('/', checkLoggedIn, (req, res) => {
    
  })

  //@url POST http://localhost:3001/api/memo
  api.post('/', checkLoggedIn, (req, res) => {
    Memo.create({
      imgUrl : req.body.imgUrl,
      text : req.body.text,
      loc : req.body.loc,
      tag : req.body.tag,
      user : req.user._id
    })
      .then((memo) => res.status(200).json({
        message: memo,
        success: true
      }))
      .catch(err => {
        console.error(err)
        res.status(400).json({
          message: err.message,
          success: false
        })
      })
  })

  return api
}