const favoriteService = require('../services/favorite-service')

const favoriteController = {
  addFavorite: (req, res, next) => {
    const restaurantId = req.params.restaurantId
    favoriteService.addFavorite(req, restaurantId, (err, data) => err ? next(err) : res.redirect('back'))
  },
  removeFavorite: (req, res, next) => {
    favoriteService.removeFavorite(req, (err, data) => err ? next(err) : res.redirect('back'))
  }
}

module.exports = favoriteController