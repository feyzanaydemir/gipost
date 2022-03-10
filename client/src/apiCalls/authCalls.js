import axios from 'axios';

export const signIn = async (credentials, dispatch) => {
  try {
    const currUserRes = await axios.post('/api/auth/', {
      email: credentials.email,
      password: credentials.password,
    });

    // Response will be an array of errors
    // if authentication fails
    if (Array.isArray(currUserRes.data)) {
      return currUserRes.data;
    }

    const { password, ...currUser } = currUserRes.data;

    dispatch({ type: 'SIGN_IN_SUCCESS', payload: currUser });
  } catch (err) {
    dispatch({ type: 'SIGN_IN_FAILURE', payload: err });
  }
};

export const signOut = async (dispatch) => {
  await axios.delete('/api/auth/', { withCredentials: true });

  dispatch({ type: 'SIGN_OUT' });
};
