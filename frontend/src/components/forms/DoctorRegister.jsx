// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function Doctor() {
//   const navigate = useNavigate();

//   return (
//     <div className="form-container">
//       <h1>Doctor Registration</h1>
//       <form className="form">
//         <label>Name:</label>
//         <input type="text" name="name" placeholder="Enter your name" />
//         <br />

//         <label>Email:</label>
//         <input type="email" name="email" placeholder="Enter your email" />
//         <br />

//         <label>Phone:</label>
//         <input type="tel" name="phone" placeholder="Enter your phone number" />
//         <br />

//         <label>Password:</label>
//         <input type="password" name="password" placeholder="Enter your password" />
//         <br />

//         <label>Confirm Password:</label>
//         <input type="password" name="confirmPassword" placeholder="Confirm your password" />
//         <br />

//         <label>Specialization:</label>
//         <input type="text" name="specialization" placeholder="Enter your specialization" />
//         <br />

//         <label>Experience (Years):</label>
//         <input type="number" name="experience" placeholder="Enter years of experience" />
//         <br />

//         <label>Hospital:</label>
//         <input type="text" name="hospital" placeholder="Enter hospital name" />
//         <br />

//         <label>Fee per Consultation:</label>
//         <input type="number" name="fee" placeholder="Enter consultation fee" />
//         <br />

//         <label>Availability (From - To):</label>
//         <input type="text" name="availability" placeholder="Enter available time" />
//         <br />

//         <button type="submit" className="register-btn" onClick={() => navigate("/login")}>
//           Register
//         </button>
//       </form>
//       <p className="login-link">
//         Already registered?{" "}
//         <a href="#" onClick={() => navigate("/login")}>
//           Login
//         </a>
//       </p>
//     </div>
//   );
// }

// export default Doctor;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Doctor() {
  const navigate = useNavigate();

  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: '',
    location: '',
    hospital: '',
    feePerConsultation: '',
    fromTime: '',
    toTime: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.contact || formData.contact.length !== 10 || !/^\d{10}$/.test(formData.contact)) 
      errors.contact = 'Contact must be a 10-digit number';
    
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) {
      errors.password = 'Passwords do not match';
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.experience || formData.experience <= 0) errors.experience = 'Experience must be greater than 0';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.hospital) errors.hospital = 'Hospital is required';
    if (!formData.feePerConsultation || formData.feePerConsultation <= 0) 
      errors.feePerConsultation = 'Fee per consultation must be greater than 0';
    if (!formData.fromTime) errors.fromTime = 'From time is required';
    if (!formData.toTime) errors.toTime = 'To time is required';

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setValidationErrors({});

    try {
      // Sending POST request to register the doctor
      const response = await axios.post('http://localhost:1600/api/doctor/register', formData);

      if (response.status === 201) {
        // Redirect to login on successful registration
        navigate('/api/doctor/login');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred during registration:', error); // Log error for debugging
      const errorResponseMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
      setErrorMessage(errorResponseMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Doctor Registration</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        {validationErrors.name && <p className="error">{validationErrors.name}</p>}
        <br />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {validationErrors.email && <p className="error">{validationErrors.email}</p>}
        <br />

        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          placeholder="Enter your contact number"
          value={formData.contact}
          onChange={handleChange}
        />
        {validationErrors.contact && <p className="error">{validationErrors.contact}</p>}
        <br />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        {validationErrors.password && <p className="error">{validationErrors.password}</p>}
        <br />

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {validationErrors.confirmPassword && <p className="error">{validationErrors.confirmPassword}</p>}
        <br />

        <label>Specialization:</label>
        <input
          type="text"
          name="specialization"
          placeholder="Enter your specialization"
          value={formData.specialization}
          onChange={handleChange}
        />
        {validationErrors.specialization && <p className="error">{validationErrors.specialization}</p>}
        <br />

        <label>Experience (Years):</label>
        <input
          type="number"
          name="experience"
          placeholder="Enter years of experience"
          value={formData.experience}
          onChange={handleChange}
        />
        {validationErrors.experience && <p className="error">{validationErrors.experience}</p>}
        <br />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={formData.location}
          onChange={handleChange}
        />
        {validationErrors.location && <p className="error">{validationErrors.location}</p>}
        <br />

        <label>Hospital:</label>
        <input
          type="text"
          name="hospital"
          placeholder="Enter hospital name"
          value={formData.hospital}
          onChange={handleChange}
        />
        {validationErrors.hospital && <p className="error">{validationErrors.hospital}</p>}
        <br />

        <label>Fee per Consultation:</label>
        <input
          type="number"
          name="feePerConsultation"
          placeholder="Enter consultation fee"
          value={formData.feePerConsultation}
          onChange={handleChange}
        />
        {validationErrors.feePerConsultation && <p className="error">{validationErrors.feePerConsultation}</p>}
        <br />

        <label>From Time:</label>
        <input
          type="time"
          name="fromTime"
          placeholder="Enter from time (e.g., 9:00 AM)"
          value={formData.fromTime}
          onChange={handleChange}
        />
        {validationErrors.fromTime && <p className="error">{validationErrors.fromTime}</p>}
        <br />

        <label>To Time:</label>
        <input
          type="time"
          name="toTime"
          placeholder="Enter to time (e.g., 5:00 PM)"
          value={formData.toTime}
          onChange={handleChange}
        />
        {validationErrors.toTime && <p className="error">{validationErrors.toTime}</p>}
        <br />

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="login-link">
        Already registered?{" "}
        <a href="#" onClick={() => navigate("/api/doctor/login")}>
          Login
        </a>
      </p>
    </div>
  );
}

export default Doctor;
