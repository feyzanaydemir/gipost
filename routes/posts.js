const router = require('express').Router();
const post_controller = require('../controllers/postController');

router.post('/', post_controller.createPost);
router.get('/:id', post_controller.readPost);
router.put('/:id', post_controller.updatePost);
router.delete('/:id', post_controller.deletePost);
router.put('/:id/likes', post_controller.likePost);
router.put('/:id/dislikes', post_controller.dislikePost);
router.get('/feed/:userId', post_controller.readFeed);
router.get('/profile/:username', post_controller.readHistory);

module.exports = router;
