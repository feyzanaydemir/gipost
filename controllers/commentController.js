const Comment = require('../models/Comment');

exports.readComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).lean();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createComment = async (req, res) => {
  const newComment = new Comment(req.body);

  try {
    await newComment.save((err, comment) => {
      if (err) {
        res.send(err);
      }

      res.status(201).json(comment);
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment.likes.includes(req.body.userId)) {
      if (comment.dislikes.includes(req.body.userId)) {
        await comment.updateOne({ $pull: { dislikes: req.body.userId } });
      }

      await comment.updateOne({ $push: { likes: req.body.userId } });

      return res.status(200).json('Comment has been liked.');
    }

    await comment.updateOne({ $pull: { likes: req.body.userId } });

    res.status(200).json('Like has been removed.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment.dislikes.includes(req.body.userId)) {
      if (comment.likes.includes(req.body.userId)) {
        await comment.updateOne({ $pull: { likes: req.body.userId } });
      }

      await comment.updateOne({ $push: { dislikes: req.body.userId } });

      return res.status(200).json('Comment has been disliked.');
    }

    await comment.updateOne({ $pull: { dislikes: req.body.userId } });

    res.status(200).json('Dislike has been removed.');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json('Comment has been deleted.');
  } catch (err) {
    res.status(500).json(err);
  }
};
