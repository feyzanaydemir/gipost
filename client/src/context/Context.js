import { createContext, useReducer } from 'react';
import Reducer from './Reducer';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    user: sessionStorage.getItem('gipostud')
      ? JSON.parse(sessionStorage.getItem('gipostud'))
      : null,
    isFetching: false,
    error: false,
  };
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  return (
    <Context.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
