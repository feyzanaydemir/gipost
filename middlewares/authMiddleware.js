const { check } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const checkSignIn = [
  check('email', 'Incorrect email or password')
    .not()
    .isEmpty()
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .bail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const res = await User.exists({ email: value });

      if (!res) {
        return Promise.reject(new Error(400));
      }
    }),

  check('password', 'Incorrect email or password')
    .custom((value, { req }) => req.body.email !== '')
    .bail()
    .not()
    .isEmpty()
    .bail()
    .custom(async (value, { req }) => {
      const res = await User.findOne({ email: req.body.email })
        .select('password')
        .lean();

      if (!res) {
        return Promise.reject(new Error(400));
      }

      const bool = await bcrypt.compare(value, res.password);

      if (!bool) {
        return Promise.reject(new Error(400));
      }
    })
    .withMessage('Incorrect email or password'),
];

module.exports = { checkSignIn };
