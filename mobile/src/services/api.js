import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { BACKEND_URL } from '../config';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_DATA_KEY = 'auth_user_details';

// Toggle this to FALSE to use the real backend. Set TRUE only for UI preview without a server.
export const MOCK_MODE = false;

// Create Axios Instance
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

// Axios Request Interceptor (injects Authorization Bearer token)
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios Response Interceptor (handles automatic token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const res = await axios.post(`${BACKEND_URL}/auth/refresh`, { refreshToken });
          if (res.data?.success) {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, res.data.token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, res.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        console.error('Refresh token expired or failed', refreshErr);
        await logoutUser(); // Clean up session
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------
// OFFLINE HIGH-FIDELITY MOCK DATABASE (SIMULATION WORKSPACE)
// ----------------------------------------------------
const MOCK_DB = {
  doctors: [
    { id: 'd1', name: 'Dr. Sophia Patel', specialty: 'Cardiologist', location: 'City Heart Hospital, Block A', rating: 4.9, reviews: 142, fee: 800, status: 'Online', bio: 'Expert in non-invasive cardiology and structural heart diseases with 12+ years of experience.' },
    { id: 'd2', name: 'Dr. David Miller', specialty: 'Pediatrician', location: 'Kids Care Clinic, Downtown', rating: 4.8, reviews: 98, fee: 600, status: 'Online', bio: 'Dedicated child health expert focusing on comprehensive development and preventive healthcare.' },
    { id: 'd3', name: 'Dr. Evelyn Martinez', specialty: 'Neurologist', location: 'Neuroscience Center, Sector 4', rating: 4.9, reviews: 115, fee: 1000, status: 'Offline', bio: 'Specialist in neurological disorders, sleep medicine, and advanced neuro-diagnostics.' },
    { id: 'd4', name: 'Dr. Vikram Seth', specialty: 'Dermatologist', location: 'Skin & Laser Center, Ring Road', rating: 4.7, reviews: 84, fee: 700, status: 'Online', bio: 'Expert in clinical dermatology, acne treatments, and advanced aesthetic procedures.' },
    { id: 'd5', name: 'Dr. Sarah Jenkins', specialty: 'Orthopedic', location: 'Joint & Spine Hospital', rating: 4.8, reviews: 120, fee: 900, status: 'Online', bio: 'Board-certified orthopedic surgeon specializing in joint replacements and sports medicine.' },
  ],
  appointments: [
    { id: 'app_1', doctorId: 'd1', doctorName: 'Dr. Sophia Patel', specialty: 'Cardiologist', date: '2026-06-02', time: '10:30 AM', status: 'Scheduled', type: 'Clinic Visit' },
    { id: 'app_2', doctorId: 'd2', doctorName: 'Dr. David Miller', specialty: 'Pediatrician', date: '2026-06-05', time: '03:15 PM', status: 'Scheduled', type: 'Online Call' },
  ],
  secondOpinions: [
    { id: 'so_1', department: 'Cardiology', description: 'Seeking review of chronic angina diagnosis and suggested stent installation.', fileName: 'angio_report.pdf', date: '2026-05-24', status: 'Pending Review', doctorNotes: '' },
    { id: 'so_2', department: 'Neurology', description: 'Second evaluation of migraine triggers and prescription load.', fileName: 'mri_scan_report.pdf', date: '2026-05-18', status: 'Reviewed', doctorNotes: 'The migraine patterns align with cluster headaches. Recommended tapering off the current analgesics and starting preventive therapy. Rest is highly recommended.' },
  ],
  prescriptions: [
    {
      id: 'pr_1',
      doctorName: 'Dr. Sophia Patel',
      specialty: 'Cardiologist',
      date: '2026-05-25',
      medications: [
        { name: 'Metoprolol Succinate', dose: '50mg', frequency: 'Once daily after breakfast', taken: false, time: '09:00 AM' },
        { name: 'Atorvastatin', dose: '20mg', frequency: 'Once daily before sleep', taken: true, time: '09:30 PM' },
        { name: 'Aspirin', dose: '75mg', frequency: 'Once daily after lunch', taken: false, time: '02:00 PM' }
      ]
    },
    {
      id: 'pr_2',
      doctorName: 'Dr. Vikram Seth',
      specialty: 'Dermatologist',
      date: '2026-05-10',
      medications: [
        { name: 'Fexofenadine', dose: '120mg', frequency: 'Once daily', taken: true, time: '08:00 AM' },
        { name: 'Adapalene Gel', dose: 'Apply thin layer', frequency: 'At bedtime', taken: false, time: '10:00 PM' }
      ]
    }
  ],
  bloodBanks: [
    { id: 'b1', name: 'Metro Central Blood Bank', location: 'Main Street, opposite Metro Pillar 42', contact: '+91 98765 43210', oPositive: 22, aPositive: 15, bPositive: 8, abNegative: 3 },
    { id: 'b2', name: 'Red Cross Resource Center', location: 'Civic Hospital Lane, Sector 2', contact: '+91 99887 76655', oPositive: 12, aPositive: 6, bPositive: 19, abNegative: 1 },
    { id: 'b3', name: 'LifeSource Blood Center', location: 'Circular Bypass, near Ring Road Junction', contact: '+91 88776 65544', oPositive: 30, aPositive: 20, bPositive: 25, abNegative: 6 }
  ],
  bloodCamps: [
    { id: 'c1', title: 'Mega Community Blood Drive', organizer: 'City Welfare Foundation', date: '2026-06-10', venue: 'Community Hall, Sector 4', timings: '09:00 AM - 05:00 PM', status: 'Upcoming' },
    { id: 'c2', title: 'Youth Blood Donation Camp', organizer: 'Red Cross Youth Wing', date: '2026-06-18', venue: 'National College Campus', timings: '10:00 AM - 04:00 PM', status: 'Upcoming' }
  ],
  blogs: [
    { id: 'bl_1', title: '10 Essential Habits for a Healthy Heart', author: 'Dr. Sophia Patel', category: 'Cardiology', summary: 'Simple lifestyle modifications that drastically reduce the risks of cardiac failure and hypertension...', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, id tempor ligula tristique eget. Ut finibus nisl eget nisl pretium pretium. In convallis rhoncus erat, id tempor magna imperdiet eget.', date: '2026-05-24', likes: 38 },
    { id: 'bl_2', title: 'Debunking Common Pediatric Myths', author: 'Dr. David Miller', category: 'Pediatrics', summary: 'An expert pediatrician breaks down popular online misconceptions around child immunization, food habits, and sleep patterns...', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, id tempor ligula tristique eget. Ut finibus nisl eget nisl pretium pretium.', date: '2026-05-20', likes: 54 }
  ],
  notifications: [
    { id: 'n1', title: 'Welcome to Medicare Mobile', message: 'Your healthcare dashboard is fully synced. Find top doctors, track diagnostics, or locate blood banks instantly.', time: '10 min ago', unread: true },
    { id: 'n2', title: 'Prescription Issued', message: 'Dr. Sophia Patel has issued a new prescription for your cardiac follow-up.', time: '2 hours ago', unread: true },
    { id: 'n3', title: 'Second Opinion Available', message: 'Your request for Neurology Second Opinion has been reviewed by the expert consultant.', time: '1 day ago', unread: false }
  ]
};

// Global Current Logged In User State (Simulated)
let currentUser = null;

// ----------------------------------------------------
// NETWORK & MOCK ROUTING SERVICE FUNCTIONS
// ----------------------------------------------------

export const loginUser = async (email, password, role) => {
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Network delay
    
    // Simple check
    const mockUser = {
      userId: role === 'patient' ? 'pat_101' : 'doc_202',
      name: role === 'patient' ? 'Karthik Kolamuri' : 'Dr. Sophia Patel',
      email: email,
      role: role,
      profileImage: null
    };
    
    currentUser = mockUser;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, 'mock-access-jwt-token');
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, 'mock-refresh-jwt-token');
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(mockUser));
    return mockUser;
  } else {
    const endpoint = role === 'patient' ? '/patient/login' : '/doctor/login';
    const response = await api.post(endpoint, { email, password });

    // Backend shape: { success, token, refreshToken, data: { id, name, email, role, profileImage } }
    const userData = response.data.data;

    const userPayload = {
      userId: userData.id,
      name: userData.name,
      role: role,
      profileImage: userData.profileImage || null,
    };

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.token);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.data.refreshToken || '');
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userPayload));
    currentUser = userPayload;
    return userPayload;
  }
};

