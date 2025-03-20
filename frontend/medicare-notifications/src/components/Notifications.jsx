import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import "../styles/Notifications.css";

function Notifications({ notifications }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="notifications-wrapper">
      <div className="notifications-container">
        {/* Bell Icon with Notification Count */}
        <div className="bell-container" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell className="bell-icon" />
          {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
        </div>

        {/* Show Notifications Only When Clicked */}
        {showNotifications && (
          <div className="notifications-list">
            {/* BIG & CENTERED HEADING */}
            <h2 className="notifications-title">Notifications</h2>

            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <p><strong>Name:</strong> {notification.name || "No Name"}</p>
                  <p><strong>Date:</strong> {notification.date || "No Date"}</p>
                  <p><strong>Time:</strong> {notification.time || "No Time"}</p>
                </div>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
