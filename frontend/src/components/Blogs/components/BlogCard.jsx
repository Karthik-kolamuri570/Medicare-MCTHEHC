import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'box-shadow 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    maxWidth: '400px',
  },
  cardHover: {
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  },
  imageContainer: {
    height: '200px',
    width: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  imageHover: {
    transform: 'scale(1.05)',
  },
  content: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.25rem',
    margin: '0 0 8px 0',
    color: '#222',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleLink: {
    textDecoration: 'none',
    color: 'inherit',
    transition: 'color 0.3s ease',
  },
  titleLinkHover: {
    color: '#0077cc',
  },
  description: {
    flexGrow: 1,
    color: '#555',
    fontSize: '1rem',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '72px',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '10px',
  },
  author: {
    fontWeight: '600',
    color: '#0077cc',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
  },
  tags: {
    marginBottom: '10px',
  },
  tag: {
    display: 'inline-block',
    backgroundColor: '#e0f0ff',
    color: '#0077cc',
    padding: '4px 9px',
    marginRight: '6px',
    fontSize: '0.75rem',
    borderRadius: '20px',
    userSelect: 'none',
  },
  date: {
    fontSize: '0.8rem',
    color: '#999',
    fontStyle: 'italic',
  },
};

const BlogCard = ({ blog }) => {
  // hover effect on card and image handled with React state
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {blog.image_url && (
        <div style={styles.imageContainer}>
          <img
            src={blog.image_url}
            alt={blog.title}
            style={{
              ...styles.image,
              ...(hovered ? styles.imageHover : {})
            }}
          />
        </div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>
          <Link
            to={`/api/blog/${blog._id}`}
            title={blog.title}
            style={styles.titleLink}
            onMouseEnter={e => (e.currentTarget.style.color = '#0077cc')}
            onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
          >
            {blog.title}
          </Link>
        </h3>

        <p style={styles.description}>{blog.description}</p>

        <div style={styles.meta}>
          <span style={styles.author}>By Dr. {blog.doctor_id?.name || 'Unknown'}</span>
          <div style={styles.stats}>
            <span role="img" aria-label="likes">❤️ {blog.likes_count}</span>
            <span role="img" aria-label="comments">💬 {blog.comments_count}</span>
          </div>
        </div>

        <div style={styles.tags}>
          {blog.tags && blog.tags.map((tag, index) => (
            <span key={index} style={styles.tag}>#{tag}</span>
          ))}
        </div>

        <div style={styles.date}>
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
