const express = require('express')
const router = express.Router()
const restaurants = require('./module/restaurant')

router.use('/restaurants', restaurants)

router.get('/', (req, res) => {
  res.send('Hello world!')
})

module.exports = router