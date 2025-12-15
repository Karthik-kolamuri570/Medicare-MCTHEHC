import axios from 'axios';

const API_BASE_URL = 'http://localhost:1600/api/admin';

const adminService = {
  // Authentication
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  logout: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { token });
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Doctors
  getPendingDoctors: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/pending-doctors`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  approveDoctorRegistration: async (doctorId) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_BASE_URL}/approve-doctor/${doctorId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  rejectDoctorRegistration: async (doctorId) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_BASE_URL}/reject-doctor/${doctorId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Analytics
  getPatientAnalytics: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/patient-analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAppointmentAnalytics: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/appointment-analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getRevenueDetails: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/revenue-details`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
,

  // Users
  getAllUsers: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getUserById: async (userId) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
,

  // Fetch doctor profile (used by admin view details)
  getDoctorProfile: async (doctorId) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`http://localhost:1600/api/doctor/profile/${doctorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
,

  getAllAppointments: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
,

  // Flexible get with query params (page, limit, status, doctorId, fromDate, toDate, q)
  getAppointments: async (params = {}) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.get(`${API_BASE_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  bulkCancelAppointments: async (appointmentIds) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_BASE_URL}/appointments/bulk-cancel`, { appointmentIds }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  rescheduleAppointment: async (appointmentId, date, time) => {
    const token = localStorage.getItem('adminToken');
    const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, { date, time }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Fetch doctors list for filters (uses public doctor endpoint)
  getDoctors: async (params = {}) => {
    const response = await axios.get(`http://localhost:1600/api/doctor`, { params });
    return response.data;
  }
};

export default adminService;
