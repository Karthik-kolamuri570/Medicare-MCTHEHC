import React, { useState } from "react";
import "../styles/Notifications.css";
import {FaBell} from "react-icons/fa"
import logo from "../assets/logo.png";

function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
          { name: "John Doe", date: "2025-03-20", time: "10:30 AM" },
          { name: "Sarah Lee", date: "2025-03-21", time: "12:00 PM" },
        ];
        

  return (
    <div>
      {/* Header */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="logo" className="mlogo" />
            <a href="#" className="alogo">
              Medicare
            </a>
          </div>
          <ul className="nav-links">
            <li>
              <a href="/api/patient/find-doctor">Find a Doctor</a>
            </li>
            <li>
              <a href="#">Get Second Opinion</a>
            </li>
            <li>
              <a href="#">Blogs</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Sign Up</a>
            </li>
          </ul>
          <div className="search-container">
            <input type="text" placeholder="Search Your Service" />
            <button>🔍</button>
          </div>
        </nav>

        {/* Secondary Yellow Navbar */}
        <div className="secondary-navbar">
          <a href="#">Our Hospitals</a>
          <a href="#">Online Consultancy</a>
          <a href="#">Treatments</a>
          <a href="#">Blood Camps and Banks</a>
        </div>
      </header>
      {/* Notifications */}
      <div className="notifications-wrapper">
        <div className="notifications-container">
          {/* Bell Icon with Notification Count */}
          <div
            className="bell-container"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="bell-icon" />
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </div>

          {/* Show Notifications Only When Clicked */}
          {showNotifications && (
            <div className="notifications-list">
              {/* BIG & CENTERED HEADING */}
              <h2 className="notifications-title">Notifications</h2>

              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p>
                      <strong>Name:</strong> {notification.name || "No Name"}
                    </p>
                    <p>
                      <strong>Date:</strong> {notification.date || "No Date"}
                    </p>
                    <p>
                      <strong>Time:</strong> {notification.time || "No Time"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>Medicare</h2>
          </div>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/" target="_blank">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.twitter.com/" target="_blank">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.instagram.com/" target="_blank">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/" target="_blank">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Medicare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Notifications;
