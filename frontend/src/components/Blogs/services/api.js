import axios from 'axios';

const API_BASE_URL = 'http://localhost:1600/api/blogs';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensure cookies/session are sent with requests
});

// Blogs
export const blogAPI = {
  getAllBlogs: (params) => api.get('/blogs', { params }),
  searchBlogs: (params) => api.get('/blogs/search', { params }),
  getBlogById: (id) => api.get(`/blog/${id}`),
  createBlog: (data) => api.post('/create-blog', data),
  updateBlog: (id, data) => api.put(`/update-blog/${id}`, data),
  deleteBlog: (id) => api.delete(`/delete-blog/${id}`),
  getDoctorBlogs: () => api.get('/doctor/blogs'),
};

// Likes
export const likeAPI = {
  toggleLike: (data) => api.post('/like/toggle', data),
  checkLikeStatus: (params) => api.get('/like/status', { params }),
  getPatientLikes: (params) => api.get('/patient/likes', { params }),
  getBlogLikes: (blogId, params) => api.get(`/${blogId}/likes`, { params }),
};

// Comments
export const commentAPI = {
  addComment: (data) => api.post('/add-comment', data),
  getBlogComments: (blogId, params) => api.get(`/${blogId}/comments`, { params }),
  updateComment: (id, data) => api.put(`/update-comment/${id}`, data),
  deleteComment: (id) => api.delete(`/delete-comment/${id}`),
  toggleCommentApproval: (id) => api.patch(`/comments/${id}/approval`),
};

export default api;
