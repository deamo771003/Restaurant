const express = require('express')
const router = express.Router()
const restaurants = require('./module/restaurant')
const users = require('./module/user')
const comment = require('./module/comment')
const favorite = require('./module/favorite')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/favorites', authenticated, favorite)
router.use('/comments', authenticated, comment)
router.use('/restaurants', authenticated, restaurants)
router.use('/users', users)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router