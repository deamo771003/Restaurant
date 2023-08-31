const restaurantServices = require('../services/restaurant-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) => err ? next(err) : res.render('feeds', data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.render('restaurant', data))
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.render('dashboard', data))
  },
  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, data) => err ? next(err) : res.render('top-restaurants', data))
  },
  addFavorite: (req, res, next) => {
    const restaurantId = req.params.restaurantId
    restaurantServices.addFavorite(req, restaurantId, (err, data) => err ? next(err) : res.redirect('back'))
  },
  removeFavorite: (req, res, next) => {
    restaurantServices.removeFavorite(req, (err, data) => err ? next(err) : res.redirect('back'))
  },
  deleteComment: (req, res, next) => {
    restaurantServices.deleteComment(req, (err, data) => err ? next(err) : res.redirect('back'))
  },
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    restaurantServices.postComment(req, restaurantId, text, userId, (err, data) => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  },
  postAddLike: (req, res, next) => {
    const { restaurantId } = req.params
    restaurantServices.postAddLike(req, restaurantId, (err, data) => err ? next(err) : res.redirect('back'))
  },
  deleteLike: (req, res, next) => {
    restaurantServices.deleteLike(req, (err, data) => err ? next(err) : res.redirect('back'))
  }
}

module.exports = restaurantController