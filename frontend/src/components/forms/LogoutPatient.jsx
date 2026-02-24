import React from 'react'
import api from '../../utils/api'

const LogoutPatient = () => {
  // Clear all stored tokens and user data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  // Notify backend (optional, JWT is stateless)
  api.get('/api/patient/logout').catch(() => { });

  window.location.href = '/';

  return (
    <div>
      <p>Logout successfully....</p>
    </div>
  )
}

export default LogoutPatient
