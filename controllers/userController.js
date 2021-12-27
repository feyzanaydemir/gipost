const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res, next) => {
  const result = validationResult(req);

  if (result.errors.length > 0) {
    return res.json(result.errors);
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { password, ...other } = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    }).save((err) => {
      if (err) {
        return next(err);
      }
    });

    res.status(201).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = async (req, res) => {
  const result = validationResult(req);

  if (result.errors.length > 0) {
    return res.json(result.errors);
  }

  // If password will be updated
  if (req.body.newPassword) {
    try {
      req.body.password = await bcrypt.hash(req.body.newPassword, 10);
    } catch (err) {
      return res.status(401).json(err);
    }
  }

  try {
    const { password, ...other } = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.newUsername,
          email: req.body.newEmail,
          password: req.body.password,
        },
      },
      { new: true }
    );

    // Update post and comment usernames
    if (req.body.newUsername) {
      await Promis.all([
        Post.updateMany(
          { authorId: req.params.id },
          { authorName: req.body.newUsername }
        ),
        Comment.updateMany(
          { authorId: req.params.id },
          { authorName: req.body.newUsername }
        ),
      ]);
    }

    res.status(201).json(other);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.readUser = async (req, res) => {
  const value = req.query.userId || req.query.username || req.query.searchword;

  switch (value) {
    // Search
    case req.query.searchword:
      try {
        const results = await User.find({
          username: { $regex: `.*${value}`, $options: 'i' },
        })
          .select('username image')
          .limit(20)
          .lean();

        // Get random users
        const suggestions = await User.aggregate([
          { $sample: { size: randomIntFromInterval(2, 10) } },
        ]);

        // Only send usernames and profile images
        for (let elem of suggestions) {
          elem = { username: elem.username, image: elem.image };
        }

        return res.status(200).json({ results, suggestions });
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }

    // Someone's profile page
    case req.query.username:
      try {
        const user = await User.findOne({ username: value }).lean();

        if (!user) {
          return res.json(null);
        }

        const { password, ...other } = user;

        return res.status(200).json(other);
      } catch (err) {
        return res.status(500).json(err);
      }

    // Current user's profile page
    case req.query.userId:
      try {
        const user = await User.findById(value).lean();
        const { password, ...other } = user;

        return res.status(200).json(other);
      } catch (err) {
        return res.status(500).json(err);
      }
  }
};

exports.readFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('following').lean();
    const following = await Promise.all(
      user.following.map((followingId) => {
        return User.findById(followingId).select('_id username image').lean();
      })
    );

    res.status(201).json(following);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id)
      .select('following')
      .lean();

    const [userPosts, feed] = await Promise.all([
      Post.find({ authorId: req.params.id }).limit(20).lean(),
      await Promise.all(
        currentUser.following.map((followingId) => {
          return Post.find({ authorId: followingId }).limit(20).lean();
        })
      ),
    ]);

    res.status(201).json(userPosts.concat(...feed));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readProfile = async (req, res) => {
  try {
    const profilePosts = await Post.find({ authorName: req.params.username })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(201).json(profilePosts);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readSaved = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('saved').lean();
    const savedPosts = await Promise.all(
      user.saved.map((postId) => {
        return Post.findById(postId).limit(20).lean();
      })
    );

    res.status(201).json(savedPosts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update profile description or image
exports.updateProfile = async (req, res) => {
  try {
    if (req.body.image) {
      try {
        await Post.updateMany(
          { authorId: req.params.id },
          { authorImage: req.body.image }
        );
      } catch (err) {
        console.log(err);
      }
    }

    const { password, ...other } = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(201).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.followUser = async (req, res) => {
  try {
    // // Add currentUser's id to userToFollow's followers
    // // Add userToFollow's id to currentUser's followings
    await Promise.all([
      User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.body.userId },
      }),
      User.findByIdAndUpdate(req.body.userId, {
        $push: { following: req.params.id },
      }),
    ]);

    res.status(200).json('Account has been followed.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    // // Add currentUser's id to userToFollow's followers
    // // Add userToFollow's id to currentUser's followings
    await Promise.all([
      User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.body.userId },
      }),
      User.findByIdAndUpdate(req.body.userId, {
        $pull: { following: req.params.id },
      }),
    ]);

    res.status(200).json('Account has been followed.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.savePost = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {
        saved: [...req.body.saved, req.body.postId],
      },
    });

    res.status(200).json('Post saved.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.unsavePost = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {
        saved: req.body.saved.filter((elem) => elem !== req.body.postId),
      },
    });

    res.status(200).json('Post unsaved.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Post.deleteMany({ authorId: req.params.id }),
      Comment.updateMany(
        { authorId: req.params.id },
        { authorName: '[deleted]' }
      ),
    ]);

    res.status(200).json('Account has ben deleted.');
  } catch (err) {
    res.status(500).json(err);
  }
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
