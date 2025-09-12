import React, { useState } from 'react';
import { commentAPI } from '../services/api';

const CommentForm = ({ blogId, parentCommentId = null, onCommentAdded, onCancel }) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    setError('');
    
    try {
      await commentAPI.addComment({
        blog_id: blogId,
        comment_text: commentText.trim(),
        parent_comment_id: parentCommentId
      });
      setCommentText('');
      onCommentAdded();
      if (onCancel) onCancel();
    } catch (error) {
      setError('Failed to post comment. Please try again.');
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1rem',
      fontFamily: 'Arial, sans-serif',
    },
    textarea: {
      resize: 'vertical',
      padding: '10px',
      fontSize: '1rem',
      borderRadius: '6px',
      border: '1.8px solid #ddd',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      outline: 'none',
      transition: 'border-color 0.3s',
      width: '100%',
      minHeight: parentCommentId ? '3.5rem' : '5rem',
      marginBottom: error ? '0.25rem' : '1rem',
    },
    textareaFocus: {
      borderColor: '#0077cc',
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: '0.875rem',
      marginBottom: '0.75rem',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginBottom: '0.5rem',
    },
    btnPrimary: {
      backgroundColor: submitting ? '#5a9bd8' : '#0077cc',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: submitting ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s',
      flexGrow: 1,
      userSelect: 'none',
    },
    btnSecondary: {
      backgroundColor: '#e0e0e0',
      color: '#333',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      userSelect: 'none',
    },
    characterCount: {
      alignSelf: 'flex-end',
      fontSize: '0.85rem',
      color: '#666',
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <textarea
        style={styles.textarea}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
        rows={parentCommentId ? 3 : 4}
        disabled={submitting}
        required
        maxLength={1000}
        onFocus={e => e.target.style.borderColor = '#0077cc'}
        onBlur={e => e.target.style.borderColor = '#ddd'}
      />
      {error && <div style={styles.errorMessage}>{error}</div>}
      <div style={styles.actions}>
        <button
          type="submit"
          disabled={submitting || !commentText.trim()}
          style={styles.btnPrimary}
        >
          {submitting ? 'Posting...' : (parentCommentId ? 'Reply' : 'Post Comment')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={styles.btnSecondary}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
      <div style={styles.characterCount}>
        {commentText.length}/1000
      </div>
    </form>
  );
};

export default CommentForm;
