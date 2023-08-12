const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  // Restaurants
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 抓出網址?後的參數(篩選用)
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
        // 多對多關系data資訊從passport抓取，並用req.user取出
        const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : [] // req.user是否存在? 存在的話 FavoritedRestaurants是否存在? 存在跑 map 不存在 []
        const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
        const data = restaurants.rows.map(r => ({ // 重新整理資料匯入data
          ...r,
          description: r.description.substring(0, 50), // description前50個字
          isFavorited: favoritedRestaurantsId.includes(r.id), // 關聯的isFavorited
          isLiked: likedRestaurantsId.includes(r.id) // 關聯的isLiked
        }))
        cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  }
}

module.exports = restaurantController