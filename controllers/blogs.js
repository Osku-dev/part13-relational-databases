const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const blogFinder = require('../middleware/blogFinder')
const tokenExtractor = require('../middleware/tokenExtractor')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id})
  res.status(201).json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
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
