const commentService = require('../services/comment-services')

const commentController = {
  deleteComment: (req, res, next) => {
    commentService.deleteComment(req, (err, data) => err ? next(err) : res.redirect(`/restaurants/${deletedComment.restaurantId}`))
  },
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is required!')
    commentService.postComment(req, restaurantId, text, userId, (err, data) => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  }
}

module.exports = commentController