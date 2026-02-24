import axios from 'axios';

// Create a centralized Axios instance with JWT interceptor
const api = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT to every outgoing request
api.interceptors.request.use(
    (config) => {
        // Use adminToken for admin routes, otherwise use standard token
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');

        if (config.url.includes('/api/admin') && adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        } else if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by redirecting to appropriate login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear stored tokens 
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');

            // Determine which login page to redirect to
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else if (currentPath.startsWith('/doctor')) {
                window.location.href = '/doctor/login';
            } else if (currentPath.startsWith('/blood-bank')) {
                window.location.href = '/blood-bank/login';
            } else {
                window.location.href = '/login/patient';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
