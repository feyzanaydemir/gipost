const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.readComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('comments').lean();
    const comments = await Promise.all(
      post.comments.map((commentId) => {
        return Comment.findById(commentId).limit(20).lean();
      })
    );

    res.status(201).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: req.body.commentId } },
      { new: true }
    );

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    newPost.save((err) => {
      if (err) {
        return next(err);
      }
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.likePost = async (req, res) => {
  try {
    let updatedPost;
    const post = await Post.findById(req.params.id)
      .select('likes dislikes')
      .lean();

    if (!post.likes.includes(req.body.userId)) {
      if (post.dislikes.includes(req.body.userId)) {
        await Post.findByIdAndUpdate(req.params.id, {
          $pull: { dislikes: req.body.userId },
        });
      }

      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: req.body.userId } },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.body.userId } },
        { new: true }
      );
    }

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.dislikePost = async (req, res) => {
  try {
    let updatedPost;
    const post = await Post.findById(req.params.id)
      .select('likes dislikes')
      .lean();

    if (!post.dislikes.includes(req.body.userId)) {
      if (post.likes.includes(req.body.userId)) {
        await Post.findByIdAndUpdate(req.params.id, {
          $pull: { likes: req.body.userId },
        });
      }

      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { dislikes: req.body.userId } },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { dislikes: req.body.userId } },
        { new: true }
      );
    }

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json('Post has been deleted.');
  } catch (err) {
    res.status(500).json(err);
  }
};
