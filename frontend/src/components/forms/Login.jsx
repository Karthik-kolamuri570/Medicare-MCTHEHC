import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form className="form">
        <label>Email:</label>
        <input type="email" name="email" placeholder="Enter your email" />
        <br />

        <label>Password:</label>
        <input type="password" name="password" placeholder="Enter your password" />
        <br />

        <button type="submit" className="register-btn">
          Login
        </button>
      </form>
      <p className="login-link">
        New User?{" "}
        <a href="#" onClick={() => navigate("/SignUp")}>
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
