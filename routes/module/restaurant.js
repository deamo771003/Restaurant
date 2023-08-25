const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurant-controller')

router.delete('/comment/:id', restaurantController.deleteComment)
router.post('/comment', restaurantController.postComment)
router.post('/favorite/:restaurantId', restaurantController.addFavorite)
router.delete('/favorite/:restaurantId', restaurantController.removeFavorite)
router.post('/like/:restaurantId', restaurantController.postAddLike)
router.delete('/like/:restaurantId', restaurantController.deleteLike)
router.get('/top', restaurantController.getTopRestaurants)
router.get('/:id/dashboard', restaurantController.getDashboard)
router.get('/feeds', restaurantController.getFeeds)
router.get('/:id', restaurantController.getRestaurant)
router.get('/', restaurantController.getRestaurants)


module.exports = router