import React, { useState, useEffect } from 'react';
import { likeAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const PatientLikesPage = () => {
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const styles = {
    container: {
      maxWidth: 960,
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    header: {
      marginBottom: '1.5rem',
      fontSize: '2rem',
      fontWeight: 700,
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: 6,
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      textAlign: 'center',
      fontWeight: 500,
    },
    noLikes: {
      textAlign: 'center',
      color: '#666',
      padding: '3rem 1rem',
    },
    browseBtn: {
      display: 'inline-block',
      padding: '10px 24px',
      backgroundColor: '#007acc',
      color: '#fff',
      borderRadius: 6,
      textDecoration: 'none',
      fontWeight: 600,
      marginTop: '1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: '2rem',
    },
    pageButton: {
      padding: '8px 14px',
      borderRadius: 6,
      border: '1.5px solid #ddd',
      backgroundColor: '#fff',
      color: '#007acc',
      cursor: 'pointer',
      minWidth: 36,
      fontWeight: 600,
      userSelect: 'none',
    },
    activePageButton: {
      backgroundColor: '#007acc',
      color: '#fff',
      borderColor: '#005a9c',
      cursor: 'default',
    },
    disabledButton: {
      backgroundColor: '#f0f0f0',
      color: '#bbb',
      borderColor: '#ddd',
      cursor: 'not-allowed',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#666',
    },
  };

  useEffect(() => {
    fetchLikedBlogs();
  }, [currentPage]);

  const fetchLikedBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await likeAPI.getPatientLikes({
        page: currentPage,
        limit: 10,
      });
      setLikedBlogs(response.data.likedBlogs || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError('Failed to fetch your liked blogs. Please try again.');
      console.error('Error fetching liked blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading && likedBlogs.length === 0) {
    return <div style={styles.loading}>Loading your liked blogs...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>My Liked Blogs</header>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div>
        {likedBlogs.length === 0 ? (
          <div style={styles.noLikes}>
            <h3>No liked blogs yet</h3>
            <p>Start exploring blogs and like the ones you find interesting!</p>
            <a href="/blogs" style={styles.browseBtn}>
              Browse Blogs
            </a>
          </div>
        ) : (
          <>
            <div style={styles.grid}>
              {likedBlogs.map(
                (like) =>
                  like.blog_id && <BlogCard key={like._id} blog={like.blog_id} />
              )}
            </div>

            {pagination.totalPages > 1 && (
              <nav aria-label="Pagination" style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageButton,
                    ...(currentPage <= 1 ? styles.disabledButton : {}),
                  }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    style={{
                      ...styles.pageButton,
                      ...(page === currentPage ? styles.activePageButton : {}),
                    }}
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
                <button
                  style={{
                    ...styles.pageButton,
                    ...(currentPage >= pagination.totalPages
                      ? styles.disabledButton
                      : {}),
                  }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {loading && <div style={styles.loading}>Loading...</div>}
    </div>
  );
};

export default PatientLikesPage;
