// import React, { useState } from "react";
// import "../styles/Notifications.css";
// import {FaBell} from "react-icons/fa"
// import logo from "../assets/logo.png";

// function Notifications() {
//   const [showNotifications, setShowNotifications] = useState(false);

//   const notifications = [
//           { name: "Anusha", date: "2025-03-21", time: "10:30 AM" },
//           { name: "Phani", date: "2025-03-21", time: "12:00 PM" },
//           { name: "Ravi", date: "2025-03-21", time: "10:30 AM" },
//           { name: "Karthik", date: "2025-03-21", time: "12:00 PM" },
//         ];
        

//   return (
//     <div>
//       {/* Header */}
      
//       {/* Notifications */}
//       <div className="notifications-wrapper">
//         <div className="notifications-container">
//           {/* Bell Icon with Notification Count */}
//           <div
//             className="bell-container"
//             onClick={() => setShowNotifications(!showNotifications)}
//           >
//             <FaBell className="bell-icon" />
//             {notifications.length > 0 && (
//               <span className="notification-count">{notifications.length}</span>
//             )}
//           </div>

//           {/* Show Notifications Only When Clicked */}
//           {showNotifications && (
//             <div className="notifications-list">
//               {/* BIG & CENTERED HEADING */}
//               <h2 className="notifications-title">Notifications</h2>

//               {notifications.length > 0 ? (
//                 notifications.map((notification, index) => (
//                   <div key={index} className="notification-item">
//                     <p>
//                       <strong>Name:</strong> {notification.name || "No Name"}
//                     </p>
//                     <p>
//                       <strong>Date:</strong> {notification.date || "No Date"}
//                     </p>
//                     <p>
//                       <strong>Time:</strong> {notification.time || "No Time"}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No new notifications</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
      
//     </div>
//   );
// }

// export default Notifications;
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios for fetching data
import "../styles/Notifications.css"; // Adjust path based on your structure
import { FaBell } from 'react-icons/fa';
import Loading from './ui/Loader';

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [patientId] = useState('your_patient_id_here'); // Replace this with the actual patient ID (can be passed via props or useContext)

  // Fetch notifications after successful appointment booking
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:1600/api/patient/notifications/`);
        console.log(response.data.data[1].data.doctorName); // Debugging
        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data); // Store fetched notifications in state
        } else {
          setError("Failed to fetch notifications.");
        }
      } catch (err) {
        setError("Error fetching notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [patientId]); // Fetch notifications when component is mounted

  return (
    <div className="notifications-wrapper">
      <div className="notifications-container">
        <div className="bell-container">
          <FaBell className="bell-icon" />
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
        </div>
          
        {/* Show Notifications */}
        <div className="notifications-list">
          <h2 className="notifications-title">Notifications</h2>

          {loading ? (
            <Loading />
          ) : error ? (
            <p>{error}</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                  
                <p><strong></strong> {notification.message}</p>
                <p>Doctor Name :<strong>{notification.data.doctorName}</strong></p>
                <p><strong>Appointment Date:</strong> {notification.data.date}</p>
                <p><strong>Time:</strong> {notification.data.time}</p>
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
