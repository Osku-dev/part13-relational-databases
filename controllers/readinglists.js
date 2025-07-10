const router = require('express').Router()
const { ReadingList } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')

router.put('/:id', tokenExtractor, async (req, res) => {
  
  const { read } = req.body
  const userId = req.decodedToken.id

  const entry = await ReadingList.findByPk(req.params.id)

  if (!entry) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  if (entry.userId !== userId) {
    return res.status(403).json({ error: 'Not authorized to update this reading list entry' })
  }

  entry.read = read
  await entry.save()

  res.json(entry)
})


router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const newEntry = await ReadingList.create({
    userId,
    blogId,
  })

  res.status(201).json(newEntry)
})


module.exports = router
