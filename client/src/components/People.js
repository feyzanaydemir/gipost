import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/People.css';

function People() {
  const { user } = useContext(Context);
  const [people, setPeople] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const paramUsername = useParams().username;
  const history = useHistory();

  useEffect(() => {
    const getPeople = async () => {
      try {
        setIsFetching(true);
        const peopleList = await axios.get(`/api/users/${user._id}/following`);
        setIsFetching(false);

        setPeople(peopleList.data);
        sessionStorage.setItem(
          'gipost-people',
          JSON.stringify(peopleList.data)
        );
      } catch (err) {
        console.log(err);
      }
    };

    if (!paramUsername || paramUsername !== user.username) {
      history.push('/oops');
    } else {
      if (sessionStorage.getItem('gipost-people')) {
        const storedPeople = JSON.parse(
          sessionStorage.getItem('gipost-people')
        );
        let count = 0;

        for (let i = 0; i < user.following.length; i++) {
          if (user.following[i] === storedPeople[i]?._id) {
            count++;
          } else {
            break;
          }
        }

        if (count === user.following.length) {
          setPeople(storedPeople);
        } else {
          getPeople();
        }
      } else {
        getPeople();
      }
    }

    return () => setPeople([]);
  }, [user]);

  return (
    <>
      {isFetching ? (
        <div className="people">
          <LinearProgress color="primary" />
        </div>
      ) : (
        <div className="people">
          <div className="people-container">
            {people.map((person) =>
              person ? (
                <Link
                  to={`/u/${person.username}`}
                  style={{ textDecoration: 'none' }}
                  key={person._id}
                >
                  <div>
                    <img
                      alt="User profile image."
                      src={person.image ? person.image : defaultImage}
                    />
                    <span>{person.username}</span>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default People;
