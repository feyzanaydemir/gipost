import React from 'react';
import errIcon from '../assets/images/error-icon.png';
import ErrorIcon from '@mui/icons-material/Error';
import '../assets/styles/Err.css';

function Err() {
  return (
    <div className="err">
      <div>
        <ErrorIcon />
        <h1>Oops!</h1>
      </div>
      <h2>Something Went Wrong</h2>
      <h3>
        The page you are looking for could not be found or you are not
        authorized to access this page.
      </h3>
    </div>
  );
}

export default Err;
