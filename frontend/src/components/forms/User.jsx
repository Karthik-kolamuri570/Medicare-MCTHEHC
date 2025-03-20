import React from 'react';
import { useNavigate } from 'react-router-dom';

function User() {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h1>User Registration</h1>
      <form className="form">
        <label>Name:</label>
        <input type="text" name="name" placeholder="Enter your name" />
        <br />

        <label>Email:</label>
        <input type="email" name="email" placeholder="Enter your email" />
        <br />

        <label>Phone:</label>
        <input type="tel" name="phone" placeholder="Enter your phone number" />
        <br />

        <label>Password:</label>
        <input type="password" name="password" placeholder="Enter your password" />
        <br />

        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" placeholder="Confirm your password" />
        <br />

        <label>Age:</label>
        <input type="number" name="age" placeholder="Enter your age" />
        <br />

        <label>Gender:</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="gender" value="Male" /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="Female" /> Female
          </label>
          <label>
            <input type="radio" name="gender" value="Others" /> Others
          </label>
        </div>

        <label>Address:</label>
        <textarea name="address" rows={3} placeholder="Enter your address"></textarea>
        <br />

        <button type="submit" className="register-btn" onClick={() => navigate("/login")}>
          Register
        </button>
      </form>
      <p className="login-link">
        Already registered?{" "}
        <a href="#" onClick={() => navigate("/login")}>
          Login
        </a>
      </p>
    </div>
  );
}

export default User;
