import axios from 'axios';

// Create a centralized Axios instance with JWT interceptor and withCredentials enabled
const api = axios.create({
    baseURL: '',
    withCredentials: true,
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor — handle 401 by attempting to refresh token before redirecting
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Avoid looping refresh requests if /api/auth/refresh itself returns 401
            if (originalRequest.url.includes('/api/auth/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call centralized refresh endpoint passing the token in body
                const currentRefreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post('/api/auth/refresh', { refreshToken: currentRefreshToken });
                const { token, refreshToken } = res.data;

                if (token) {
                    if (originalRequest.url.includes('/api/admin')) {
                        localStorage.setItem('adminToken', token);
                    } else {
                        localStorage.setItem('token', token);
                    }
                }
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }

                isRefreshing = false;
                processQueue(null, token);

                if (token) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);

                // Clear stored credentials
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');

                const reqUrl = originalRequest.url;
                if (reqUrl.includes('/api/admin')) {
                    window.location.href = '/login?role=admin';
                } else if (reqUrl.includes('/api/doctor')) {
                    window.location.href = '/login?role=doctor';
                } else if (reqUrl.includes('/api/blood-bank')) {
                    window.location.href = '/login?role=bank';
                } else {
                    window.location.href = '/login?role=patient';
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Uploads a file directly to Amazon S3 via secure pre-signed PUT URLs.
 * Bypasses backend server processing entirely to minimize memory/CPU overhead.
 * @param {File} file - The file object to upload.
 * @returns {Promise<string>} - Resolves with the secure S3 key to store in the database.
 */
export const uploadFileToS3 = async (file) => {
    if (!file) throw new Error('No file provided for S3 upload.');

    // 1. Fetch pre-signed PUT URL from our API
    const response = await api.post('/api/s3/presign', {
        fileName: file.name,
        fileType: file.type
    });

    const { uploadUrl, fileUrl } = response.data;

    // 2. Perform direct binary upload to S3 via PUT (using pure axios without global interceptors)
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type
        }
    });

    // 3. Return S3 key/url to be stored in Mongoose models
    return fileUrl;
};

export default api;
