import axios from 'axios';

export const getNewPost = async (user, text, file) => {
  // If both text and file contents of the post
  // is empty, don't create
  if (text.current.value === '' && !file) {
    return null;
  }

  const newPost = {
    authorId: user._id,
    authorName: user.username,
    authorImage: user.image ? user.image : '',
    text: text.current.value,
    media: '',
  };

  // If there is a file upload, attach it to the post
  if (file) {
    const data = new FormData();
    const fileName = Date.now() + file.name;

    // Create a unique name
    data.append('name', fileName);
    data.append('file', file);

    try {
      const imgStr = await axios.post('/api/files/', data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      });

      newPost.media = imgStr.data;
    } catch (err) {
      console.log(err, err.response);
    }
  }

  try {
    const res = await axios.post('/api/posts', newPost);

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const likeAndDislike = async (user, id, action) => {
  try {
    const res = await axios.put(`/api/posts/${id}/${action}s`, {
      userId: user._id,
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (post, posts, setPosts) => {
  try {
    setPosts(posts.filter((elem) => elem?._id !== post?._id));

    await axios.delete(`/api/posts/${post._id}`, { data: post });
  } catch (err) {
    console.log(err);
  }
};
