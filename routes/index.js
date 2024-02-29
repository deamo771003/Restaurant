const express = require('express')
const router = express.Router()
const restaurants = require('./module/restaurant')
const users = require('./module/user')
const admin = require('./module/admin')
// const auth = require('./module/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/restaurants', authenticated, restaurants)
router.use('/users', users)
// router.use('/auth', auth)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router