const express = require('express');
const commentRoute = express.Router();
const {addComment, getComment, deleteComment, unlikePost, likePost} = require('../controllers/commentController')

commentRoute.post('/add', addComment)
commentRoute.post('/like', likePost)
commentRoute.patch('/unlike', unlikePost)
commentRoute.get('/get', getComment)
commentRoute.delete('/delete', deleteComment)

module.exports = commentRoute