import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { signIn } from '../apiCalls/authCalls';
import { CircularProgress } from '@mui/material';
import '../assets/styles/SignIn.css';

function SignIn() {
  const { dispatch } = useContext(Context);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const email = useRef();
  const password = useRef();

  const handleSubmit = async (type, e) => {
    e.preventDefault();
    setIsFetching(true);

    const errors =
      type === 'guest'
        ? await signIn({ isGuest: true }, dispatch)
        : await signIn(
            { email: email.current.value, password: password.current.value },
            dispatch
          );

    setIsFetching(false);

    if (errors) {
      setValidationErrors(errors);
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in-banner"></div>
      <div className="sign-in-left">
        <h1>GIPOST</h1>
        <h2>
          “Art washes away from the soul the dust of everyday life” ~ Picasso
        </h2>
      </div>
      <form onSubmit={(e) => handleSubmit('user', e)} noValidate>
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="on"
          ref={email}
        ></input>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="off"
          ref={password}
        ></input>
        <ul className="sign-in-validation">
          {validationErrors.length > 0 && !isFetching
            ? validationErrors.map((error, index) =>
                error.param === 'password' ? (
                  <li key={index}>{'● ' + error.msg}</li>
                ) : null
              )
            : null}
        </ul>
        <button type="submit">Sign In</button>
        {isFetching ? <CircularProgress color="primary" /> : null}
        <span>Don't have an account?</span>
        <Link to="/signup">
          <button className="sign-up-button" type="button">
            Sign Up
          </button>
        </Link>
        <button onClick={(e) => handleSubmit('guest', e)}>
          Continue as a Guest
        </button>
      </form>
    </div>
  );
}

export default SignIn;
