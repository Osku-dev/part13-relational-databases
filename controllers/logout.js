const router = require('express').Router()
const tokenExtractor = require('../middleware/tokenExtractor')
const sessionValidator = require('../middleware/sessionValidator')

router.delete('/', tokenExtractor, sessionValidator, async (req, res) => {
  
  await req.session.destroy()
  res.status(204).end() 
})


module.exports = router