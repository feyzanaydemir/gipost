import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { getNewPost } from '../apiCalls/postCalls';
import { PermMedia, Gif, Videocam, Cancel } from '@mui/icons-material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/Share.css';

function Share({ posts, setPosts }) {
  const { user } = useContext(Context);
  const [file, setFile] = useState(null);
  const history = useHistory();
  const text = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newPost = await getNewPost(user, text, file);
      const updatedList = [newPost].concat(posts);

      setPosts(updatedList);

      history.push('/');

      setFile(null);
      text.current.value = '';
    } catch (err) {
      history.push('/oops');
    }
  };

  return (
    <div className="share">
      <div className="share-top">
        <Link to={`/u/${user.username}`} style={{ textDecoration: 'none' }}>
          <img
            src={user.image ? user.image : defaultImage}
            alt="User profile image."
          />
        </Link>
        <textarea
          cols="40"
          rows="3"
          placeholder={
            'Hi ' + user.username + ', share anything you want on Gipost.'
          }
          ref={text}
        ></textarea>
      </div>
      <hr />
      {file && (
        <div className="file-preview">
          {file.name.includes('mp4') ? (
            <video src={URL.createObjectURL(file)} controls></video>
          ) : (
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded media preview."
            ></img>
          )}
          <Cancel className="cancel-share" onClick={() => setFile(null)} />
        </div>
      )}
      <form className="share-bottom" onSubmit={handleSubmit}>
        <div className="share-options">
          <label htmlFor="image-file">
            <PermMedia className="share-options-icon" />
            <span>Image</span>
            <input
              type="file"
              id="image-file"
              accept=".png, .jpeg, .jpg"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
          </label>
          <label htmlFor="gif-file">
            <Gif className="share-options-icon" />
            <span>GIF</span>
            <input
              type="file"
              id="gif-file"
              accept=".png, .jpeg, .jpg"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
          </label>
          <label htmlFor="video-file">
            <Videocam className="share-options-icon" />
            <input
              type="file"
              id="video-file"
              accept=".mp4, .webm, .ogg"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            ></input>
            <span>Video</span>
          </label>
        </div>
        <button type="submit">Share</button>
      </form>
    </div>
  );
}

export default Share;
