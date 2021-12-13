const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 250,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', PostSchema);
