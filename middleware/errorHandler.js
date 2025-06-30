const { ValidationError } = require('sequelize')

const errorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.errors.map(e => e.message) })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Database error: ' + error.message })
  }

  console.error(error)

  res.status(500).json({ error: 'Internal server error' })
}

module.exports = errorHandler
