import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { signOut } from '../apiCalls/authCalls';
import Searchbar from './Searchbar';
import { ExitToApp, GitHub } from '@mui/icons-material';
import '../assets/styles/Header.css';

function Header() {
  const { dispatch } = useContext(Context);

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
            <Link to="/signin" style={{ textDecoration: 'none' }}>
              <button className="header-link" onClick={() => signOut(dispatch)}>
                <ExitToApp />
                Sign Out
              </button>
            </Link>
            <a
              href="https://github.com/feyzanaydemir/gipost"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <button className="header-link">
                <GitHub />
              </button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
