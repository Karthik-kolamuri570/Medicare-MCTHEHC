import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogForm from '../components/BlogForm';

const DoctorDashboardPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await blogAPI.getDoctorBlogs();
      setBlogs(response.data || []);
    } catch (err) {
      setError('Failed to fetch your blogs. Please try again.');
      console.error('Error fetching doctor blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    setSubmitting(true);
    try {
      await blogAPI.createBlog(blogData);
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      alert('Failed to create blog. Please try again.');
      console.error('Error creating blog:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBlog = async (blogData) => {
    setSubmitting(true);
    try {
      await blogAPI.updateBlog(editingBlog._id, blogData);
      setEditingBlog(null);
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      alert('Failed to update blog. Please try again.');
      console.error('Error updating blog:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await blogAPI.deleteBlog(blogId);
      fetchBlogs();
    } catch (err) {
      alert('Failed to delete blog. Please try again.');
      console.error('Error deleting blog:', err);
    }
  };

  const startEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'draft':
        return 'orange';
      case 'archived':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Inline styles
  const styles = {
    container: {
      maxWidth: 960,
      margin: '5rem auto',
      padding: '0 1rem',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: 0,
    },
    createButton: {
      padding: '12px 25px',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: 6,
      border: 'none',
      backgroundColor: '#007acc',
      color: 'white',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.3s',
      disabled: {
        backgroundColor: '#7ca3d4',
        cursor: 'not-allowed',
      },
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: 6,
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      fontWeight: '500',
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    },
    blogsTable: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      borderBottom: '2px solid #ddd',
      padding: '12px',
      fontWeight: '600',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      verticalAlign: 'middle',
      fontSize: '1rem',
    },
    statusBadge: (color) => ({
      padding: '0.3rem 0.8rem',
      borderRadius: '1rem',
      color: color,
      fontWeight: '600',
      textTransform: 'capitalize',
    }),
    actionButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '6px 12px',
      fontSize: '0.9rem',
      borderRadius: 4,
      fontWeight: '600',
      cursor: 'pointer',
      userSelect: 'none',
      border: 'none',
      color: 'white',
      transition: 'background-color 0.3s',
    },
    editButton: {
      backgroundColor: '#6c757d', // gray
    },
    deleteButton: {
      backgroundColor: '#dc3545', // red
    },
    viewButton: {
      backgroundColor: '#007acc', // blue
      textDecoration: 'none',
      padding: '6px 12px',
      fontSize: '0.9rem',
      borderRadius: 4,
      fontWeight: '600',
      color: 'white',
      display: 'inline-block',
      transition: 'background-color 0.3s',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Blogs</h1>
        <button
          style={{
            ...styles.createButton,
            ...(showForm ? styles.createButton.disabled : {}),
          }}
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Create New Blog
        </button>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}

      {showForm && (
        <div style={styles.formContainer}>
          <h2>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
          <BlogForm
            blog={editingBlog}
            onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
            onCancel={cancelForm}
            loading={submitting}
          />
        </div>
      )}

      {loading ? (
        <div>Loading your blogs...</div>
      ) : (
        <>
          {blogs.length === 0 ? (
            <div>
              <h3>No blogs yet</h3>
              <p>Create your first blog to get started!</p>
            </div>
          ) : (
            <table style={styles.blogsTable}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Likes</th>
                  <th style={styles.th}>Comments</th>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog._id}>
                    <td style={styles.td}>
                      <div>
                        <strong>{blog.title}</strong>
                        <p style={{ margin: 0, color: '#666' }}>{blog.description}</p>
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: getStatusColor(blog.status) }}>
                      <span style={styles.statusBadge(getStatusColor(blog.status))}>{blog.status}</span>
                    </td>
                    <td style={styles.td}>{blog.likes_count}</td>
                    <td style={styles.td}>{blog.comments_count}</td>
                    <td style={styles.td}>{new Date(blog.Created).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={{ ...styles.button, ...styles.editButton }}
                          onClick={() => startEdit(blog)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...styles.button, ...styles.deleteButton }}
                          onClick={() => handleDeleteBlog(blog._id)}
                        >
                          Delete
                        </button>
                        {blog.status === 'published' && (
                          <a
                            href={`/api/blog/${blog._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.viewButton}
                          >
                            View
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorDashboardPage;