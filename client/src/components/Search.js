import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/Search.css';

function Search() {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const searchWord = useParams().searchword;

  useEffect(() => {
    const findUsers = async () => {
      setIsFetching(true);

      try {
        const res = await axios.get(`/api/users?searchword=${searchWord}`);
        setResults(res.data.results);
        setSuggestions(res.data.suggestions);
      } catch (err) {
        console.log(err);
      }

      setIsFetching(false);
    };

    findUsers();

    return setResults([]), setSuggestions([]);
  }, [searchWord]);

  const UserCard = ({ user }) => {
    return (
      <Link
        to={`/u/${user.username}`}
        style={{ textDecoration: 'none' }}
        key={1 + Math.random()}
      >
        <div className="suggestion">
          <img
            src={user.image ? user.image : defaultImage}
            alt="User profile image."
          />
          <span>{user.username}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {isFetching ? (
        <div className="search">
          <LinearProgress color="secondary" className="loading" />
        </div>
      ) : (
        <div className="search">
          <h2>
            {results.length} RESULTS FOR: {searchWord}
          </h2>
          {results.length > 0 ? (
            <div className="results">
              {results.map((user) => (
                <UserCard user={user} key={1 + Math.random()} />
              ))}
            </div>
          ) : null}
          {
            <div>
              <h3>SUGGESTIONS</h3>
              <div className="suggestions">
                {suggestions.map((user) => (
                  <UserCard user={user} key={1 + Math.random()} />
                ))}
              </div>
            </div>
          }
        </div>
      )}
    </>
  );
}

export default Search;
