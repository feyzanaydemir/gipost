const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 300,
    },
    media: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
