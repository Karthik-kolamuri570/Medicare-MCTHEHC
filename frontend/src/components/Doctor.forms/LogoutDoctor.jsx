import React from 'react'
import api from '../../utils/api'

function LogoutDoctor() {
  // Clear all stored tokens and user data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  // Notify backend (optional, JWT is stateless)
  api.get('/api/doctor/logout').catch(() => { });

  window.location.href = '/';

  return (
    <div>
      <p>Doctor Logout Successful...</p>
    </div>
  )
}

export default LogoutDoctor
