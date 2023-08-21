const { Comment, User, Restaurant } = require('../models')

const commentService = {
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
  }
}

module.exports = commentService
