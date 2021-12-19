const { body, check } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const checkSignUp = [
  check('username')
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3, max: 12 })
    .withMessage('Between 3 and 12 characters')
    .bail()
    .custom((value) => !/\s/.test(value))
    .withMessage('No space')
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .custom(async (value, { req }) => {
      const res = await User.exists({ username: value });

      if (res) {
        return Promise.reject(new Error(400));
      }
    })
    .withMessage('This username is already taken'),

  check('email')
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email format')
    .bail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const res = await User.exists({ email: value });

      if (res) {
        return Promise.reject(new Error(400));
      }
    })
    .withMessage('This email is already taken'),

  check(
    'password',
    'Between 8 and 20 characters,Minimum 1 lowercase letter,Minimum 1 uppercase letter,Minimum 1 digit'
  )
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .isLength({ min: 8, max: 20 })
    .bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i'),
];

const checkUpdate = [
  check('newUsername')
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .trim()
    .escape()
    .isLength({ min: 3, max: 12 })
    .withMessage('Minimum 3 characters, Maximum 12 characters')
    .bail()
    .matches(/^[A-Za-z0-9 .,'!&]+$/)
    .custom(async (value, { req }) => {
      if (value !== req.body.username) {
        const res = await User.exists({ username: value });

        if (res) {
          return Promise.reject(new Error(400));
        }
      }
    })
    .withMessage('This username is already taken'),

  check('newEmail')
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email format')
    .bail()
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (value !== req.body.email) {
        const res = await User.exists({ email: value });

        if (res) {
          return Promise.reject(new Error(400));
        }
      }
    })
    .withMessage('This email is already taken'),

  check('currentPassword')
    .optional({ checkFalsy: true })
    .custom(async (value, { req }) => {
      const bool = await bcrypt.compare(value, req.body.password);

      if (!bool) {
        return Promise.reject(new Error(400));
      }
    })
    .withMessage('Incorrect password'),

  check(
    'newPassword',
    'Minimum 8 characters,Maximum 20 characters,Minimum 1 lowercase letter,Minimum 1 uppercase letter,Minimum 1 digit'
  )
    .if(body('currentPassword').not().isEmpty())
    .not()
    .isEmpty()
    .withMessage('Required')
    .bail()
    .isLength({ min: 8, max: 25 })
    .bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
    .bail()
    .custom(async (value, { req }) => {
      const bool = await bcrypt.compare(value, req.body.password);

      if (bool) {
        return Promise.reject(new Error(400));
      }
    })
    .withMessage('Your new passport must be different than your current one'),
];

module.exports = { checkSignUp, checkUpdate };
