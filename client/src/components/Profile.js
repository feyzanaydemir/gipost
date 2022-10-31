import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { Context } from '../context/Context';
import {
  updateDescription,
  updateImage,
  followOrUnfollow,
} from '../apiCalls/userCalls';
import Feed from './Feed';
import axios from 'axios';
import { Add, Remove, Edit, Done } from '@mui/icons-material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/Profile.css';

function Profile() {
  const { user: currentUser, dispatch } = useContext(Context);
  const [user, setUser] = useState({});
  const [editDescription, setEditDescription] = useState(false);
  const [file, setFile] = useState(null);
  const username = useParams().username;
  const history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users?username=${username}`);

        setUser(res.data);
      } catch (err) {
        history.push('/oops');
      }
    };

    getUser();

    return () => setUser({});
  }, [username, currentUser?.following]);

  useEffect(() => {
    updateImage(currentUser, file, dispatch);
  }, [currentUser, file, dispatch]);

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-image">
          <img
            src={user?.image ? user.image : defaultImage}
            alt="User profile image."
          ></img>
          {username === currentUser.username ? (
            <label htmlFor="profile-picture">
              <span>
                <Edit />
              </span>
              <input
                type="file"
                id="profile-picture"
                accept=".png, .jpeg, .jpg"
                autoComplete="off"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files[0])}
              ></input>
            </label>
          ) : null}
        </div>
        <div className="profile-main">
          <div className="profile-details">
            <span className="profile-username">{username}</span>
            <div>
              <span>{user.following?.length} Following</span>
              <span>{user.followers?.length} Followers</span>
            </div>
            {user !== {} && username !== currentUser.username && (
              <button
                onClick={() => {
                  followOrUnfollow(currentUser, user, dispatch);
                }}
              >
                {currentUser.following.includes(user._id)
                  ? 'Unfollow'
                  : 'Follow'}
                {currentUser.following.includes(user._id) ? (
                  <Remove />
                ) : (
                  <Add />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <Feed username={username} />
    </div>
  );
}

export default Profile;
