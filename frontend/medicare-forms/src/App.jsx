import React, { useState } from 'react';
import Header from './components/Header';
import User from './components/User';
import Doctor from './components/Doctor';
import Login from './components/Login';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [form, setForm] = useState(null); // Track which form is active
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown visibility

  const handleFormSwitch = (formType) => {
    setForm(formType);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="app-container">
      <Header />

      <div className="login-dropdown-container">
        <button className="login-btn" onClick={toggleDropdown}>Register</button>
        {dropdownOpen && (
          <div className="dropdown">
            <button className="dropdown-item" onClick={() => handleFormSwitch('user')}>User Form</button>
            <button className="dropdown-item" onClick={() => handleFormSwitch('doctor')}>Doctor Form</button>
          </div>
        )}
      </div>

      {/* Render forms conditionally */}
      <div className="form-container">
        {form === 'user' && <User onLoginClick={() => setForm('login')} />}
        {form === 'doctor' && <Doctor onLoginClick={() => setForm('login')} />}
        {form === 'login' && <Login onRegisterClick={() => setForm(null)} />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
