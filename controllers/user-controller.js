const userServices = require('../services/user-services')

const userController = {
  getSignin: (req, res) => {
    try {
      res.render('signin')
    } catch (err) {
      console.log(err)
    }
  },
  postSignin: (req, res) => {
    try {
      req.flash('success_messages', 'Successfully logged in!')
      res.redirect('/restaurants')
    } catch (err) {
      console.log(err)
    }
  },
  getSignup: (req, res) => {
    try {
      res.render('signup')
    } catch (err) {
      console.log(err)
    }
  },
  putSignup: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match.')
    userServices.putSignup(req, name, email, password, (err, data) => err ? next(err) : res.redirect('/users/signin'))
  },
  postLogout: (req, res, next) => {
    req.logout()
    req.flash('success_messages', 'Success logout!')
    res.redirect('/users/signin')
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.render('top-users', data))
  }
}

module.exports = userController