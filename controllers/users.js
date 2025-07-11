const router = require('express').Router()
const { User } = require('../models')
const { Blog } = require('../models')
const tokenExtractor = require('../middleware/tokenExtractor')
const sessionValidator = require('../middleware/sessionValidator')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', tokenExtractor, sessionValidator, async (req, res) => {
  const { username: paramUsername } = req.params
  const { username: newUsername } = req.body

  if (req.user.username !== paramUsername) {
    return res.status(403).json({ error: 'You can only update your own username' })
  }

  if (newUsername) {
    req.user.username = newUsername
    await req.user.save()
  }

  res.json(req.user)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read === 'true') {
    where.read = true
  } else if (req.query.read === 'false') {
    where.read = false
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['id', 'name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: ['id', 'read'],
          where 
        }
      }
    ]
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

module.exports = router
