const auth_controller = require('../controllers/authController');
const { checkSignIn } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/', checkSignIn, auth_controller.signIn);
router.delete('/', auth_controller.signOut);

module.exports = router;
