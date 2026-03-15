import { io } from 'socket.io-client';

const SOCKET_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://127.0.0.1:1600'
  : window.location.origin;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export const connectSocket = (userId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No token available for socket connection');
    return;
  }

  if (!socket.connected) {
    // Pass token in auth
    socket.auth = { token };
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      if (userId) {
        socket.emit('join', userId);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  } else if (userId) {
    socket.emit('join', userId);
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
