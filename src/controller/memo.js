const mongoose = require('mongoose')
const express = require('express')
const Memo = require('../routes/model/memo')
const bodyParser = require('body-parser')
const init = require('../config')

module.exports = ({ init, db }) => {
  let api = express()

  api.get('/', (req, res) => {
    let memos = Memo.find().sort('date')
    res.send(memos)
  })

  api.get('/:id', (req, res) => {
    let memo = Memo.findById(req.params.id)
    if (!memo) return res.status(404).json({ message: '데이터가 존재하지 않음' })
    res.send(memo)
  })

  api.post('/', async (req, res) => {
      let Memo = new Memo()
      Memo.img = req.body.img
      Memo.text = req.body.text
      Memo.geometry.coordinates = req.body.geometry.coordinates
      await Memo.save((err) => {
        if(err) return res.status(500).json({ message: 'internal error' })
        res.json({ message: '성공적으로 저장' })
      })
  })

  api.put('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndUpdate(req.params.id, {
      //수정할 내용
    }, { new: true })
    if(!memo) return res.status(404).json({ message: '데이터가 존재하지 않음' })
    res.json({ message: '성공적으로 업데이트' })
  })

  api.delete('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndDelete(req.params.id)
    if(!memo) return res.status(404).json({ message: '데이터가 존재하지 않음' })
    res.send(memo)
  })

  return api
}
