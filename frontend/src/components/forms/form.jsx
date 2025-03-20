import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../forms/User';
import Doctor from '../forms/Doctor';
import Login from '../forms/Login';
// import Header from './Header';
// import Footer from './Footer';
import './UserForm.css';
function Form() {
  const [form, setForm] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleFormSwitch = (formType) => {
    setForm(formType);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
//        <div>
//           <Header />
        
    <div className="app-container">
      <div className="login-dropdown-container">
        <button className="login-btn" onClick={toggleDropdown}>Register</button>
        {dropdownOpen && (
          <div className="dropdown">
            <button className="dropdown-item" onClick={() => handleFormSwitch('user')}>User Form</button>
            <button className="dropdown-item" onClick={() => handleFormSwitch('doctor')}>Doctor Form</button>
          </div>
        )}
      </div>
      
      <div className="form-container">
        {form === 'user' && <User onLoginClick={() => setForm('login')} />}
        {form === 'doctor' && <Doctor onLoginClick={() => setForm('login')} />}
        {form === 'login' && <Login onRegisterClick={() => setForm(null)} />}
      </div>
    </div>
//     <Footer />
//     </div>  
  );
}

export default Form;
