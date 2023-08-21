const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment-controller')

router.delete('/:id', commentController.deleteComment)
router.post('/', commentController.postComment)

module.exports = router