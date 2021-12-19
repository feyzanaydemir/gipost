const router = require('express').Router();
const post_controller = require('../controllers/postController');

router.post('/', post_controller.createPost);
router.get('/:id', post_controller.readPost);
router.put('/:id', post_controller.updatePost);
router.delete('/:id', post_controller.deletePost);
router.put('/:id/likes', post_controller.likePost);
router.put('/:id/dislikes', post_controller.dislikePost);
router.get('/:id/comments', post_controller.readComments);

module.exports = router;
