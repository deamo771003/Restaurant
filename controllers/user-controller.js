const userServices = require('../services/user-services')

const userController = {
  getSignin: (req, res) => {
    try {
      res.render('signin')
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
    if (password !== passwordCheck) {
      const err = new Error('Passwords do not match.')
      return next(err)
    }
    userServices.putSignup(req, name, email, password, (err, data) => err ? next(err) : res.redirect('/users/signin'))
  }
}

module.exports = userController