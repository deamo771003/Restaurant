const adminServices = require('../services/admin-services')
const { imgurFileHandler } = require('../middleware/multer')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },
  getCreateRestaurant: (req, res, next) => {
    adminServices.getCreateRestaurant(req, (err, data) => err ? next(err) : res.render('admin/create-restaurant', data))
  },
  postCreateRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    adminServices.postCreateRestaurant(req, name, tel, address, openingHours, description, categoryId, file, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created.')
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully deleted.')
      return res.redirect('back')
    })
  },
  getEditRestaurant: (req, res, next) => {
    adminServices.getEditRestaurant(req, (err, data) => err ? next(err) : res.render('admin/edit-restaurant', data))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    adminServices.putRestaurant(req, file, name, tel, address, openingHours, description, categoryId, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully edit')
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.render('admin/users', data))
  },
  patchUserRole: (req, res, next) => {
    adminServices.patchUserRole(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('back')
    })
  },
  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.render('admin/categories', data))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    adminServices.postCategory(req, name, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'categories was successfully created')
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    adminServices.putCategory(req, name, (err, data) => {
      if (err) return next(err)
      req.flash('success_message', 'categories was successfully edit')
      res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    adminServices.deleteCategory(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/admin/categories')
    })
  }
}
module.exports = adminController
