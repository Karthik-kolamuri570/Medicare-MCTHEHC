import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import User from '../forms/User';
// import Doctor from '../forms/Doctor';
// import Login from '../forms/LoginDoctor';  // Not needed anymore in this component
// import Header from './Header';
// import Footer from './Footer';
import './style.css';

function Form() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleFormSwitch = (formType) => {
    // Use navigate to change the route for the form
    if (formType === 'user') {
      navigate('/api/patient/register'); // Navigate to the User registration page
    } else {
      navigate('/api/doctor/register');
     } // Navigate to the Doctor registration page
    // } else if (formType === 'loginPatient') {
    //   navigate('/api/patient/login'); // Navigate to the Patient login page
    // } else if (formType === 'loginDoctor') {
    //   navigate('/api/doctor/login'); // Navigate to the Doctor login page
    
    setDropdownOpen(false); // Close the dropdown after selecting an option
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  return (
    <div className="app-container">
      <div className="login-dropdown-container">
        <button className="login-btn" onClick={toggleDropdown}>Register</button>
        {dropdownOpen && (
          <div className="dropdown">
            <button className="dropdown-item" onClick={() => navigate("/api/patient/register")}>User Registration</button>
            <button className="dropdown-item" onClick={() => navigate('/api/doctor/register')}>Doctor Registration</button>
            {/* <button className="dropdown-item" onClick={() => handleFormSwitch('loginPatient')}>Patient Login</button>
            <button className="dropdown-item" onClick={() => handleFormSwitch('loginDoctor')}>Doctor Login</button> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Form;
