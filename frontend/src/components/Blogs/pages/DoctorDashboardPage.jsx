import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import BlogForm from '../components/BlogForm';
import { 
  FiPlus, FiSearch, FiEdit2, FiTrash2, 
  FiEye, FiMessageSquare, FiHeart, FiCalendar,
  FiFileText, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";
import "../../../styles/DBlogs.css";

const DoctorDashboardPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData) => {
    setSubmitting(true);
    try {
      await blogAPI.createBlog(blogData);
      setShowForm(false);
      toast.success("Blog created successfully!");
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to create blog');
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
      toast.success("Blog updated successfully!");
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to update blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await blogAPI.deleteBlog(blogId);
      toast.success("Blog deleted");
      fetchBlogs();
    } catch (err) {
      toast.error('Failed to delete blog');
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

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="db-container"><Loader /></div>;

  return (
    <div className="db-container">
      <div className="db-max-width">
        <header className="db-header">
          <div className="db-title-section">
            <h1>My Blogs</h1>
            <p>Share your medical expertise and insights with the community</p>
          </div>
          <button
            className="db-create-btn"
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            <FiPlus /> Create New Blog
          </button>
        </header>

        {error && <div className="dbc-alert" style={{background: '# fee2e2', color: '#ef4444', border: '1px solid #fecaca'}}>{error}</div>}

        <div className="db-controls">
          <div className="db-search-wrapper">
            <FiSearch className="db-search-icon" />
            <input 
              type="text" 
              className="db-search-input"
              placeholder="Search your blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="db-filters">
            {["all", "published", "draft", "archived"].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`db-filter-btn ${statusFilter === status ? 'active' : ''}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="dbc-modal-overlay"
              style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={cancelForm}
            >
              <div 
                className="dbc-modal" 
                style={{maxWidth: '800px', background: 'white', borderRadius: '24px', overflow: 'hidden'}}
                onClick={e => e.stopPropagation()}
              >
                <header className="dbc-modal-header" style={{display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9'}}>
                  <h2 style={{margin: 0, fontSize: '1.5rem'}}>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
                  <button onClick={cancelForm} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'}}><FiX /></button>
                </header>
                <div style={{padding: '2rem', maxHeight: '70vh', overflowY: 'auto'}}>
                  <BlogForm
                    blog={editingBlog}
                    onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
                    onCancel={cancelForm}
                    loading={submitting}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="db-grid">
          <AnimatePresence>
            {filteredBlogs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="db-empty"
                style={{gridColumn: '1 / -1'}}
              >
                <span className="db-empty-icon">📝</span>
                <h3>No blogs found</h3>
                <p>Try adjusting your search or create your first health blog!</p>
              </motion.div>
            ) : (
              filteredBlogs.map(blog => (
                <motion.div 
                  key={blog._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="db-card"
                >
                  {blog.image_url && (
                    <img src={blog.image_url} alt={blog.title} className="db-card-image" />
                  )}
                  <div className="db-card-content">
                    <span className={`db-status-badge db-status-${blog.status}`}>
                      {blog.status}
                    </span>
                    <h3 className="db-blog-title">{blog.title}</h3>
                    <p className="db-blog-desc">{blog.description}</p>
                    
                    <div className="db-info-row" style={{marginTop: 'auto', color: '#94a3b8', fontSize: '0.8rem'}}>
                      <FiCalendar className="db-icon" style={{marginRight: '0.5rem'}} />
                      {new Date(blog.Created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="db-card-footer">
                    <div className="db-stats">
                      <div className="db-stat-item">
                        <FiHeart /> {blog.likes_count || 0}
                      </div>
                      <div className="db-stat-item">
                        <FiMessageSquare /> {blog.comments_count || 0}
                      </div>
                    </div>
                    <div className="db-actions">
                      {blog.status === 'published' && (
                        <a
                          href={`/blog/${blog._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="db-action-btn db-view-btn"
                          title="View Post"
                        >
                          <FiEye />
                        </a>
                      )}
                      <button
                        className="db-action-btn db-edit-btn"
                        onClick={() => startEdit(blog)}
                        title="Edit Blog"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="db-action-btn db-delete-btn"
                        onClick={() => handleDeleteBlog(blog._id)}
                        title="Delete Blog"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
