const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const passport = require('../../config/passport')
const upload = require('../../middleware/multer')

router.post('/following/:userId', userController.postAddFollowing)
router.delete('/following/:userId', userController.deleteFollowing)
router.get('/:id/edit', userController.getEditUser)
router.get('/top', userController.getTopUsers)
router.get('/signin', userController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/users/signin', failureFlash: true }), userController.postSignin)
router.get('/signup', userController.getSignup)
router.put('/signup', userController.putSignup)
router.post('/logout', userController.postLogout)
router.get('/:id', userController.getUser)
router.put('/:id', upload.single('image'), userController.putUser)

module.exports = router