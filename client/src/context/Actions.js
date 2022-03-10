export const SignInSuccess = (user) => ({
  type: 'SIGN_IN_SUCCESS',
  payload: user,
});

export const SignInFailure = (err) => ({
  type: 'SIGN_IN_FAILURE',
  payload: err,
});

export const SignOut = () => ({
  type: 'SIGN_OUT',
});

export const UpdateAccountSuccess = (user) => ({
  type: 'UPDATE_ACCOUNT_SUCCESS',
  payload: user,
});

export const UpdateAccountFailure = (err) => ({
  type: 'UPDATE_ACCOUNT_FAILURE',
  payload: err,
});

export const DeleteAccountSuccess = () => ({
  type: 'DELETE_ACCOUNT_SUCCESS',
});

export const DeleteAccountFailure = (err) => ({
  type: 'DELETE_ACCOUNT_FAILURE',
  payload: err,
});

export const Follow = (userId) => ({
  type: 'FOLLOW',
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: 'UNFOLLOW',
  payload: userId,
});

export const Save = (postId) => ({
  type: 'SAVE',
  payload: postId,
});

export const Unsave = (postId) => ({
  type: 'UNSAVE',
  payload: postId,
});

export const UpdateImage = (image) => ({
  type: 'UPDATE_IMAGE',
  payload: image,
});
