import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/Context';
import { likeAndDislike } from '../apiCalls/commentCalls';
import { format, parseISO } from 'date-fns';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import '../assets/styles/Comment.css';

function Comment({ comment, netLikes, setCommentLikeDislike }) {
  const { user } = useContext(Context);

  const handleClick = async (action) => {
    if (comment.authorName !== '[deleted]') {
      setCommentLikeDislike({
        id: comment._id,
        action: action,
        status: true,
      });

      await likeAndDislike(user, comment._id, action);
    }
  };

  return (
    <div className="comment">
      <p>{comment.text}</p>
      <div className="comment-container">
        <div className="like-dislike">
          <ThumbUp onClick={() => handleClick('like')} />
          <span>{netLikes}</span>
          <ThumbDown onClick={() => handleClick('dislike')} />
        </div>
        {comment.authorName !== '[deleted]' ? (
          <Link to={`/u/${comment.authorName}`}>
            <span>{comment.authorName}</span>
          </Link>
        ) : (
          <span>[deleted]</span>
        )}
        <span>{format(parseISO(comment.createdAt), 'hh:mm a, dd/MM/y')}</span>
      </div>
    </div>
  );
}

export default Comment;
