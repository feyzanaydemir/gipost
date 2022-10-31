import React, { useState, useEffect, useContext, useRef } from 'react';
import { getComments, getNewComment } from '../apiCalls/commentCalls';
import { newComment } from '../apiCalls/commentCalls';
import { Context } from '../context/Context';
import Comment from './Comment';

function CommentSection({
  post,
  showComments,
  setShowComments,
  setLikeDislike,
}) {
  const { user } = useContext(Context);
  const [comments, setComments] = useState([]);
  const [commentLikeDislike, setCommentLikeDislike] = useState({});
  const commentInput = useRef();

  useEffect(() => {
    if (post) {
      getComments(post, setComments);
    }

    return () => setComments([]);
  }, [post]);

  useEffect(() => {
    if (showComments.newComment) {
      getNewComment(post, comments, setComments);
    }
  }, [showComments.newComment]);

  // Manage a comment's like and dislike display
  useEffect(() => {
    // If a specific comments activity (like / dislike status) has changed
    if (commentLikeDislike.status) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === commentLikeDislike.id) {
          // Set comment likes and dislikes for display
          const updatedComment = setLikeDislike(
            comments[i],
            commentLikeDislike.action
          );
          const newCommentsList = [...comments];
          newCommentsList[i] = updatedComment;

          setComments(newCommentsList);
          // Change comment activity status back to false
          setCommentLikeDislike({ ...commentLikeDislike, status: false });
        }
      }
    }
  }, [commentLikeDislike]);

  return (
    <>
      {showComments.clicked ? (
        <div className="new-comment">
          <textarea
            placeholder="Add a comment..."
            cols="40"
            rows="3"
            autoComplete="off"
            maxLength="250"
            ref={commentInput}
          ></textarea>
          <button
            type="button"
            onClick={() => {
              if (commentInput.current.value !== '') {
                setShowComments({ ...showComments, newComment: false });
                newComment(user, post, commentInput, setShowComments);
              }
            }}
          >
            Reply
          </button>
        </div>
      ) : null}
      {comments.length > 0 && showComments.clicked ? (
        <div className="comments">
          {comments.map((comment) =>
            showComments.newComment || true ? (
              <Comment
                comment={comment}
                netLikes={comment.likes.length - comment.dislikes.length}
                setCommentLikeDislike={setCommentLikeDislike}
                key={1 + Math.random()}
              />
            ) : null
          )}
        </div>
      ) : null}
    </>
  );
}

export default CommentSection;
