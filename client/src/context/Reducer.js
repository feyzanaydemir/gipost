const Reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_IN_SUCCESS':
      sessionStorage.setItem('gipostud', JSON.stringify(action.payload));

      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case 'SIGN_IN_FAILURE':
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };

    case 'SIGN_OUT':
      sessionStorage.clear();

      return {
        user: null,
        isFetching: false,
        error: false,
      };

    case 'UPDATE_ACCOUNT_SUCCESS':
      sessionStorage.setItem('gipostud', JSON.stringify(action.payload));

      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case 'UPDATE_ACCOUNT_FAILURE':
      return {
        user: state.user,
        isFetching: false,
        error: action.payload,
      };

    case 'DELETE_ACCOUNT_SUCCESS':
      sessionStorage.clear();

      return {
        user: null,
        isFetching: false,
        error: false,
      };

    case 'DELETE_ACCOUNT_FAILURE':
      return {
        user: state.user,
        isFetching: false,
        error: action.payload,
      };

    case 'FOLLOW':
      sessionStorage.setItem(
        'gipostud',
        JSON.stringify({
          ...state.user,
          following: [...state.user.following, action.payload],
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };

    case 'UNFOLLOW':
      sessionStorage.setItem(
        'gipostud',
        JSON.stringify({
          ...state.user,
          following: state.user.following.filter(
            (person) => person !== action.payload
          ),
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter(
            (person) => person !== action.payload
          ),
        },
      };

    case 'SAVE':
      sessionStorage.setItem(
        'gipostud',
        JSON.stringify({
          ...state.user,
          saved: [...state.user.saved, action.payload],
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          saved: [...state.user.saved, action.payload],
        },
      };

    case 'UNSAVE':
      sessionStorage.setItem(
        'gipostud',
        JSON.stringify({
          ...state.user,
          saved: state.user.saved.filter((postId) => postId !== action.payload),
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          saved: state.user.saved.filter((postId) => postId !== action.payload),
        },
      };

    case 'UPDATE_IMAGE':
      sessionStorage.setItem(
        'gipostud',
        JSON.stringify({
          ...state.user,
          image: action.payload,
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          image: action.payload,
        },
      };

    default:
      return state;
  }
};

export default Reducer;
