module.exports = ({init, db }) => {
  const Memo = require('../model/memo')
  const api = require('express').Router()

  //TODO 이미지 url 뿌리는 것으로, 아이디

  //TODO 이미지랑 위치만 뿌려주는 부분 

  //TODO 태그로 메모 찾는 부분

  //TODO 현재 유저기준 메모 개수

  //TODO: 해당 유저 메모 전체삭제 구현

  //@url: http://localhost:3001/api/memo
  api.get('/', async (req, res) => {
    let memos = await Memo.find({})
    res.send(memos)
  })


  api.get('/', async (req, res) => {
    let memos = await Memo
    .find({})
    .where('geometry')
    .near({
      center: {
        type: 'Point',
        coordinate:[parseFloat(req.query.lng), parseFloat(req.query.lat)],
        spherical: true
      }
    })

    if(!memo)
      return res.statusMessage(404).json({ message: 'Data doesn\'t exist', success: false})

    res.status(200).json({ message: memos, success: true })
  })

  api.get('/:id', async (req, res) => {
    let memo = await Memo.findById(req.params.id)

    if (!memo)         
      return res.status(404).json({ message: 'Data doesn\'t exist', success: false })
      
    res.status(200).json({ message: memo, success: true })
  })

  api.post('/', async (req, res) => {
    let newMemo = new Memo()
    newMemo.imgUrl = req.body.imgUrl
    newMemo.text = req.body.text
    newMemo.geometry = req.body.geometry
    newMemo.tag = req.body.tag

    await newMemo.save()
    .then(() => res.status(200).json({ message: newMemo, success: true }))
    .catch(err => {
      console.error(err) 
      res.status(400).json({ message: err.message, success: false })    
   })
  })

  api.put('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndUpdate(req.params.id, {
      //TODO: 수정할 내용
    }, {new: true})

    if (!memo)
      return res.status(404).json({ message: 'Data doesn\'t exist', success: false })

    res.status(200).json({ message: memo, success: true })
  })

  api.delete('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndDelete(req.params.id)
    if (!memo)
      return res.status(404).json({message: 'Data doesn\'t exist', success: false })
    res.status(200).json({ message: memo, success: true })
  })

  return api
}
