import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { signOut } from '../apiCalls/authCalls';
import Searchbar from './Searchbar';
import { ExitToApp, GitHub } from '@mui/icons-material';
import defaultImage from '../assets/images/default-image.png';
import {
  Home,
  Person,
  PeopleAlt,
  Bookmarks,
  Settings,
} from '@mui/icons-material';
import '../assets/styles/Header.css';

function Header() {
  const { user, dispatch } = useContext(Context);

  return (
    <header>
      <div className="header-container">
        <div className="header-left">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>GIPOST</h2>
          </Link>
        </div>
        <div className="header-container-bottom">
          <div className="header-center">
            <Searchbar placeholder="Find someone." />
          </div>
          <div className="header-right">
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
                <Link
                  to={`/u/${user.username}`}
                  style={{ textDecoration: 'none' }}
                >
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

              <Link to="/signin" style={{ textDecoration: 'none' }}>
                <button onClick={() => signOut(dispatch)}>
                  <ExitToApp className="nav-icon" />
                  <span>Exit</span>
                </button>
              </Link>

              <a
                href="https://github.com/feyzanaydemir/gipost"
                rel="noreferrer"
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <button>
                  <GitHub className="nav-icon" />
                  <span>GitHub</span>
                </button>
              </a>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
