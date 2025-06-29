const router = require('express').Router()
const { Blog } = require('../models')
const blogFinder = require('../middleware/blogFinder')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.status(201).json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router
