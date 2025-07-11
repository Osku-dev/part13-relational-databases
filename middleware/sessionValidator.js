const { Session, User } = require('../models')

const sessionValidator = async (req, res, next) => {
  const token = req.get('authorization').substring(7)
  const decoded = req.decodedToken

  const session = await Session.findOne({ where: { token } })
  if (!session) {
    return res.status(401).json({ error: 'session expired or invalid' })
  }

  const user = await User.findByPk(decoded.id)
  if (!user || user.disabled) {
    return res.status(401).json({ error: 'account disabled or invalid' })
  }

  req.user = user
  req.session = session
  next()
}

module.exports = sessionValidator
