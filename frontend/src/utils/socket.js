import { io } from 'socket.io-client';

const SOCKET_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://127.0.0.1:1600'
  : window.location.origin;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true
});

export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.on('connect', () => {
      // console.log('Connected to socket server');
      if (userId) {
        socket.emit('join', userId);
      }
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
