const router = require('express').Router();
const user_controller = require('../controllers/userController');
const { checkUpdate, checkSignUp } = require('../middlewares/userMiddleware');

router.get('/', user_controller.readUser);
router.post('/', checkSignUp, user_controller.createUser);
router.put('/:id', checkUpdate, user_controller.updateUser);
router.put('/:id/profile', user_controller.updateProfile);
router.delete('/:id', user_controller.deleteUser);
router.get('/:id/following', user_controller.readFollowing);
router.post('/:userId/following/:id', user_controller.followUser);
router.delete('/:userId/following/:id', user_controller.unfollowUser);
router.post('/:id/saved', user_controller.savePost);
router.delete('/:id/saved', user_controller.unsavePost);
router.get('/all', user_controller.readAll);

module.exports = router;
