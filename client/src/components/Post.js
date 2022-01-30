import React, { useState, useContext } from 'react';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';
import { likeAndDislike, deletePost } from '../apiCalls/postCalls';
import { savePost, unsavePost } from '../apiCalls/userCalls';
import { format, parseISO } from 'date-fns';
import CommentSection from './CommentSection';
import {
  ThumbUp,
  ThumbDown,
  Bookmark,
  BookmarkRemove,
  Delete,
} from '@mui/icons-material';
import defaultImage from '../assets/images/default-image.png';
import '../assets/styles/Post.css';

function Post({ post, posts, setPosts }) {
  const { user, dispatch } = useContext(Context);
  const [netLikes, setNetLikes] = useState(
    post?.likes?.length - post?.dislikes?.length
  );
  const [showComments, setShowComments] = useState({
    clicked: false,
    newComment: false,
  });

  // Manage a post's likes and dislikes
  const postLikeDislike = async (action) => {
    const updatedPost = setLikeDislike(post, action);
    setNetLikes(updatedPost.likes.length - updatedPost.dislikes.length);

    await likeAndDislike(user, post?._id, action); // API Call
  };

  // Manage a post's or a comment's likes and dislikes
  const setLikeDislike = (element, action) => {
    const obj = { ...element };

    if (action === 'like') {
      // If element is already liked take like back
      if (obj.likes.includes(user._id)) {
        obj.likes.splice(obj.likes.indexOf(user._id));
      } else {
        obj.likes.push(user._id);

        // If element is disliked take dislike back
        if (obj.dislikes.includes(user._id)) {
          obj.dislikes.splice(obj.dislikes.indexOf(user._id));
        }
      }
    } else {
      // If element is already disliked take dislike back
      if (obj.dislikes.includes(user._id)) {
        obj.dislikes.splice(obj.dislikes.indexOf(user._id));
      } else {
        obj.dislikes.push(user._id);

        // If element is liked take like back
        if (obj.likes.includes(user._id)) {
          obj.likes.splice(obj.likes.indexOf(user._id));
        }
      }
    }

    return obj;
  };

  if (!post) return null;

  return (
    <div className="post">
      <div className="post-top">
        <div>
          <Link to={`/u/${post.authorName}`} style={{ textDecoration: 'none' }}>
            <img
              src={post.authorImage ? post.authorImage : defaultImage}
              alt="Post author profile image."
            />
            <h1>{post.authorName}</h1>
          </Link>
        </div>
        <h2>
          {post.createdAt
            ? format(parseISO(post.createdAt), 'hh:mm a, dd/MM/y')
            : ''}
        </h2>
        <div>
          {user.saved.includes(post._id) ? (
            <BookmarkRemove onClick={() => unsavePost(user, post, dispatch)} />
          ) : (
            <Bookmark onClick={() => savePost(user, post, dispatch)} />
          )}
          {post.authorId === user._id ? (
            <Delete
              onClick={() => {
                if (user.saved.includes(post._id)) {
                  unsavePost(user, post, dispatch);
                }
                deletePost(post, posts, setPosts);
              }}
            />
          ) : null}
        </div>
      </div>
      <div className="post-center">
        {post.text ? <span>{post.text}</span> : null}
        {post.media ? <img alt="Post media." src={post.media} /> : null}
      </div>
      <div className="post-bottom">
        <div>
          <ThumbUp onClick={() => postLikeDislike('like')} />
          <span>{netLikes}</span>
          <ThumbDown onClick={() => postLikeDislike('dislike')} />
        </div>
        <button
          onClick={() =>
            setShowComments({ ...showComments, clicked: !showComments.clicked })
          }
        >
          {post.comments?.length === 1
            ? '1 Comment'
            : `${post.comments?.length} Comments`}
        </button>
      </div>
      <CommentSection
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        setLikeDislike={setLikeDislike}
      />
    </div>
  );
}

export default Post;
