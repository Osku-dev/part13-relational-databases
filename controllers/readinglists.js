const router = require('express').Router()
const { ReadingList } = require('../models')


router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const newEntry = await ReadingList.create({
    userId,
    blogId,
  })

  res.status(201).json(newEntry)
})


module.exports = router
