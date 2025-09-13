// import React, { useState, useEffect } from 'react';

// const BlogForm = ({ blog = null, onSubmit, onCancel, loading = false }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     content: '',
//     image_url: '',
//     tags: '',
//     status: 'draft'
//   });

//   useEffect(() => {
//     if (blog) {
//       setFormData({
//         title: blog.title || '',
//         description: blog.description || '',
//         content: blog.content || '',
//         image_url: blog.image_url || '',
//         tags: blog.tags ? blog.tags.join(', ') : '',
//         status: blog.status || 'draft'
//       });
//     }
//   }, [blog]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const submitData = {
//       ...formData,
//       tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
//     };
//     onSubmit(submitData);
//   };

//   const styles = {
//     form: {
//       maxWidth: 700,
//       margin: 'auto',
//       backgroundColor: 'white',
//       padding: 20,
//       borderRadius: 8,
//       boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
//       fontFamily: 'Arial, sans-serif',
//     },
//     formGroup: { marginBottom: 20 },
//     label: {
//       display: 'block',
//       marginBottom: 6,
//       fontWeight: 600,
//       color: '#333',
//     },
//     input: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.3s',
//     },
//     inputFocus: {
//       borderColor: '#0077cc',
//       outline: 'none',
//     },
//     textarea: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       resize: 'vertical',
//       transition: 'border-color 0.3s',
//       minHeight: 100,
//     },
//     select: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.3s',
//     },
//     formActions: {
//       display: 'flex',
//       gap: 15,
//       justifyContent: 'flex-start',
//       marginTop: 10,
//     },
//     btnPrimary: {
//       padding: '12px 22px',
//       borderRadius: 6,
//       fontWeight: 600,
//       cursor: loading ? 'not-allowed' : 'pointer',
//       border: 'none',
//       fontSize: '1rem',
//       userSelect: 'none',
//       backgroundColor: loading ? '#5a9bd8' : '#0077cc',
//       color: 'white',
//       transition: 'background-color 0.3s',
//     },
//     btnSecondary: {
//       padding: '12px 22px',
//       borderRadius: 6,
//       fontWeight: 600,
//       cursor: loading ? 'not-allowed' : 'pointer',
//       border: 'none',
//       fontSize: '1rem',
//       userSelect: 'none',
//       backgroundColor: loading ? '#c7c7c7' : '#e0e0e0',
//       color: '#333',
//       transition: 'background-color 0.3s',
//     },
//   };

//   return (
//     <form style={styles.form} onSubmit={handleSubmit}>
//       <div style={styles.formGroup}>
//         <label htmlFor="title" style={styles.label}>Title *</label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           minLength={5}
//           maxLength={200}
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="description" style={styles.label}>Description *</label>
//         <textarea
//           id="description"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//           minLength={10}
//           maxLength={500}
//           rows={3}
//           disabled={loading}
//           style={styles.textarea}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="content" style={styles.label}>Content *</label>
//         <textarea
//           id="content"
//           name="content"
//           value={formData.content}
//           onChange={handleChange}
//           required
//           minLength={50}
//           rows={10}
//           disabled={loading}
//           style={styles.textarea}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="image_url" style={styles.label}>Image URL</label>
//         <input
//           type="url"
//           id="image_url"
//           name="image_url"
//           value={formData.image_url}
//           onChange={handleChange}
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="tags" style={styles.label}>Tags (comma separated)</label>
//         <input
//           type="text"
//           id="tags"
//           name="tags"
//           value={formData.tags}
//           onChange={handleChange}
//           placeholder="health, medicine, tips"
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="status" style={styles.label}>Status</label>
//         <select
//           id="status"
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//           disabled={loading}
//           style={styles.select}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         >
//           <option value="draft">Draft</option>
//           <option value="published">Published</option>
//           <option value="archived">Archived</option>
//         </select>
//       </div>

//       <div style={styles.formActions}>
//         <button type="submit" disabled={loading} style={styles.btnPrimary}>
//           {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
//         </button>
//         <button type="button" onClick={onCancel} disabled={loading} style={styles.btnSecondary}>
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BlogForm;
























// import React, { useState, useEffect } from 'react';

// const BlogForm = ({ blog = null, onSubmit, onCancel, loading = false }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     content: '',
//     image_url: '',
//     tags: '',
//     status: 'draft'
//   });

