import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './UserRegistration.css'; // Assuming you will add CSS styles to this file

const User = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle gender change
  const handleGenderChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      gender: value
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};

    // Basic validation
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.age || formData.age <= 0) errors.age = 'Age should be greater than 0';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.contact || formData.contact.length !== 10) errors.contact = 'Contact should be 10 digits';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 8) errors.password = 'Password should be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

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
      // Send the registration request to the backend
      const response = await axios.post('http://localhost:1600/api/patient/register', formData);

      if (response.status === 201) {
        // Redirect to login page on success
        navigate('/api/patient/login');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>User Registration</h1>
      <form className="form" onSubmit={handleSubmit}>
        {/* Name */}
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        {validationErrors.name && <p className="error">{validationErrors.name}</p>}

        {/* Age */}
        <label>Age:</label>
        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          value={formData.age}
          onChange={handleChange}
        />
        {validationErrors.age && <p className="error">{validationErrors.age}</p>}

        {/* Gender */}
        <label>Gender:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleGenderChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleGenderChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === 'other'}
              onChange={handleGenderChange}
            />
            Other
          </label>
        </div>
        {validationErrors.gender && <p className="error">{validationErrors.gender}</p>}

        {/* Address */}
        <label>Address:</label>
        <textarea
          name="address"
          rows={3}
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
        />
        {validationErrors.address && <p className="error">{validationErrors.address}</p>}

        {/* Contact */}
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          placeholder="Enter your 10 digit contact number"
          value={formData.contact}
          onChange={handleChange}
        />
        {validationErrors.contact && <p className="error">{validationErrors.contact}</p>}

        {/* Email */}
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {validationErrors.email && <p className="error">{validationErrors.email}</p>}

        {/* Password */}
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        {validationErrors.password && <p className="error">{validationErrors.password}</p>}

        {/* Confirm Password */}
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {validationErrors.confirmPassword && <p className="error">{validationErrors.confirmPassword}</p>}

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p className="login-link">
        Already registered? <a href="#" onClick={() => navigate('/api/patient/login')}>Login</a>
      </p>
    </div>
  );
};

export default User;
