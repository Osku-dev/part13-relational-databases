const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: { username }
  })

  const passwordCorrect = password === 'secret'

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(403).json({
      error: 'user account disabled'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({ token, user_id: user.id })

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router