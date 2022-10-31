const { validationResult } = require('express-validator');
const passport = require('passport');

exports.signIn = async (req, res, next) => {
  if (!req.body.isGuest) {
    const result = validationResult(req);

    if (result.errors.length > 0) {
      return res.json(result.errors);
    }
  } else {
    req.body = {
      email: process.env.GUEST_EMAIL,
      password: process.env.GUEST_PASSWORD,
    };
  }

  try {
    await passport.authenticate('local', { session: true }, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect('/auth');
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        req.user = user;
        res.status(200).json(user);
        next();
      });
    })(req, res, next);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.signOut = (req, res) => {
  try {
    req.logout();
    res.status(200).json('Sign out successful.');
  } catch (err) {
    res.status(500).json(err);
  }
};
