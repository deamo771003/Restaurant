const { Restaurant, Category, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants(req, cb) {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, {
        restaurants
      })
      )
      .catch(err => {
        cb(err, null)
      })
  },
  getCreateRestaurant(req, cb) {
    return Category.findAll({
      raw: true
    })
      .then(categories => {
        cb(null, {
          categories
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  postCreateRestaurant(req, name, tel, address, openingHours, description, categoryId, file, cb) {
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(() => cb(null, {
        status: 'success'
      }))
      .catch(err => {
        cb(err, null)
      })
  },
  deleteRestaurant(req, cb) {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(() => cb(null, {
        status: 'success'
      }))
      .catch(err => {
        cb(err, null)
      })
  },
  getEditRestaurant(req, cb) {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        cb(null, { restaurant, categories })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  putRestaurant(req, file, name, tel, address, openingHours, description, categoryId, cb) {
    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(editRestaurant => cb(null, { restaurant: editRestaurant }))
      .catch(err => cb(err))
  },
  getUsers(req, cb) {
    return User.findAll({
      raw: true
    })
      .then(users => {
        cb(null, {
          users
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  patchUserRole(req, cb) {
    return User.findByPk(req.params.id)
      .then(User => {
        if (!User) throw new Error("User didn't exist!")
        if (User.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        return User.update({ is_admin: !User.is_admin })
      })
      .then((users) => {
        cb(null, {
          users
        })
      })
      .catch(err => {
        cb(err, null)
      })
  }
}
module.exports = adminServices
