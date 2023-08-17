const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
  putSignup: (req, name, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(password, 10)
      })
      .then(hash =>
        User.create({
          name,
          email,
          password: hash
        }))
      .then(() => {
        req.flash('success_messages', 'success sign up!') // 
        cb(null, {
          status: 'success'
        })
      })
      .catch(err => {
        cb(err, null);  // 傳遞錯誤到回調
      })
  }
}

module.exports = userService