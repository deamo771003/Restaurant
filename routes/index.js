const express = require('express')
const router = express.Router()
const restaurants = require('./module/restaurant')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/restaurants', restaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router