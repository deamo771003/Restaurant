const { User, Comment, Restaurant } = require('../models')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
        req.flash('success_messages', 'success sign up!')
        cb(null, {
          status: 'success'
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  getTopUsers: (req, cb) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        cb(null, {
          users: result
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User does not exist.')
        cb(null, {
          user: user.toJSON()
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  getEditUser(req, cb) {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('User does not exist.')
        cb(null, {
          user
        })
      })
      .catch(err => {
        cb(err, null)
      })
  },
  putUser(req, name, file, cb) {
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist.')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'User data edited successfully.')
        cb(null, {
          status: 'success'
        })
      })
      .catch(err => {
        cb(err, null)
      })
  }
}

module.exports = userService