export const registerUser = async (formData, role) => {
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      userId: role === 'patient' ? 'pat_102' : 'doc_203',
      name: formData.fullname,
      email: formData.email,
      role: role,
      profileImage: null
    };
    currentUser = mockUser;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, 'mock-access-jwt-token');
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, 'mock-refresh-jwt-token');
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(mockUser));
    return mockUser;
  } else {
    const endpoint = role === 'patient' ? '/patient/register' : '/doctor/register';
    // Backend register only accepts: name, email, password, contact, age, gender, address
    // Doctor register may also need specialization etc — send full formData
    const response = await api.post(endpoint, formData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Registration failed');
    }

    // Backend register does NOT return a token — auto-login to get one
    // formData must have { email, password } for this to work
    const loggedInUser = await loginUser(formData.email, formData.password, role);
    return loggedInUser;
  }
};

export const checkAuthSession = async () => {
  try {
    // Clear any stale mock tokens left over from MOCK_MODE sessions
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (!token || token.startsWith('mock-')) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      return null;
    }

    const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);
    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser);

    // --- Validate token against the backend (lightweight ping) ---
    // This prevents stale/expired tokens from causing 401 spam across the app.
    try {
      const role = parsed.role;
      // Both /doctor/me and /patient/me are auth-protected GET endpoints
      const pingEndpoint = role === 'doctor' ? '/doctor/me' : '/patient/me';
      await api.get(pingEndpoint);
      // Token is valid — set current user and return
      currentUser = parsed;
      return parsed;
    } catch (validationErr) {
      if (validationErr.response?.status === 401) {
        // Token is expired or invalid — clear everything and force re-login
        console.log('[Auth] Stored token expired. Clearing session.');
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_DATA_KEY);
        currentUser = null;
        return null;
      }
      // For network errors (offline), trust the stored session optimistically
      if (!validationErr.response) {
        currentUser = parsed;
        return parsed;
      }
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_DATA_KEY);
  currentUser = null;
  return true;
};

