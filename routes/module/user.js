const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const passport = require('../../config/passport')
const upload = require('../../middleware/multer')
const { authenticated } = require('../../middleware/auth')

router.post('/following/:userId', authenticated, userController.postAddFollowing)
router.delete('/following/:userId', authenticated, userController.deleteFollowing)
router.get('/:id/edit', authenticated, userController.getEditUser)
router.get('/top', authenticated, userController.getTopUsers)
router.get('/signin', userController.getSignin)
router.post('/signin',
  passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.postSignin)
router.get('/signup', userController.getSignup)
router.put('/signup', userController.putSignup)
router.post('/logout', authenticated, userController.postLogout)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, upload.single('image'), userController.putUser)

module.exports = router