const router = require('express').Router();
const comment_controller = require('../controllers/commentController');

router.post('/', comment_controller.createComment);
router.get('/:id', comment_controller.readComment);
router.delete('/:id', comment_controller.deleteComment);
router.put('/:id/likes', comment_controller.likeComment);
router.put('/:id/dislikes', comment_controller.dislikeComment);

module.exports = router;
