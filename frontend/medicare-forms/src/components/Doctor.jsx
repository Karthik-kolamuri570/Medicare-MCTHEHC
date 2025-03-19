import React from "react";

function Doctor({ onLoginClick }) {
  return (
    <div className="form-container">
      <h1>Doctor Registration</h1>
      <form className="form">
        <label>Name:</label>
        <input type="text" name="name" placeholder="Enter your name" /><br />

        <label>Email:</label>
        <input type="email" name="email" placeholder="Enter your email" /><br />

        <label>Phone:</label>
        <input type="tel" name="phone" placeholder="Enter your phone number" /><br />

        <label>Password:</label>
        <input type="password" name="password" placeholder="Enter your password" /><br />

        <label>Confirm Password:</label>
        <input type="password" name="confirmPassword" placeholder="Confirm your password" /><br />

        <label>Specialization:</label>
        <input type="text" name="specialization" placeholder="Enter your specialization" /><br />

        <label>Experience (Years):</label>
        <input type="number" name="experience" placeholder="Enter years of experience" /><br />

        <label>Hospital:</label>
        <input type="text" name="hospital" placeholder="Enter hospital name" /><br />

        <label>Fee per Consultation:</label>
        <input type="number" name="fee" placeholder="Enter consultation fee" /><br />

        <label>Availability (From - To):</label>
        <input type="text" name="availability" placeholder="Enter available time" /><br />

        <button type="submit" className="register-btn">Register</button>
      </form>
      <p className="login-link">Already registered? <a href="#" onClick={onLoginClick}>Login</a></p>
    </div>
  );
}

export default Doctor;