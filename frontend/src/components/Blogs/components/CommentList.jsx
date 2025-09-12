import React, { useState } from 'react';
import { commentAPI } from './../services/api';
import CommentForm from './CommentForm';

const styles = {
  comment: {
    borderBottom: '1px solid #eee',
    padding: '16px 0',
    fontFamily: 'Arial, sans-serif',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: '0.85rem',
    color: '#444',
  },
  commentAuthor: {
    fontWeight: '600',
    color: '#0077cc',
  },
  commentDate: {
    fontStyle: 'italic',
    color: '#999',
  },
  commentContent: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: 8,
    whiteSpace: 'pre-wrap',
  },
  commentEditTextarea: {
    width: '100%',
    padding: 10,
    fontSize: '1rem',
    borderRadius: 6,
    border: '1.8px solid #ddd',
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: 10,
    fontFamily: 'inherit',
  },
  commentEditActions: {
    display: 'flex',
    gap: 8,
  },
  buttonLink: {
    background: 'none',
    border: 'none',
    color: '#0077cc',
    cursor: 'pointer',
    padding: 0,
    fontSize: '0.9rem',
    fontWeight: '600',
    userSelect: 'none',
  },
  buttonLinkDisabled: {
    color: '#aaa',
    cursor: 'not-allowed',
  },
  buttonLinkDelete: {
    color: '#cc0000',
  },
  replyForm: {
    marginLeft: 24,
    marginTop: 12,
    borderLeft: '3px solid #eee',
    paddingLeft: 16,
  },
  commentReplies: {
    marginLeft: 24,
    marginTop: 12,
    borderLeft: '3px solid #eee',
    paddingLeft: 16,
  },
  noComments: {
    fontStyle: 'italic',
    color: '#666',
  },
};

const Comment = ({ comment, onCommentUpdated, onCommentDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await commentAPI.updateComment(comment._id, { comment_text: editText.trim() });
      setIsEditing(false);
      onCommentUpdated();
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setLoading(true);
    try {
      await commentAPI.deleteComment(comment._id);
      onCommentDeleted();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.comment}>
      <div style={styles.commentHeader}>
        <span style={styles.commentAuthor}>{comment.patient_id?.name || 'Anonymous'}</span>
        <span style={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>

      <div style={styles.commentContent}>
        {isEditing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              maxLength={1000}
              style={styles.commentEditTextarea}
              disabled={loading}
            />
            <div style={styles.commentEditActions}>
              <button
                onClick={handleEdit}
                disabled={loading}
                style={{ ...styles.buttonLink, ...(loading ? styles.buttonLinkDisabled : {}) }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={styles.buttonLink}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{comment.comment_text}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => setIsReplying(!isReplying)}
          style={styles.buttonLink}
        >
          Reply
        </button>
        <button
          onClick={() => setIsEditing(true)}
          style={styles.buttonLink}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          style={{ ...styles.buttonLink, ...styles.buttonLinkDelete }}
          disabled={loading}
        >
          Delete
        </button>
      </div>

      {isReplying && (
        <div style={styles.replyForm}>
          <CommentForm
            blogId={comment.blog_id}
            parentCommentId={comment._id}
            onCommentAdded={onCommentUpdated}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={styles.commentReplies}>
          {comment.replies.map(reply => (
            <Comment
              key={reply._id}
              comment={reply}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ blogId, comments, onCommentsUpdated }) => {
  return (
    <div>
      <h3>Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <Comment
            key={comment._id}
            comment={comment}
            onCommentUpdated={onCommentsUpdated}
            onCommentDeleted={onCommentsUpdated}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
