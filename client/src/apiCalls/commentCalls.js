import axios from 'axios';

export const getComments = async (post, setComments) => {
  try {
    const res = await axios.get(`/api/posts/${post._id}/comments`);

    setComments(res.data);
  } catch (err) {
    console.log(err);
  }
};

// Get newly submitted comment if there is one
export const getNewComment = async (post, comments, setComments) => {
  try {
    const res = await axios.get(
      `/api/comments/${post.comments[post.comments.length - 1]}`
    );

    // Update comments list with new comment
    setComments([...comments, res.data]);
  } catch (err) {
    console.log(err);
  }
};

export const likeAndDislike = async (user, id, action) => {
  try {
    await axios.put(`/api/comments/${id}/${action}s`, {
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
  }
};

export const newComment = async (user, post, text, setShowComments) => {
  const comment = {
    postId: post._id,
    authorId: user._id,
    authorName: user.username,
    text: text.current.value,
  };

  try {
    const res = await axios.post('/api/comments', comment);
    // Update the original post with new comment
    post.comments.push(res.data._id);
    // Update user with new comment
    await axios.put(`/api/users/${user._id}`, {
      userId: user._id,
      comments: [...user.comments, res.data._id],
    });

    text.current.value = '';

    setShowComments({ clicked: true, newComment: true });

    // const updatedPost = await axios.put(`/api/posts/${post._id}`, post);
    const updatedPost = await axios.put(`/api/posts/${post._id}`, {
      commentId: res.data._id,
    });

    return updatedPost.data;
  } catch (err) {
    console.log(err);
  }
};
