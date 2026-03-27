const express = require('express');
const postsController = require('../controllers/postsController');
const { identifier } = require('../middlewares/identification');
const router = express.Router();

router.get('/all-posts', postsController.getPosts);
router.get('/search', postsController.searchpost);
router.get('/single-post', postsController.singlePost);
router.post('/create-post', postsController.createPost);
router.post('/like-post', postsController.likePost);
router.patch('/unlike-post', postsController.unlikePost);

router.put('/update-post', identifier, postsController.updatePost);
router.delete('/delete-post', postsController.deletePost);

module.exports = router;