// Module API calls
export const getDoctorsList = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.doctors;
  }
  // Backend: GET /api/doctor/ → { success, data: [...doctors] }
  const res = await api.get('/doctor/');
  const raw = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  // Normalize for mobile UI: ensure consistent field names
  return raw.map(d => ({
    ...d,
    id: d.id || d._id?.toString(),
    name: d.name || 'Dr. Unknown',
    specialty: d.specialty || d.specialization || '',
    specialization: d.specialization || d.specialty || '',
    rating: d.rating || d.averageRating || 0,
    fee: d.fee || d.feePerConsultation || 0,
    status: d.status || (d.isAvailable ? 'Online' : 'Offline'),
    location: d.location || d.hospital || d.address || '',
    bio: d.bio || d.about || '',
  }));
};

export const getAppointments = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.appointments;
  }
  const role = currentUser?.role;
  const endpoint = role === 'doctor' ? '/doctor/appointments/' : '/patient/appointments';
  try {
    const res = await api.get(endpoint);
    // Backend: { success, data: [...appointments] }
    // For patient: doctorId is a populated object { _id, name, specialization, profileImage }
    // For doctor: patientId is a populated object { _id, name, email }
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];
    
    // Normalize for mobile UI — extract doctorName, patientName etc from populated refs
    return raw.map(appt => ({
      ...appt,
      // Flatten doctorId populated object for patient appointments
      doctorName: appt.doctorName || appt.doctorId?.name || 'Doctor',
      specialty: appt.specialty || appt.specialization || appt.doctorId?.specialization || '',
      // Flatten patientId populated object for doctor appointments
      patientName: appt.patientName || appt.patientId?.name || 'Patient',
    }));
  } catch (err) {
    // 404 means no appointments yet — treat as empty array
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const bookAppointment = async (appointmentData) => {
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const doctor = MOCK_DB.doctors.find(d => d.id === appointmentData.doctorId);
    const newApp = {
      id: `app_${Math.random().toString(36).substr(2, 9)}`,
      doctorId: appointmentData.doctorId,
      doctorName: doctor ? doctor.name : 'Medical Doctor',
      specialty: doctor ? doctor.specialty : 'General Practice',
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Scheduled',
      type: appointmentData.type || 'Clinic Visit'
    };
    MOCK_DB.appointments.unshift(newApp);
    
    // Add real simulated notification
    MOCK_DB.notifications.unshift({
      id: `n_${Date.now()}`,
      title: 'Appointment Booked',
      message: `Your appointment with ${newApp.doctorName} is confirmed for ${newApp.date} at ${newApp.time}.`,
      time: 'Just now',
      unread: true
    });
    
    return { success: true, appointment: newApp };
  }
  const res = await api.post('/patient/book-appointment', appointmentData);
  // Backend: { success, message, data: appointment }
  return res.data;
};

