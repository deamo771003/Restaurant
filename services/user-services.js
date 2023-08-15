const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userService = {
  putSignup: (req, name, email, password, cb) => {
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(password, 10) // 加讓return傳給下個.then使用
      })
      .then(hash =>
        User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name,
          email,
          password: hash
        }))
      .then(() => {
        req.flash('success_message') // 上面都沒錯誤就傳成功flash
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