import React, { useState } from "react";
import "../styles/Notifications.css";
import {FaBell} from "react-icons/fa"
import logo from "../assets/logo.png";

function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
          { name: "Anusha", date: "2025-03-21", time: "10:30 AM" },
          { name: "Phani", date: "2025-03-21", time: "12:00 PM" },
          { name: "Ravi", date: "2025-03-21", time: "10:30 AM" },
          { name: "Karthik", date: "2025-03-21", time: "12:00 PM" },
        ];
        

  return (
    <div>
      {/* Header */}
      
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
      
    </div>
  );
}

export default Notifications;
