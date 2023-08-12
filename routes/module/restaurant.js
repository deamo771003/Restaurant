const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurant-controller')

router.get('/', restaurantController.getRestaurants)

module.exports = router