export const getSecondOpinions = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.secondOpinions;
  }
  const endpoint = currentUser?.role === 'doctor' ? '/doctor/get-second-opinion' : '/patient/get-second-opinion';
  try {
    const res = await api.get(endpoint);
    // Backend: { success, data: [...opinions] }
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const submitSecondOpinion = async (data) => {
  if (MOCK_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newSO = {
      id: `so_${Math.random().toString(36).substr(2, 9)}`,
      department: data.department,
      description: data.description,
      fileName: data.fileName || 'medical_chart.pdf',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
      doctorNotes: ''
    };
    MOCK_DB.secondOpinions.unshift(newSO);
    return { success: true, secondOpinion: newSO };
  }
  const res = await api.post('/patient/get-second-opinion', data);
  return res.data;
};

export const getPrescriptions = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.prescriptions;
  }
  try {
    const res = await api.get('/patient/prescriptions');
    // Backend: { success, data: [...prescriptions] }
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const toggleMedicationTaken = async (prescriptionId, medIndex) => {
  if (MOCK_MODE) {
    const rx = MOCK_DB.prescriptions.find(p => p.id === prescriptionId);
    if (rx && rx.medications[medIndex]) {
      rx.medications[medIndex].taken = !rx.medications[medIndex].taken;
    }
    return rx;
  }
  const res = await api.put(`/patient/prescriptions/${prescriptionId}/medication/${medIndex}`);
  return res.data;
};

export const getBloodBanks = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.bloodBanks;
  }
  try {
    const res = await api.get('/blood-bank/banks');
    return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const getBloodCamps = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.bloodCamps;
  }
  try {
    const res = await api.get('/blood-camp/camps');
    return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const getBlogs = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.blogs;
  }
  try {
    // Backend: GET /api/blogs/blogs → { success, data: [...blogs] }
    const res = await api.get('/blogs/blogs');
    return Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const publishBlog = async (blogData) => {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 800));
    const newBlog = {
      id: `bl_${Date.now()}`,
      title: blogData.title,
      author: currentUser?.name || 'Dr. Sophia Patel',
      category: blogData.category,
      summary: blogData.content.substr(0, 100) + '...',
      content: blogData.content,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    MOCK_DB.blogs.unshift(newBlog);
    return newBlog;
  }
  // Backend: POST /api/blogs/create-blog
  const res = await api.post('/blogs/create-blog', blogData);
  return res.data?.data || res.data;
};

export const createPrescription = async (prescData) => {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 800));
    const newPresc = {
      id: `pr_${Date.now()}`,
      doctorName: currentUser?.name || 'Dr. Sophia Patel',
      specialty: 'General Practice',
      date: new Date().toISOString().split('T')[0],
      medications: prescData.medications.map(m => ({
        name: m.name,
        dose: m.dose,
        frequency: m.frequency,
        taken: false,
        time: m.time || '10:00 AM'
      }))
    };
    MOCK_DB.prescriptions.unshift(newPresc);
    return newPresc;
  }
  const res = await api.post('/doctor/prescription', prescData);
  return res.data?.data || res.data;
};

export const getDoctorStats = async () => {
  if (MOCK_MODE) {
    return {
      name: 'Dr. Sophia Patel',
      todayAppointments: 4,
      totalPatients: 48,
      totalRevenue: 38400,
      rating: 4.9,
      totalRatings: 142,
    };
  }
  try {
    const res = await api.get('/doctor/analytics');
    const d = res.data?.data || {};
    return {
      name: d.name,
      todayAppointments: (d.statusCounts?.pending || 0) + (d.statusCounts?.accepted || 0),
      totalPatients: d.totalPatients || 0,
      totalRevenue: d.totalRevenue || 0,
      rating: d.averageRating || 0,
      totalRatings: d.totalReviews || 0,
    };
  } catch { return null; }
};

export const getNotifications = async () => {
  if (MOCK_MODE) {
    return MOCK_DB.notifications;
  }
  const prefix = currentUser?.role === 'doctor' ? '/doctor' : '/patient';
  try {
    const res = await api.get(`${prefix}/notifications`);
    // Backend: { success, data: { unseenNotifications: [], seenNotifications: [] } }
    // Merge both into a single flat array for the mobile UI
    const d = res.data?.data || {};
    const unseen = (d.unseenNotifications || []).map(n => ({ ...n, unread: true }));
    const seen = (d.seenNotifications || []).map(n => ({ ...n, unread: false }));
    return [...unseen, ...seen];
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const markNotificationsAsRead = async () => {
  if (MOCK_MODE) {
    MOCK_DB.notifications.forEach(n => { n.unread = false; });
    return true;
  }
  // Patient: POST /api/patient/notifications/ marks all as seen
  // Doctor: POST /api/doctor/notifications/mark-seen
  if (currentUser?.role === 'doctor') {
    await api.post('/doctor/notifications/mark-seen');
  } else {
    await api.post('/patient/notifications/');
  }
  return true;
};

export default api;
     