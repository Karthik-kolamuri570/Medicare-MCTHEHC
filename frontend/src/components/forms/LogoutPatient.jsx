import React from 'react'
import axios from 'axios'

const LogoutPatient = () => {
    axios.get('http://localhost:1600/api/patient/logout', { withCredentials: true })
    .then(response => {
        console.log("Logout Response:", response.data);
        localStorage.removeItem('token'); // Clear token from local storage
        console.log("Logged out successfully");

        window.location.href = '/'; // Redirect to home page
    })
  return (
    <div>
      <p>Logout successfully....</p>
    </div>
  )
}

export default LogoutPatient
