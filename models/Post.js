const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
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

PostSchema.index({ authorId: 1 });
PostSchema.index({ authorName: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
