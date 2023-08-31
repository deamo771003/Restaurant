const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/:id/edit', adminController.getEditRestaurant)
router.get('/restaurants/create', adminController.getCreateRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.patch('/users/:id', adminController.patchUserRole)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postCreateRestaurant)
router.get('/users', adminController.getUsers)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
