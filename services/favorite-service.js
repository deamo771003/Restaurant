const { Restaurant, Favorite } = require('../models')

const favoriteService = {
  addFavorite: (req, restaurantId, cb) => {
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({
          userId: req.user.id,
          restaurantId: restaurantId
        })
      })
      .then(() => {
        cb(null, {
          status: 'success'
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => {
        cb(null, {
          status: 'success'
        })
      })
      .catch(err => {
        cb(err, null)
      })
  }
}

module.exports = favoriteService