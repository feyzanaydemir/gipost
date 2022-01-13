import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import '../assets/styles/Searchbar.css';

function Searchbar({ placeholder }) {
  const [shouldSearch, setShouldSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    // Don't allow an empty search
    if (e.target.value === '') {
      setShouldSearch(false);
    } else {
      setShouldSearch(true);
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        onChange={handleChange}
        autoComplete="off"
        placeholder={placeholder}
        maxLength="25"
        id="search-input"
      ></input>
      {shouldSearch ? (
        <Link to={`/search/${searchInput}`} style={{ textDecoration: 'none' }}>
          <div className="search-icon">
            <Search />
          </div>
        </Link>
      ) : (
        <div className="search-icon">
          <Search />
        </div>
      )}
    </div>
  );
}

export default Searchbar;
