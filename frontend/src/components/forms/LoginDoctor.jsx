import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

function Login() {
  const navigate = useNavigate();

  // State for input fields, errors, and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true when form is submitted

    try {
      // Send login request to the backend
      const response = await axios.post(
        "http://localhost:1600/api/doctor/login",
        { email, password },
        { withCredentials: true } // 🔥 Ensures cookies are sent
      );

      // Handle successful login
      if (response.data) {
        localStorage.setItem("token", response.data.token); // Store token
        navigate("/book-appointment"); // Redirect to booking page
      }
    } catch (err) {
      // Show error message from API if available
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        {error && <p className="error-message">{error}</p>} {/* Show error if exists */}

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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
