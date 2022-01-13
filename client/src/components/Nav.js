import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import {
  Home,
  Person,
  PeopleAlt,
  Bookmarks,
  Settings,
} from '@mui/icons-material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/Nav.css';

function Nav() {
  const { user } = useContext(Context);

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="nav-icon">
              <Home />
            </div>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to={`/u/${user.username}`} style={{ textDecoration: 'none' }}>
            <img src={user.image ? user.image : defaultImage} alt=""></img>
            <div className="nav-icon">
              <Person />
            </div>
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/u/${user.username}/people`}
            style={{ textDecoration: 'none' }}
          >
            <div className="nav-icon">
              <PeopleAlt />
            </div>
            <span>People</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/u/${user.username}/saved`}
            style={{ textDecoration: 'none' }}
          >
            <Bookmarks className="nav-icon" />
            <span>Saved</span>
          </Link>
        </li>
        <li>
          <Link
            to={`/u/${user.username}/settings`}
            style={{ textDecoration: 'none' }}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
