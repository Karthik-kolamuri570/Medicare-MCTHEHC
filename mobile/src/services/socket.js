import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { triggerLocalNotification } from './notifications';
import { MOCK_MODE } from './api';

const SOCKET_URL = 'http://10.0.2.2:1600';
let socket = null;
let simulationInterval = null;

/**
 * Initialize WebSockets for real-time notifications
 * @param {string} userId - Current logged in user ID
 * @param {string} role - 'patient' or 'doctor'
 */
export async function initializeSocket(userId, role) {
  if (MOCK_MODE) {
    console.log(`[Socket] Simulation initialized for ${role} user: ${userId}`);
    startSimulationEngine(userId, role);
    return;
  }

  try {
    const token = await SecureStore.getItemAsync('auth_access_token');
    if (!token) return;

    socket = io(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend websocket gateway');
      socket.emit('join', userId);
    });

    socket.on('notification', (data) => {
      console.log('[Socket] Notification received:', data);
      triggerLocalNotification(
        data.title || 'Medicare System Update',
        data.message || 'You have a new alert on your dashboard.'
      );
    });

    socket.on('chat-message', (data) => {
      console.log('[Socket] New chat message:', data);
      triggerLocalNotification(
        `Message from ${data.senderName || 'Doctor'}`,
        data.message || 'Click to view message details.'
      );
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
    });

  } catch (err) {
    console.error('Socket initialization failed', err);
  }
}

/**
 * Disconnect socket and clear simulated timers
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('[Socket] Simulation stopped');
  }
}

/**
 * High-fidelity alerts engine to simulate a live production workspace.
 * Generates custom native alerts depending on whether a Patient or Doctor is logged in.
 */
function startSimulationEngine(userId, role) {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  const patientAlerts = [
    { title: 'New Message from Doctor', body: 'Dr. Sophia Patel: Please make sure to update your blood pressure reading before the call.' },
    { title: 'Medication Intake Reminder', body: 'Time to take your Metoprolol Succinate (50mg). Mark it as taken in your checklist!' },
    { title: 'Emergency Blood Request', body: 'Metro Central Blood Bank needs O+ donors urgently due to an ongoing emergency. Tap to donate.' },
    { title: 'Consultation Room Ready', body: 'Your consultation channel is active. Click to connect via chat.' },
  ];

  const doctorAlerts = [
    { title: 'New Appointment Booked', body: 'Patient Karthik Kolamuri booked an online video consultation for tomorrow at 10:30 AM.' },
    { title: 'Second Opinion Assigned', body: 'A new Cardiology file has been submitted for your review. Click to read and report.' },
    { title: 'Lab Results Uploaded', body: 'Patient Karthik Kolamuri added clinical charts to their appointment slot.' },
    { title: 'Blog Post Liked', body: 'Your article "10 Essential Habits for a Healthy Heart" has gained 15 new likes!' },
  ];

  const alerts = role === 'doctor' ? doctorAlerts : patientAlerts;

  // Fire first simulation alert in 20 seconds, and then every 45 seconds
  simulationInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * alerts.length);
    const alert = alerts[randomIndex];
    
    console.log('[Socket Simulation] Firing alert banner:', alert.title);
    triggerLocalNotification(alert.title, alert.body);
  }, 45000);
}
export default { initializeSocket, disconnectSocket };
