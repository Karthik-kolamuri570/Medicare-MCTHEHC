import React from 'react'

function DFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#333",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
        <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
          Home
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
          About
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
          Services
        </a>
        <a href="#" style={{ textDecoration: "none", color: "#fff" }}>
          Contact
        </a>
      </div>

      {/* Social Icons */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-facebook-f" style={{ color: "#fff" }}></i>
        </a>
        <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-twitter" style={{ color: "#fff" }}></i>
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram" style={{ color: "#fff" }}></i>
        </a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          <i className="fab fa-linkedin-in" style={{ color: "#fff" }}></i>
        </a>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}>
          © 2025 Medicare. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 
export default DFooter;
