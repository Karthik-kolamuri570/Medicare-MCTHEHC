import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI, commentAPI } from '../services/api';
import LikeButton from '../components/LikeButton';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const styles = {
    page: {
      maxWidth: 800,
      margin: '2rem auto',
      fontFamily: 'Arial, sans-serif',
      padding: '0 1rem',
      color: '#333',
    },
    header: {
      marginBottom: '1.5rem',
    },
    backLink: {
      textDecoration: 'none',
      color: '#0077cc',
      fontWeight: '600',
      fontSize: '1rem',
    },
    article: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#222',
    },
    blogMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    authorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '250px',
    },
    authorAvatar: {
      width: 50,
      height: 50,
      borderRadius: '50%',
      objectFit: 'cover',
      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    },
    authorName: {
      fontWeight: '600',
      color: '#0077cc',
      fontSize: '1rem',
    },
    publishDate: {
      fontSize: '0.85rem',
      color: '#666',
      marginTop: '0.2rem',
    },
    blogActions: {
      minWidth: '100px',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    blogTags: {
      marginBottom: '1rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    tag: {
      backgroundColor: '#e0f0ff',
      color: '#0077cc',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      userSelect: 'none',
    },
    blogImageWrapper: {
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '2rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    blogImage: {
      width: '100%',
      height: 300,
      objectFit: 'cover',
      display: 'block',
    },
    blogDescription: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#555',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #eee',
    },
    blogText: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#333',
      whiteSpace: 'pre-line',
      marginBottom: '2rem',
    },
    commentsSection: {
      backgroundColor: '#fff',
      padding: '1.5rem 2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '3rem 0',
      color: '#666',
    },
    errorPage: {
      maxWidth: 600,
      margin: '3rem auto',
      textAlign: 'center',
      color: '#cc0000',
    },
    errorTitle: {
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    errorMessage: {
      fontSize: '1.1rem',
      marginBottom: '2rem',
    },
    btnPrimary: {
      padding: '10px 25px',
      backgroundColor: '#0077cc',
      color: 'white',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '1rem',
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  const fetchBlogData = async () => {
    setLoading(true);
    setError('');
    try {
      const [blogRes, commentsRes] = await Promise.all([
        blogAPI.getBlogById(id),
        commentAPI.getBlogComments(id),
      ]);
      setBlog(blogRes.data);
      setComments(commentsRes.data.comments || []);
    } catch (err) {
      setError('Failed to load blog. Please try again.');
      console.error('Error fetching blog data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentsUpdated = () => {
    fetchBlogData();
  };

  if (loading) {
    return <div style={styles.loading}>Loading blog...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorPage}>
        <h2 style={styles.errorTitle}>Error</h2>
        <p style={styles.errorMessage}>{error}</p>
        <Link to="/blogs" style={styles.btnPrimary}>Back to Blogs</Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={styles.errorPage}>
        <h2 style={styles.errorTitle}>Blog Not Found</h2>
        <p style={styles.errorMessage}>The blog you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" style={styles.btnPrimary}>Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Link to="/api/blogs" style={styles.backLink}>← Back to Blogs</Link>
      </div>

      <article style={styles.article}>
        <header>
          <h1 style={styles.title}>{blog.title}</h1>
          <div style={styles.blogMeta}>
            <div style={styles.authorInfo}>
              {blog.doctor_id?.profileImage && (
                <img
                  src={blog.doctor_id.profileImage}
                  alt={blog.doctor_id.name}
                  style={styles.authorAvatar}
                />
              )}
              <div>
                <span style={styles.authorName}>Dr. {blog.doctor_id?.name || 'Unknown'}</span>
                <br />
                <span style={styles.publishDate}>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div style={styles.blogActions}>
              <LikeButton blogId={blog._id} />
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div style={styles.blogTags}>
              {blog.tags.map((tag, index) => (
                <span key={index} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </header>

        {blog.image_url && (
          <div style={styles.blogImageWrapper}>
            <img
              src={blog.image_url}
              alt={blog.title}
              style={styles.blogImage}
            />
          </div>
        )}

        <div style={styles.blogContent}>
          <div style={styles.blogDescription}>
            <strong>{blog.description}</strong>
          </div>
          <div
            style={styles.blogText}
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }}
          />
        </div>
      </article>

      <section style={styles.commentsSection}>
        <CommentForm
          blogId={blog._id}
          onCommentAdded={handleCommentsUpdated}
        />

        <CommentList
          blogId={blog._id}
          comments={comments}
          onCommentsUpdated={handleCommentsUpdated}
        />
      </section>
    </div>
  );
};

export default BlogDetailsPage;
