import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './BlogModeration.css';

const BlogCard = ({ blog, onView, onDelete }) => {
  const img = blog.image_url || '/placeholder-blog.png';
  const author = blog.doctor_id || {};

  return (
    <div className="blog-card-item">
      <div className="card-media">
        <img src={img} alt={blog.title} />
      </div>
      <div className="card-body">
        <div className="meta">
          <div className="author">
            <img className="avatar" src={author.profileImage || '/avatar-placeholder.png'} alt={author.name || 'Dr'} />
            <div className="author-name">{author.name || 'Unknown'}</div>
          </div>
          <div className={`status-badge ${blog.status}`}>{blog.status}</div>
        </div>

        <h3 className="card-title">{blog.title}</h3>
        <p className="card-excerpt">{blog.description}</p>

        <div className="card-footer">
          <div className="tags">
            {(blog.tags || []).slice(0,3).map(t => (<span key={t} className="tag">#{t}</span>))}
          </div>
          <div className="actions">
            <button className="icon-btn view" title="View" onClick={()=>onView(blog)} aria-label={`View ${blog.title}`}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="icon-btn delete" title="Delete" onClick={()=>onDelete(blog._id)} aria-label={`Delete ${blog.title}`}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogModeration = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBlogs({ page, limit, q, status });
      if (res.success) {
        setBlogs(res.blogs || []);
        setTotal(res.meta?.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, q, status]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog? This action cannot be undone.')) return;
    try {
      const res = await adminService.deleteBlog(id);
      if (res.success) {
        load();
      } else {
        alert(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting blog');
    }
  };

  // Delete directly from modal (no double-confirm)
  const handleModalDelete = async (id) => {
    if (!confirm('Delete this blog? This action cannot be undone.')) return;
    try {
      const res = await adminService.deleteBlog(id);
      if (res.success) {
        setSelected(null);
        load();
      } else {
        alert(res.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting blog');
    }
  };

  return (
    <div className="admin-blogs-page">
      <div className="toolbar">
        <div className="left">
          <h2>Blog Moderation</h2>
          <p className="subtitle">Review and manage blogs published by doctors across the platform.</p>
        </div>

        <div className="controls">
          <input placeholder="Search title or content" value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} />
          <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
            <option>All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="cards-grid">
        {loading && <div className="muted">Loading…</div>}
        {!loading && blogs.length === 0 && <div className="muted">No blogs found</div>}
        {blogs.map(b => (
          <BlogCard key={b._id} blog={b} onView={(blog)=>setSelected(blog)} onDelete={handleDelete} />
        ))}
      </div>

      <div className="pagination">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span>Page {page} • {total} blogs</span>
        <button disabled={page*limit >= total} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <button className="close" onClick={()=>setSelected(null)}>✕</button>
            </div>
              <div className="modal-body">
                {selected.image_url && <img className="modal-image" src={selected.image_url} alt={selected.title} />}

                <div className="modal-meta-row">
                  <p className="modal-meta">By {selected.doctor_id?.name || '—'} • {selected.published_at ? new Date(selected.published_at).toLocaleString() : 'Not published'}</p>
                  <div className="modal-stats">
                    <div className="stat">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                      <span>{selected.likes_count ?? (selected.likes ? selected.likes.length : 0)}</span>
                    </div>
                    <div className="stat">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                      <span>{selected.comments_count ?? (selected.comments ? selected.comments.length : 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-content">{selected.content}</div>

                <div className="comments-section">
                  <h4>Comments ({selected.comments_count ?? (selected.comments ? selected.comments.length : 0)})</h4>
                  <div className="comments-list">
                    {(selected.comments || []).length === 0 && <div className="muted">No comments yet</div>}
                    {(selected.comments || []).map((c, idx) => (
                      <div className="comment-item" key={c._id || idx}>
                        <img className="comment-avatar" src={c.user?.avatar || '/avatar-placeholder.png'} alt={c.user?.name || 'User'} />
                        <div className="comment-body">
                          <div className="comment-author">{c.user?.name || c.authorName || 'Anonymous'}</div>
                          <div className="comment-text">{c.text || c.content || c.body}</div>
                          <div className="comment-time muted">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-danger" onClick={()=>handleModalDelete(selected._id)}>Delete</button>
                <button className="btn-outline" onClick={()=>setSelected(null)}>Close</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogModeration;