//   // Error states for validation feedback
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (blog) {
//       setFormData({
//         title: blog.title || '',
//         description: blog.description || '',
//         content: blog.content || '',
//         image_url: blog.image_url || '',
//         tags: blog.tags ? blog.tags.join(', ') : '',
//         status: blog.status || 'draft'
//       });
//     }
//   }, [blog]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear error for this field on change
//     setErrors(prev => ({
//       ...prev,
//       [name]: null
//     }));
//   };

//   // Validation checks
//   const validate = () => {
//     const newErrors = {};

//     if (!formData.title || formData.title.length < 20 || formData.title.length > 50) {
//       newErrors.title = 'Title must be between 20 and 50 characters.';
//     }

//     if (!formData.description || formData.description.length < 100 || formData.description.length > 180) {
//       newErrors.description = 'Description must be between 100 and 180 characters.';
//     }

//     if (!formData.content || formData.content.length < 50) {
//       newErrors.content = 'Content must be at least 50 characters.';
//     }

//     // image_url is optional, but if provided, it should be a valid URL format
//     if (formData.image_url) {
//       try {
//         new URL(formData.image_url);
//       } catch {
//         newErrors.image_url = 'Image URL must be a valid URL.';
//       }
//     }

//     // tags are optional

//     if (!['draft', 'published', 'archived'].includes(formData.status)) {
//       newErrors.status = 'Status must be draft, published, or archived.';
//     }

//     setErrors(newErrors);
//     // Return true if no errors
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       // Do not submit if validation fails
//       return;
//     }
//     const submitData = {
//       ...formData,
//       tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
//     };
//     onSubmit(submitData);
//   };

//   const styles = {
//     form: {
//       maxWidth: 700,
//       margin: 'auto',
//       backgroundColor: 'white',
//       padding: 20,
//       borderRadius: 8,
//       boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
//       fontFamily: 'Arial, sans-serif',
//     },
//     formGroup: { marginBottom: 20 },
//     label: {
//       display: 'block',
//       marginBottom: 6,
//       fontWeight: 600,
//       color: '#333',
//     },
//     input: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.3s',
//     },
//     inputFocus: {
//       borderColor: '#0077cc',
//       outline: 'none',
//     },
//     textarea: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       resize: 'vertical',
//       transition: 'border-color 0.3s',
//       minHeight: 100,
//     },
//     select: {
//       width: '100%',
//       padding: '10px 12px',
//       border: '1.8px solid #ddd',
//       borderRadius: 6,
//       fontSize: '1rem',
//       fontFamily: 'inherit',
//       boxSizing: 'border-box',
//       transition: 'border-color 0.3s',
//     },
//     formActions: {
//       display: 'flex',
//       gap: 15,
//       justifyContent: 'flex-start',
//       marginTop: 10,
//     },
//     btnPrimary: {
//       padding: '12px 22px',
//       borderRadius: 6,
//       fontWeight: 600,
//       cursor: loading ? 'not-allowed' : 'pointer',
//       border: 'none',
//       fontSize: '1rem',
//       userSelect: 'none',
//       backgroundColor: loading ? '#5a9bd8' : '#0077cc',
//       color: 'white',
//       transition: 'background-color 0.3s',
//     },
//     btnSecondary: {
//       padding: '12px 22px',
//       borderRadius: 6,
//       fontWeight: 600,
//       cursor: loading ? 'not-allowed' : 'pointer',
//       border: 'none',
//       fontSize: '1rem',
//       userSelect: 'none',
//       backgroundColor: loading ? '#c7c7c7' : '#e0e0e0',
//       color: '#333',
//       transition: 'background-color 0.3s',
//     },
//     errorText: {
//       color: 'red',
//       marginTop: 4,
//       fontSize: '0.85rem',
//       fontWeight: '500',
//     }
//   };

//   return (
//     <form style={styles.form} onSubmit={handleSubmit} noValidate>
//       <div style={styles.formGroup}>
//         <label htmlFor="title" style={styles.label}>Title *</label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           minLength={5}
//           maxLength={200}
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//         {errors.title && <div style={styles.errorText}>{errors.title}</div>}
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="description" style={styles.label}>Description *</label>
//         <textarea
//           id="description"
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//           minLength={10}
//           maxLength={500}
//           rows={3}
//           disabled={loading}
//           style={styles.textarea}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//         {errors.description && <div style={styles.errorText}>{errors.description}</div>}
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="content" style={styles.label}>Content *</label>
//         <textarea
//           id="content"
//           name="content"
//           value={formData.content}
//           onChange={handleChange}
//           required
//           minLength={50}
//           rows={10}
//           disabled={loading}
//           style={styles.textarea}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//         {errors.content && <div style={styles.errorText}>{errors.content}</div>}
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="image_url" style={styles.label}>Image URL</label>
//         <input
//           type="url"
//           id="image_url"
//           name="image_url"
//           value={formData.image_url}
//           onChange={handleChange}
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//         {errors.image_url && <div style={styles.errorText}>{errors.image_url}</div>}
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="tags" style={styles.label}>Tags (comma separated)</label>
//         <input
//           type="text"
//           id="tags"
//           name="tags"
//           value={formData.tags}
//           onChange={handleChange}
//           placeholder="health, medicine, tips"
//           disabled={loading}
//           style={styles.input}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         />
//       </div>

//       <div style={styles.formGroup}>
//         <label htmlFor="status" style={styles.label}>Status</label>
//         <select
//           id="status"
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//           disabled={loading}
//           style={styles.select}
//           onFocus={e => e.currentTarget.style.borderColor = '#0077cc'}
//           onBlur={e => e.currentTarget.style.borderColor = '#ddd'}
//         >
//           <option value="draft">Draft</option>
//           <option value="published">Published</option>
//           <option value="archived">Archived</option>
//         </select>
//         {errors.status && <div style={styles.errorText}>{errors.status}</div>}
//       </div>

//       <div style={styles.formActions}>
//         <button type="submit" disabled={loading} style={styles.btnPrimary}>
//           {loading ? 'Saving...' : (blog ? 'Update Blog' : 'Create Blog')}
//         </button>
//         <button type="button" onClick={onCancel} disabled={loading} style={styles.btnSecondary}>
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BlogForm;













































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

  // Error states for validation feedback
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

    // Update image preview if image_url changes
    if (name === 'image_url') {
      setImagePreview(value);
    }

    // Clear error for this field on change
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));
  };

  // Validation checks
  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 20 || formData.title.length > 50) {
      newErrors.title = 'Title must be between 20 and 50 characters.';
    }

    if (!formData.description || formData.description.length < 100 || formData.description.length > 180) {
      newErrors.description = 'Description must be between 100 and 180 characters.';
    }

    if (!formData.content || formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters.';
    }

    // image_url is optional, but if provided, it should be a valid URL format
    if (formData.image_url) {
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = 'Image URL must be a valid URL.';
      }
    }

    // tags are optional

    if (!['draft', 'published', 'archived'].includes(formData.status)) {
      newErrors.status = 'Status must be draft, published, or archived.';
    }

    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Do not submit if validation fails
      return;
    }
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
      transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    inputHover: {
      borderColor: '#0077cc',
      boxShadow: '0 0 8px rgba(0, 119, 204, 0.5)'
    },
    inputFocus: {
      borderColor: '#0077cc',
      outline: 'none',
      boxShadow: '0 0 8px rgba(0, 119, 204, 0.7)'
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
    errorText: {
      color: 'red',
      marginTop: 4,
      fontSize: '0.85rem',
      fontWeight: '500',
    },
    imagePreview: {
      marginTop: 10,
      maxWidth: '100%',
      maxHeight: 200,
      borderRadius: 6,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      objectFit: 'contain',
      display: 'block'
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit} noValidate>
      <div style={styles.formGroup}>
        <label htmlFor="title" style={styles.label}>Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={20}
          maxLength={50}
          disabled={loading}
          style={styles.input}
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
        />
        {errors.title && <div style={styles.errorText}>{errors.title}</div>}
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="description" style={styles.label}>Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={100}
          maxLength={180}
          rows={3}
          disabled={loading}
          style={styles.textarea}
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
        />
        {errors.description && <div style={styles.errorText}>{errors.description}</div>}
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
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
        />
        {errors.content && <div style={styles.errorText}>{errors.content}</div>}
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
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
        />
        {errors.image_url && <div style={styles.errorText}>{errors.image_url}</div>}

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={styles.imagePreview}
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
        )}
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
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
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
          onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
          onBlur={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
          onMouseEnter={e => Object.assign(e.currentTarget.style, styles.inputHover)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, {borderColor:'#ddd', boxShadow:'none'})}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && <div style={styles.errorText}>{errors.status}</div>}
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
