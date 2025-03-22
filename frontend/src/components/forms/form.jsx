import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Assuming you have this CSS file for styling

function Form() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Form Section */}
      <div className="form-container">
        <h2>Choose a Registration Type</h2>

        {/* Buttons to navigate to either Doctor or Patient Registration */}
        <div className="form-buttons">
          <button 
            className="registration-btn" 
            onClick={() => navigate('/api/doctor/register')}
          >
            Go to Doctor Registration
          </button>
          <button 
            className="registration-btn" 
            onClick={() => navigate('/api/patient/register')}
          >
            Go to Patient Registration
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form;
