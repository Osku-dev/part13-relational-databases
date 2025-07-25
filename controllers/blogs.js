const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const blogFinder = require('../middleware/blogFinder')
const tokenExtractor = require('../middleware/tokenExtractor')
const sessionValidator = require('../middleware/sessionValidator')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    where,
    include: {
      model: User
    },
    order: [['likes', 'DESC']] 
  })

  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.post('/', tokenExtractor, sessionValidator, async (req, res) => {
  const blog = await Blog.create({...req.body, userId: req.user.id})
  res.status(201).json(blog)
})

router.put('/:id', blogFinder, tokenExtractor, sessionValidator, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, sessionValidator, blogFinder, async (req, res) => {
  const blog = req.blog
  const tokenUserId = req.decodedToken.id

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

 if (!blog.userId || blog.userId.toString() !== tokenUserId.toString()) {
  return res.status(403).json({ error: 'unauthorized: you can only delete your own blogs' })
}

  await blog.destroy()
  res.status(204).end()
})

module.exports = router
