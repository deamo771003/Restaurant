const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

// sign in
router.get('/signin', userController.getSignin)
router.get('/signup', userController.getSignup)
router.put('/signup', userController.putSignup)

module.exports = router