const mongoose = require('mongoose')
const express = require('express')
const Memo = require('../model/memo')
const init = require('../config')

module.exports = ({ init, db }) => {
  const api = express()

  api.get('/', async (req, res) => {
    let memos = await Memo.find().sort('date')
    res.status(200).json({ message: memos, success: true })
  })

  api.get('/:id', async (req, res) => {
    let memo = await Memo.findById(req.params.id)
    if (!memo)
      return res.status(404).json({ message: '데이터가 존재하지 않음', success: false })
    res.status(200).json({ message: memo, success: true })
  })

  api.post('/', async (req, res) => {
    let newMemo = new Memo()
    newMemo.img = req.body.img
    newMemo.text = req.body.text
    newMemo.coordinates = req.body.coordinates

    await newMemo.save()
    res.status(200).json({ message: newMemo, success: true })
  })

  api.put('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndUpdate(req.params.id, {
      //수정할 내용
    }, {new: true})
    if (!memo)
      return res.status(404).json({ message: '데이터가 존재하지 않음', success: false })
    res.status(200).json({ message: memo, success: true })
  })

  api.delete('/:id', async (req, res) => {
    let memo = await Memo.findByIdAndDelete(req.params.id)
    if (!memo)
      return res.status(404).json({message: '데이터가 존재하지 않음', success: false })
    res.status(200).json({ message: memo, success: true })
  })

  return api
}
