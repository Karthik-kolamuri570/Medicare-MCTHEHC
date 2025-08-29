import React, { useState } from "react";
import axios from "axios";

function BloodBankLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post("http://localhost:1600/api/blood-bank/bank-login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Redirect to dashboard on successful login
        window.location.href = "/api/blood-bank/bank";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🩸</div>
          <h1 style={styles.title}>Blood Bank Portal</h1>
          <p style={styles.subtitle}>Admin Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div style={styles.footer}>
          <a href="/forgot-password" style={styles.link}>
            Forgot Password?
          </a>
          <div style={styles.divider}>|</div>
          <a href="/register" style={styles.link}>
            Register New Blood Bank
          </a>
        </div>
      </div>
    </div>
  );
}

// Styles object
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
    fontFamily: "Arial, sans-serif",
    padding: "2rem"
  },
  loginBox: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    padding: "3rem 2.5rem",
    maxWidth: "400px",
    width: "100%"
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem"
  },
  logo: {
    fontSize: "3rem",
    marginBottom: "1rem"
  },
  title: {
    color: "#c0392b",
    fontSize: "1.8rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "bold"
  },
  subtitle: {
    color: "#666",
    fontSize: "1rem",
    margin: "0"
  },
  form: {
    marginBottom: "2rem"
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #fed7d7",
    color: "#c53030",
    padding: "0.75rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem"
  },
  inputGroup: {
    marginBottom: "1.5rem"
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#333",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    outline: "none",
    boxSizing: "border-box"
  },
  loginButton: {
    width: "100%",
    background: "#c0392b",
    color: "white",
    border: "none",
    padding: "0.875rem",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
    cursor: "pointer"
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e2e8f0"
  },
  link: {
    color: "#c0392b",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.2s"
  },
  divider: {
    color: "#ccc"
  }
};

// Add hover effects with CSS-in-JS alternative or external CSS
const additionalStyles = `
  .login-input:focus {
    border-color: #c0392b !important;
    box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #a93226 !important;
  }
  
  .login-link:hover {
    color: #a93226 !important;
    text-decoration: underline;
  }
`;

// Inject additional styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = additionalStyles;
  document.head.appendChild(styleSheet);
}

export default BloodBankLogin;
