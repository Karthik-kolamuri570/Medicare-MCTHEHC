import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';  // <-- import hook for navigation

const BlogListPage = () => {
  const navigate = useNavigate();  // <-- initialize navigation
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useState({ query: '', tags: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchParams]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...searchParams,
      };
      const response = searchParams.query || searchParams.tags
        ? await blogAPI.searchBlogs(params)
        : await blogAPI.getAllBlogs(params);

      setBlogs(response.data.blogs || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError('Failed to fetch blogs. Please try again.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Styles (same as your existing styles or customize)
  const styles = {
    container: {
      maxWidth: 960,
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: 0,
    },
    likedButton: {
      padding: '10px 16px',
      backgroundColor: '#007acc',
      color: '#fff',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      userSelect: 'none',
      transition: 'background-color 0.3s',
    },
    likedButtonHover: {
      backgroundColor: '#005fa3',
    },
    errorMessage: {
      backgroundColor: '#fdecea',
      border: '1px solid #f5c6cb',
      borderRadius: 6,
      padding: '1rem',
      color: '#a71d2a',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    blogsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    noBlogs: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#666',
      padding: '2rem 0',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '2rem',
    },
    pageButton: {
      padding: '8px 14px',
      borderRadius: 6,
      border: '1.5px solid #ddd',
      backgroundColor: '#fff',
      color: '#0077cc',
      cursor: 'pointer',
      minWidth: 36,
      fontWeight: 600,
      userSelect: 'none',
      transition: 'background-color 0.3s',
    },
    pageButtonActive: {
      backgroundColor: '#0077cc',
      color: '#fff',
      borderColor: '#005fa3',
      cursor: 'default',
    },
    pageButtonDisabled: {
      backgroundColor: '#f0f0f0',
      color: '#bbb',
      borderColor: '#ddd',
      cursor: 'not-allowed',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#666',
      marginTop: '2rem',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>All Blogs</h1>

        {/* Button to navigate to patient liked blogs page */}
        <button
          style={styles.likedButton}
          onClick={() => navigate('/api/patient/likes')}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#005fa3')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#007acc')}
        >
          My Liked Blogs
        </button>
      </header>

      <SearchBar onSearch={handleSearch} />

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.blogsGrid}>
        {blogs.length === 0 ? (
          <div style={styles.noBlogs}>
            <h3>No blogs found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>

      {pagination.totalPages > 1 && (
        <nav aria-label="Pagination" style={styles.pagination}>
          <button
            style={{
              ...styles.pageButton,
              ...(currentPage <= 1 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                style={{
                  ...styles.pageButton,
                  ...(page === currentPage ? styles.pageButtonActive : {}),
                }}
                onClick={() => handlePageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}

          <button
            style={{
              ...styles.pageButton,
              ...(currentPage >= pagination.totalPages
                ? styles.pageButtonDisabled
                : {}),
            }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </nav>
      )}

      {loading && <div style={styles.loading}>Loading...</div>}
    </div>
  );
};

export default BlogListPage;
