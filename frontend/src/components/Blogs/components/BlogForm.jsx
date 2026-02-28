import React, { useState, useEffect } from 'react';
import { FiImage, FiType, FiFileText, FiLink, FiTag, FiCheckCircle, FiX } from 'react-icons/fi';

const BlogForm = ({ blog = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    tags: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

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
      setImagePreview(blog.image_url || '');
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'image_url') {
      setImagePreview(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title should be at least 5 characters.';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title should not exceed 200 characters.';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description should be at least 10 characters.';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description should not exceed 500 characters.';
    }

    if (!formData.content || formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters.';
    }

    if (formData.image_url) {
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = 'Please enter a valid image URL.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    onSubmit(submitData);
  };

  return (
    <form className="db-form" onSubmit={handleSubmit} noValidate style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      <div className="db-form-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        <div className="db-form-left">
          <div className="dbc-input-group">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <label><FiType /> Title *</label>
              <small style={{color: formData.title.length > 200 ? '#ef4444' : '#94a3b8'}}>{formData.title.length}/200</small>
            </div>
            <input
              type="text"
              name="title"
              className="dbc-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a compelling title..."
              disabled={loading}
              maxLength={200}
            />
            {errors.title && <small style={{color: '#ef4444'}}>{errors.title}</small>}
          </div>

          <div className="dbc-input-group" style={{marginTop: '1.25rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <label><FiFileText /> Description *</label>
              <small style={{color: formData.description.length > 500 ? '#ef4444' : '#94a3b8'}}>{formData.description.length}/500</small>
            </div>
            <textarea
              name="description"
              className="dbc-input"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your blog post..."
              disabled={loading}
              style={{resize: 'none'}}
              maxLength={500}
            />
            {errors.description && <small style={{color: '#ef4444'}}>{errors.description}</small>}
          </div>
        </div>

        <div className="db-form-right">
          <div className="dbc-input-group">
            <label><FiLink /> Image URL</label>
            <input
              type="url"
              name="image_url"
              className="dbc-input"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            {errors.image_url && <small style={{color: '#ef4444'}}>{errors.image_url}</small>}
          </div>

          <div className="db-image-preview-container" style={{marginTop: '1rem', height: '120px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={() => setImagePreview('')} />
            ) : (
              <div style={{textAlign: 'center', color: '#94a3b8'}}>
                <FiImage size={24} style={{display: 'block', margin: '0 auto 0.5rem'}} />
                <span style={{fontSize: '0.8rem'}}>Image Preview</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dbc-input-group">
        <label><FiFileText /> Content *</label>
        <textarea
          name="content"
          className="dbc-input"
          rows="8"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your medical expertise here..."
          disabled={loading}
        />
        {errors.content && <small style={{color: '#ef4444'}}>{errors.content}</small>}
      </div>

      <div className="db-form-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
        <div className="dbc-input-group">
          <label><FiTag /> Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            className="dbc-input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="health, cardiology, tips"
            disabled={loading}
          />
        </div>

        <div className="dbc-input-group">
          <label><FiCheckCircle /> Status</label>
          <select
            name="status"
            className="dbc-input"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="db-form-actions" style={{display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end'}}>
        <button type="button" className="dbc-action-btn dbc-edit-btn" onClick={onCancel} style={{padding: '0.75rem 1.5rem', height: 'auto', borderRadius: '12px'}}>
          Cancel
        </button>
        <button type="submit" className="db-create-btn" disabled={loading}>
          {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
