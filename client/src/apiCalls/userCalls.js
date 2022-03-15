import axios from 'axios';

export const getFeed = async (user, redirect) => {
  try {
    const res = await axios.get(`/api/users/${user._id}/feed`);
    res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.data;
  } catch (err) {
    redirect();
  }
};

export const getProfile = async (username, redirect) => {
  try {
    const res = await axios.get(`/api/users/${username}/profile`);

    return res.data;
  } catch (err) {
    redirect();
  }
};

export const getSaved = async (user, redirect) => {
  try {
    const res = await axios.get(`/api/users/${user._id}/saved`);

    return res.data;
  } catch (err) {
    redirect();
  }
};

export const signUp = async (user) => {
  try {
    const res = await axios.post('/api/users/', user);

    // Response will be an array of errors
    // if authentication fails
    if (Array.isArray(res.data)) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};

export const savePost = async (user, post, dispatch) => {
  try {
    await axios.post(`/api/users/${user._id}/saved`, {
      saved: user.saved,
      postId: post._id,
    });

    dispatch({ type: 'SAVE', payload: post._id });
  } catch (err) {
    console.log(err);
  }
};

export const unsavePost = async (user, post, dispatch) => {
  try {
    await fetch(`/api/users/${user._id}/saved`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({ saved: user.saved, postId: post._id }),
    });

    dispatch({ type: 'UNSAVE', payload: post._id });
  } catch (err) {
    console.log(err);
  }
};

export const updateDescription = async (user, description) => {
  try {
    await axios.put(`/api/users/${user._id}/profile`, { description });
  } catch (err) {
    console.log(err);
  }
};

export const updateImage = async (user, file, dispatch) => {
  // If there is a file, attach it to post
  if (file) {
    const data = new FormData();
    const fileName = Date.now() + file.name;

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

      await axios.put(
        `/api/users/${user._id}/profile`,
        { image: imgStr.data },
        { withCredentials: true }
      );

      dispatch({ type: 'UPDATE_IMAGE', payload: imgStr.data });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
};

export const followOrUnfollow = async (currentUser, user, dispatch) => {
  if (currentUser.following.includes(user._id)) {
    try {
      await axios.delete(
        `/api/users/${currentUser._id}/following/${user._id}`,
        {
          data: { userId: currentUser._id },
        }
      );

      dispatch({ type: 'UNFOLLOW', payload: user._id });
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      await axios.post(`/api/users/${currentUser._id}/following/${user._id}`, {
        userId: currentUser._id,
      });

      dispatch({ type: 'FOLLOW', payload: user._id });
    } catch (err) {
      console.log(err);
    }
  }
};

export const updateAccount = async (user, dispatch) => {
  try {
    const res = await axios.put(`/api/users/${user._id}`, user);

    // Response will be an array of errors
    // if authentication fails
    if (Array.isArray(res.data)) {
      return res.data;
    }

    dispatch({ type: 'UPDATE_ACCOUNT_SUCCESS', payload: res.data._doc });
  } catch (err) {
    dispatch({ type: 'UPDATE_ACCOUNT_FAILURE', payload: err });
  }
};

export const deleteAccount = async (user, dispatch) => {
  try {
    await axios.delete(`/api/users/${user._id}`, {
      headers: { 'Content-Type': 'application/json' },
      data: { user },
    });

    dispatch({ type: 'DELETE_ACCOUNT_SUCCESS' });
  } catch (err) {
    dispatch({ type: 'DELETE_ACCOUNT_FAILURE', payload: err });
  }
};
