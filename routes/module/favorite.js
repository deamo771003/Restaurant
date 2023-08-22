const express = require('express')
const router = express.Router()
const favoriteController = require('../../controllers/favorite-controller')

router.post('/:restaurantId', favoriteController.addFavorite)
router.delete('/:restaurantId', favoriteController.removeFavorite)

module.exports = router