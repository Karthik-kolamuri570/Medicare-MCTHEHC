import React, { useState, useEffect } from 'react';

const BlogForm = ({ blog = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    tags: '',
    status: 'draft'
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        description: blog.description || '',
        content: blog.content || '',
        image_url: blog.image_url || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        status: blog.status || 'draft'
      });
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(submitData);
  };

  const styles = {
    form: {
      maxWidth: 700,
      margin: 'auto',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    formGroup: { marginBottom: 20 },
    label: {
      display: 'block',
      marginBottom: 6,
      fontWeight: 600,
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1.8px solid #ddd',
      borderRadius: 6,
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
    },
    inputFocus: {
      borderColor: '#0077cc',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1.8px solid #ddd',
      borderRadius: 6,
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      resize: 'vertical',
      transition: 'border-color 0.3s',
      minHeight: 100,
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1.8px solid #ddd',
      borderRadius: 6,
      fontSize: '1rem',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
    },
    formActions: {
      display: 'flex',
      gap: 15,
      justifyContent: 'flex-start',
      marginTop: 10,
    },
    btnPrimary: {
      padding: '12px 22px',
      borderRadius: 6,
      fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer',
      border: 'none',
      fontSize: '1rem',
      userSelect: 'none',
      backgroundColor: loading ? '#5a9bd8' : '#0077cc',
      color: 'white',
      transition: 'background-color 0.3s',
    },
    btnSecondary: {
      padding: '12px 22px',
      borderRadius: 6,
      fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer',
      border: 'none',
      fontSize: '1rem',
      userSelect: 'none',
      backgroundColor: loading ? '#c7c7c7' : '#e0e0e0',
      color: '#333',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={5}
          maxLength={200}
          disabled={loading}
          style={styles.input}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="description" style={styles.label}>Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={500}
          rows={3}
          disabled={loading}
          style={styles.textarea}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="content" style={styles.label}>Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          minLength={50}
          rows={10}
          disabled={loading}
          style={styles.textarea}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="image_url" style={styles.label}>Image URL</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          disabled={loading}
          style={styles.input}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="tags" style={styles.label}>Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="health, medicine, tips"
          disabled={loading}
          style={styles.input}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        />
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="status" style={styles.label}>Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          style={styles.select}
          onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
          onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div style={styles.formActions}>
        <button type="submit" disabled={loading} style={styles.btnPrimary}>
          {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} style={styles.btnSecondary}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
