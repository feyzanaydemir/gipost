import React, { useRef, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../apiCalls/authCalls';
import { signUp } from '../apiCalls/userCalls';
import { Context } from '../context/Context';
import { CircularProgress } from '@mui/material';
import '../assets/styles/SignUp.css';

function SignUp() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const { dispatch } = useContext(Context);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    setIsFetching(true);
    const errors = await signUp(user, dispatch);

    if (errors) {
      setIsFetching(false);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);

      await signIn({ email: user.email, password: user.password }, dispatch);
      setIsFetching(false);
    }
  };

  const Validation = ({ type }) => {
    return (
      <ul className="sign-up-validation">
        {validationErrors.length > 0 && !isFetching
          ? validationErrors.map((error) =>
              error.param === type ? (
                error.param === 'password' || error.param === 'username' ? (
                  error.msg
                    .split(',')
                    .map((err) => <li key={1 + Math.random()}>{'● ' + err}</li>)
                ) : (
                  <li key={1 + Math.random()}>{'● ' + error.msg}</li>
                )
              ) : null
            )
          : null}
      </ul>
    );
  };

  return (
    <div className="sign-up">
      <div className="sign-up-banner"></div>
      <div className="sign-up-left">
        <h1>GIPOST</h1>
        <h2>
          “Art washes away from the soul the dust of everyday life” ~ Picasso
        </h2>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          ref={username}
        ></input>
        <Validation type="username" />
        <label htmlFor="email">EMAIL</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          ref={email}
        ></input>
        <Validation type="email" />
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="off"
          ref={password}
        ></input>
        <Validation type="password" />
        <button type="submit">Sign Up</button>
        {isFetching ? (
          <CircularProgress color="primary" className="loading" />
        ) : null}
        <span>Already have an account?</span>
        <Link to="/signin">
          <button type="button">Sign In</button>
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
