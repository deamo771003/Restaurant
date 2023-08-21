const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const passport = require('../../config/passport')

// sign in
router.get('/top', userController.getTopUsers)
router.get('/signin', userController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.postSignin)
router.get('/signup', userController.getSignup)
router.put('/signup', userController.putSignup)
router.post('/logout', userController.postLogout)

module.exports = router