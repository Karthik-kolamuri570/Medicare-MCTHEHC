import React from 'react'
import axios from 'axios'
function LogoutDoctor() {
    axios.get('http://localhost:1600/api/doctor/logout', { withCredentials: true })
    .then(response=>{
        console.log(response.data)
        localStorage.removeItem('token') // Clear token from local storage
        console.log("Logged out successfully")
        window.location.href = '/' 
    })
  return (
    <div>
      <p>Doctor Logout Successful...</p>
    </div>
  )
}

export default LogoutDoctor
