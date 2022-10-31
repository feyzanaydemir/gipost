import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { updateAccount, deleteAccount } from '../apiCalls/userCalls';
import axios from 'axios';
import '../assets/styles/Settings.css';

function Settings() {
  const { user, dispatch } = useContext(Context);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const newUsername = useRef();
  const newEmail = useRef();
  const currentPassword = useRef();
  const newPassword = useRef();
  const username = useParams().username;
  const history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get(`/api/users?username=${username}`);
      } catch (err) {
        history.push('/oops');
      }
    };

    // Check if user is on their Settings page and not someone elses
    if (!username || username !== user.username) {
      history.push('/oops');
    } else {
      getUser();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set temporary keys for validation and authentication
    user.newUsername = newUsername.current.value;
    user.newEmail = newEmail.current.value;
    user.currentPassword = currentPassword.current.value;
    user.newPassword = newPassword.current.value;

    const errors = await updateAccount(user, dispatch);

    if (errors) {
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
      setIsUpdateSuccessful(true);

      currentPassword.current.value = '';
      newPassword.current.value = '';

      history.push(`/u/${newUsername.current.value}/settings`);
    }
  };

  const cancelChanges = () => {
    newUsername.current.value = user.username;
    newEmail.current.value = user.email;
    currentPassword.current.value = '';
    newPassword.current.value = '';

    setValidationErrors([]);
  };

  const Validation = ({ type }) => {
    if (validationErrors.length > 0) {
      return (
        <ul className="settings-validation">
          {validationErrors.map((error) =>
            error.param === type ? (
              error.param === 'newPassword' || error.param === 'newUsername' ? (
                error.msg
                  .split(',')
                  .map((err) => <li key={1 + Math.random()}>{'● ' + err}</li>)
              ) : (
                <li key={1 + Math.random()}>{'● ' + error.msg}</li>
              )
            ) : null
          )}
        </ul>
      );
    }

    return null;
  };

  const handleDelete = async () => {
    try {
      await deleteAccount(user, dispatch);
    } catch (err) {
      history.push('/oops');
    }
  };

  return (
    <div className="settings">
      <form onSubmit={handleSubmit}>
        {isUpdateSuccessful ? (
          <span>Account details updated successfully.</span>
        ) : null}
        <legend>USERNAME</legend>
        <input
          type="text"
          id="username"
          autoComplete="off"
          defaultValue={user?.username}
          ref={newUsername}
        ></input>
        <Validation type="newUsername" />
        <legend>EMAIL</legend>
        <input
          type="text"
          id="email"
          autoComplete="off"
          defaultValue={user?.email}
          ref={newEmail}
        ></input>
        <Validation type="newEmail" />
        <legend>PASSWORD</legend>
        <label htmlFor="old-password">Current Password</label>
        <input
          type="password"
          id="old-password"
          autoComplete="off"
          ref={currentPassword}
        ></input>
        <Validation type="currentPassword" />
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          autoComplete="off"
          ref={newPassword}
        ></input>
        <Validation type="newPassword" />
        <div className="settings-buttons">
          <button
            type="submit"
            className={user?.username === 'Guest' ? 'disabled' : ''}
            disabled={user?.username === 'Guest'}
          >
            Save Changes
          </button>
          <button type="button" onClick={cancelChanges}>
            Cancel
          </button>
        </div>
        <button
          type="button"
          className={user?.username === 'Guest' ? 'disabled' : 'delete-account'}
          onClick={() => setShowConfirmation(true)}
          disabled={user.username === 'Guest'}
        >
          Delete Account
        </button>
        {showConfirmation ? (
          <div className="confirmation-screen">
            <p>
              Your account will be permenantly terminated, are you sure you want
              to proceed?
            </p>
            <button type="button" onClick={() => setShowConfirmation(false)}>
              Cancel
            </button>
            <Link to="/signin" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                className="delete-account"
                onClick={handleDelete}
              >
                Delete
              </button>
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default Settings;
