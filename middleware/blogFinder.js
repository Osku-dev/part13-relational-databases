const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    req.blog = blog
    next()
  } else {
    res.status(404).json({ error: 'Blog not found' })
  }
}

module.exports = blogFinder
