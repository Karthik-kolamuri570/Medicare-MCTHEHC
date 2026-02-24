import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/doctor/login", { email, password });

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        if (response.data.doctor) {
          localStorage.setItem("user", JSON.stringify(response.data.doctor));
        }
        navigate("/doctor");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
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

        {error && <p className="error-message">{error}</p>}

        <p style={{ textAlign: "right", margin: "0 0 10px" }}>
          <Link to="/forgot-password/doctor" style={{ color: "#0072ff", fontSize: "13px", textDecoration: "none" }}>
            Forgot Password?
          </Link>
        </p>

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
