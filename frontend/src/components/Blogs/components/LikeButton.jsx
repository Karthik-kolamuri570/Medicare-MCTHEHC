import React, { useState, useEffect } from 'react';
import { likeAPI } from '../services/api';

const LikeButton = ({ blogId }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLikeData();
  }, [blogId]);

  const fetchLikeData = async () => {
    try {
      const [statusRes, countRes] = await Promise.all([
        likeAPI.checkLikeStatus({ blog_id: blogId }),
        likeAPI.getBlogLikes(blogId)
      ]);
      setLiked(statusRes.data.isLiked);
      setLikesCount(countRes.data.count);
    } catch (error) {
      console.error('Failed to fetch like data:', error);
    }
  };

  const handleToggleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await likeAPI.toggleLike({ blog_id: blogId });
      setLiked(res.data.isLiked);
      setLikesCount(prev => res.data.isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('Failed to toggle like. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    button: {
      cursor: loading ? 'wait' : 'pointer',
      padding: '8px 16px',
      fontSize: '1rem',
      borderRadius: '25px',
      border: '2px solid',
      borderColor: liked ? '#e0245e' : '#ccc',
      color: liked ? '#e0245e' : '#555',
      backgroundColor: liked ? '#ffe6eb' : '#f7f7f7',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      userSelect: 'none',
      outline: 'none',
      minWidth: '80px',
      justifyContent: 'center',
    },
    buttonHover: {
      backgroundColor: liked ? '#f8b4c6' : '#e0e0e0',
    },
  };

  // Simple hover effect using React state
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      style={{
        ...styles.button,
        ...(isHover ? styles.buttonHover : {}),
        opacity: loading ? 0.7 : 1,
      }}
      onClick={handleToggleLike}
      disabled={loading}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      aria-pressed={liked}
      aria-label={liked ? `Unlike blog with ${likesCount} likes` : `Like blog with ${likesCount} likes`}
    >
      <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
