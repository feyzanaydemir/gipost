import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { useParams, useHistory } from 'react-router';
import { getFeed, getProfile, getSaved } from '../apiCalls/userCalls';
import Share from './Share';
import Post from './Post';
import '../assets/styles/Feed.css';
import { LinearProgress } from '@mui/material';

function Feed({ username }) {
  const { user } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const isProfile = useParams().username;
  const savedPath = useParams().saved;
  const history = useHistory();

  useEffect(() => {
    const redirect = () => history.push('/oops');
    const getPosts = async () => {
      let postList;

      setIsFetching(true);

      if (savedPath) {
        postList = await getSaved(user, redirect);
      } else if (isProfile) {
        postList = await getProfile(username, redirect);
      } else {
        postList = await getFeed(user, redirect);
      }

      setIsFetching(false);
      setPosts(postList);
    };

    // If at saved posts page and current user is not authorized
    if (savedPath && isProfile && isProfile !== user.username) {
      redirect();
    } else {
      getPosts();
    }

    return () => setPosts([]);
  }, [username, user, savedPath]);

  return (
    <>
      {isFetching ? (
        <div className="feed">
          <LinearProgress color="secondary" className="loading" />
        </div>
      ) : (
        <div className="feed">
          {!username && !savedPath && (
            <Share posts={posts} setPosts={setPosts} />
          )}
          {posts.map((post) => (
            <Post
              key={1 + Math.random()}
              post={post}
              posts={posts}
              setPosts={setPosts}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default Feed;
