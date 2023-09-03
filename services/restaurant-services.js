const { Restaurant, Category, User, Comment, Favorite, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')

const restaurantController = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getFeeds: (req, cb) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        cb(null, {
          restaurants,
          comments
        })
      })
  },
  getRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('view_count')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)

        cb(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
  },
  getDashboard: (req, cb) => {
    Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Comment.count({ where: { restaurant_id: req.params.id } }),
      Favorite.count({ where: { restaurant_id: req.params.id } })
    ])
      .then(([restaurant, commentCount, favoriteCount]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, {
          restaurant,
          commentCount,
          favoriteCount
        })
      })
  },
  getTopRestaurants: (req, cb) => {
    return Restaurant.findAll({
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        cb(null, {
          restaurants: result
        })
      })
      .catch(err => cb(err, null))
  },
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
  },
  deleteComment: (req, cb) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => {
        cb(null, {
          deletedComment
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  postComment: (req, restaurantId, text, userId, cb) => {
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Comment.create({
          text,
          restaurantId,
          userId
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
  postAddLike: (req, restaurantId, cb) => {
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Like.create({
          userId: req.user.id,
          restaurantId
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
  deleteLike: (req, cb) => {
    return Like.findOne({
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
  },
  getSearch(req, keyword, sortData, sortSelect, cb) {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    let whereCondition = categoryId ? { categoryId } : {}
    if (keyword) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          {
            name: {
              [Op.like]: '%' + keyword + '%'
            }
          },
          {
            '$Category.name$': {
              [Op.like]: '%' + keyword + '%'
            }
          }
        ]
      }
    }
    Promise.all([
      Restaurant.findAndCountAll({
        include: [
          {
            model: Category,
            required: false
          }
        ],
        where: whereCondition,
        limit,
        offset,
        order: sortData,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        cb(null, {
          restaurants: data,
          categories,
          categoryId,
          keyword,
          sortSelect,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => {
        cb(err, null)
      })
  }
}

module.exports = restaurantController