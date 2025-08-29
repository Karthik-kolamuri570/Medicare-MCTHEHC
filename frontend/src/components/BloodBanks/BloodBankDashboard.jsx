// import React, { useState } from "react";

// // Notification bell and dropdown
// function Notifications({ notifications = [], markAllRead }) {
//   const [open, setOpen] = useState(false);
//   const unreadCount = notifications.filter(n => !n.read).length;
//   const toggleDropdown = () => setOpen(!open);

//   const handleMarkAllRead = () => {
//     if (markAllRead) {
//       markAllRead();
//     }
//     console.log("Mark all notifications as read");
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <button
//         onClick={toggleDropdown}
//         aria-label="Notifications"
//         title={`${unreadCount} unread notifications`}
//         style={{
//           position: "relative",
//           background: "none",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "1.5rem",
//           color: "#c0392b"
//         }}
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span style={{
//             position: "absolute",
//             top: "-4px",
//             right: "-6px",
//             background: "#e74c3c",
//             borderRadius: "50%",
//             color: "#fff",
//             padding: "2px 6px",
//             fontSize: "0.75rem",
//             fontWeight: "bold",
//             pointerEvents: "none"
//           }}>{unreadCount}</span>
//         )}
//       </button>
//       {open && (
//         <div style={{
//           position: "absolute",
//           right: 0,
//           top: "2.5rem",
//           width: "320px",
//           maxHeight: "350px",
//           overflowY: "auto",
//           background: "#fff",
//           border: "1px solid #ddd",
//           boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//           borderRadius: "8px",
//           zIndex: 100
//         }}>
//           <div style={{
//             padding: "0.75rem 1rem",
//             borderBottom: "1px solid #eee",
//             fontWeight: "bold",
//             display: "flex",
//             justifyContent: "space-between"
//           }}>
//             Notifications
//             <button 
//               onClick={handleMarkAllRead} 
//               style={{ 
//                 background: "none", 
//                 border: "none", 
//                 cursor: "pointer", 
//                 color: "#e74c3c", 
//                 fontSize: "0.9rem" 
//               }}
//             >
//               Mark all read
//             </button>
//           </div>
//           {notifications.length === 0 ? (
//             <p style={{ padding: "1rem", textAlign: "center", color: "#888" }}>No new notifications</p>
//           ) : (
//             notifications.map((n, idx) => (
//               <div key={idx} style={{
//                 padding: "0.75rem 1rem",
//                 backgroundColor: n.read ? "white" : "#ffe5e0",
//                 borderBottom: idx === notifications.length - 1 ? "none" : "1px solid #eee",
//                 fontSize: "0.9rem"
//               }}>
//                 <strong>{n.title}</strong>
//                 <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#555" }}>{n.message}</p>
//                 <small style={{ color: "#aaa" }}>{new Date(n.date).toLocaleString()}</small>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// function Tab({ label, count = 0, isActive, onClick }) {
//   return (
//     <div 
//       onClick={onClick} 
//       style={{
//         cursor: "pointer",
//         padding: "0.5rem 1rem",
//         borderBottom: isActive ? "3px solid #c0392b" : "3px solid transparent",
//         color: isActive ? "#c0392b" : "#444",
//         fontWeight: isActive ? "700" : "500",
//         position: "relative",
//         userSelect: "none"
//       }}
//     >
//       {label}
//       {count > 0 && (
//         <span style={{
//           position: "absolute",
//           top: "0px",
//           right: "-10px",
//           background: "#e74c3c",
//           padding: "2px 6px",
//           borderRadius: "12px",
//           color: "white",
//           fontSize: "0.75rem",
//           fontWeight: "bold"
//         }}>{count}</span>
//       )}
//     </div>
//   );
// }

// function BloodBankDashboard({
//   bank = {},
//   stock = {},
//   requests = [],
//   donations = [],
//   notifications = [],
//   onAcceptRequest,
//   onRejectRequest,
//   onAcceptDonation,
//   onRejectDonation,
//   onLogout,
//   onMarkAllNotificationsRead
// }) {
//   const [activeTab, setActiveTab] = useState("blood_requests");

//   const pendingRequestsCount = requests.filter(r => r.status === "pending").length;
//   const pendingDonationsCount = donations.filter(d => d.status === "pending").length;

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       onLogout();
//     }
//   };

//   return (
//     <div style={{ maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif", padding: "2rem" }}>
//       {/* Header */}
//       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid #c0392b", paddingBottom: "0.5rem" }}>
//         <div>
//           <h1 style={{ color: "#c0392b", margin: 0 }}>Blood Bank Portal</h1>
//           <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
//             Welcome, {bank.name || "Admin"}
//           </p>
//         </div>
//         <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
//           <Tab 
//             label="Blood Requests"
//             count={pendingRequestsCount}
//             isActive={activeTab === "blood_requests"}
//             onClick={() => setActiveTab("blood_requests")}
//           />
//           <Tab 
//             label="Donation Requests"
//             count={pendingDonationsCount}
//             isActive={activeTab === "donation_requests"}
//             onClick={() => setActiveTab("donation_requests")}
//           />
//           <Notifications 
//             notifications={notifications} 
//             markAllRead={onMarkAllNotificationsRead}
//           />
//           <button 
//             onClick={handleLogout} 
//             style={{
//               background: "#c0392b",
//               color: "white",
//               border: "none",
//               borderRadius: "6px",
//               padding: "0.5rem 1.2rem",
//               cursor: "pointer",
//               fontSize: "0.9rem",
//               fontWeight: "500"
//             }}
//           >
//             Logout
//           </button>
//         </nav>
//       </header>

//       {/* Bank Profile */}
//       <section style={{ marginBottom: "2rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "10px", background: "#faf6f6" }}>
//         <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Bank Profile</h2>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
//           <p><strong>License No:</strong> {bank.license_no || "N/A"}</p>
//           <p><strong>Email:</strong> {bank.email || "N/A"}</p>
//           <p><strong>Location:</strong> {bank.location || "N/A"}</p>
//           <p><strong>Contact:</strong> {bank.contact || "N/A"}</p>
//           <p><strong>Capacity:</strong> {bank.capacity !== undefined ? `${bank.capacity} units` : "N/A"}</p>
//         </div>
//       </section>

//       {/* Blood Stock */}
//       <section style={{ marginBottom: "2rem" }}>
//         <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Current Blood Stock</h2>
//         {Object.keys(stock).length === 0 ? (
//           <p style={{ color: "#666", fontStyle: "italic" }}>No stock data available</p>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "15px" }}>
//             {Object.entries(stock).map(([group, amount]) => (
//               <div key={group} style={{
//                 padding: "1rem", 
//                 backgroundColor: "#fff0f0", 
//                 borderRadius: "8px", 
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
//                 textAlign: "center",
//                 border: amount < 5 ? "2px solid #e74c3c" : "1px solid #f1c4c4"
//               }}>
//                 <div style={{fontWeight: "bold", fontSize: "1rem", color: "#c0392b", marginBottom: "0.5rem"}}>
//                   {group.replace(/_/g, "").toUpperCase()}
//                 </div>
//                 <div style={{fontSize: "1.5rem", fontWeight: "bold", color: amount < 5 ? "#e74c3c" : "#333"}}>
//                   {amount}
//                 </div>
//                 {amount < 5 && (
//                   <div style={{fontSize: "0.7rem", color: "#e74c3c", marginTop: "0.25rem"}}>
//                     LOW STOCK
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Conditional Content based on Active Tab */}
//       {activeTab === "blood_requests" && (
//         <section>
//           <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Incoming Blood Requests</h2>
//           {requests.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
//               No blood requests found.
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
//                 <thead style={{ backgroundColor: "#fce4e4" }}>
//                   <tr>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>User</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Blood Group</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Units</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Date Requested</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map(req => (
//                     <tr key={req._id}>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>{req.user_id || "Unknown"}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>{req.blood_group}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>{req.units_requested}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>
//                         {new Date(req.requested_date).toLocaleDateString()}
//                       </td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
//                         <button 
//                           onClick={() => onAcceptRequest(req._id)} 
//                           style={{ 
//                             marginRight: "8px", 
//                             background: "#27ae60", 
//                             color: "white", 
//                             border: "none", 
//                             borderRadius: "5px", 
//                             padding: "6px 12px",
//                             cursor: "pointer",
//                             fontSize: "0.9rem"
//                           }}
//                         >
//                           Accept
//                         </button>
//                         <button 
//                           onClick={() => onRejectRequest(req._id)} 
//                           style={{
//                             background: "#e74c3c", 
//                             color: "white", 
//                             border: "none", 
//                             borderRadius: "5px", 
//                             padding: "6px 12px",
//                             cursor: "pointer",
//                             fontSize: "0.9rem"
//                           }}
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       )}

//       {activeTab === "donation_requests" && (
//         <section>
//           <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Incoming Donation Offers</h2>
//           {donations.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
//               No donation requests found.
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
//                 <thead style={{ backgroundColor: "#fce4e4" }}>
//                   <tr>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Donor</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Blood Group</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Units</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Date Offered</th>
//                     <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {donations.map(don => (
//                     <tr key={don._id}>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>{don.user_id || "Unknown"}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>{don.blood_group}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>{don.units_donated}</td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px" }}>
//                         {new Date(don.requested_date).toLocaleDateString()}
//                       </td>
//                       <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
//                         <button 
//                           onClick={() => onAcceptDonation(don._id)} 
//                           style={{ 
//                             marginRight: "8px", 
//                             background: "#27ae60", 
//                             color: "white", 
//                             border: "none", 
//                             borderRadius: "5px", 
//                             padding: "6px 12px",
//                             cursor: "pointer",
//                             fontSize: "0.9rem"
//                           }}
//                         >
//                           Accept
//                         </button>
//                         <button 
//                           onClick={() => onRejectDonation(don._id)} 
//                           style={{
//                             background: "#e74c3c", 
//                             color: "white", 
//                             border: "none", 
//                             borderRadius: "5px", 
//                             padding: "6px 12px",
//                             cursor: "pointer",
//                             fontSize: "0.9rem"
//                           }}
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }

// export default BloodBankDashboard;




















import React, { useState } from "react";

// Notification bell and dropdown
function Notifications({ notifications = [], markAllRead }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const toggleDropdown = () => setOpen(!open);

  const handleMarkAllRead = () => {
    if (markAllRead) {
      markAllRead();
    }
    console.log("Mark all notifications as read");
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleDropdown}
        aria-label="Notifications"
        title={`${unreadCount} unread notifications`}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          color: "#c0392b"
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-4px",
            right: "-6px",
            background: "#e74c3c",
            borderRadius: "50%",
            color: "#fff",
            padding: "2px 6px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            pointerEvents: "none"
          }}>{unreadCount}</span>
        )}
      </button>
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "2.5rem",
          width: "320px",
          maxHeight: "350px",
          overflowY: "auto",
          background: "#fff",
          border: "1px solid #ddd",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          zIndex: 100
        }}>
          <div style={{
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between"
          }}>
            Notifications
            <button 
              onClick={handleMarkAllRead} 
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                color: "#e74c3c", 
                fontSize: "0.9rem" 
              }}
            >
              Mark all read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p style={{ padding: "1rem", textAlign: "center", color: "#888" }}>No new notifications</p>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} style={{
                padding: "0.75rem 1rem",
                backgroundColor: n.read ? "white" : "#ffe5e0",
                borderBottom: idx === notifications.length - 1 ? "none" : "1px solid #eee",
                fontSize: "0.9rem"
              }}>
                <strong>{n.title}</strong>
                <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#555" }}>{n.message}</p>
                <small style={{ color: "#aaa" }}>{new Date(n.date).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Tab({ label, count = 0, isActive, onClick }) {
  return (
    <div 
      onClick={onClick} 
      style={{
        cursor: "pointer",
        padding: "0.5rem 1rem",
        borderBottom: isActive ? "3px solid #c0392b" : "3px solid transparent",
        color: isActive ? "#c0392b" : "#444",
        fontWeight: isActive ? "700" : "500",
        position: "relative",
        userSelect: "none"
      }}
    >
      {label}
      {count > 0 && (
        <span style={{
          position: "absolute",
          top: "0px",
          right: "-10px",
          background: "#e74c3c",
          padding: "2px 6px",
          borderRadius: "12px",
          color: "white",
          fontSize: "0.75rem",
          fontWeight: "bold"
        }}>{count}</span>
      )}
    </div>
  );
}

function BloodBankDashboard({
  bank = {},
  stock = {},
  requests = [],
  donations = [],
  notifications = [],
  onAcceptRequest,
  onRejectRequest,
  onAcceptDonation,
  onRejectDonation,
  onLogout,
  onMarkAllNotificationsRead
}) {
  const [activeTab, setActiveTab] = useState("blood_requests");

  const pendingRequestsCount = requests.filter(r => r.status === "pending").length;
  const pendingDonationsCount = donations.filter(d => d.status === "pending").length;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  // ✅ FIXED: Helper function to safely render user info
  const renderUserInfo = (userObj) => {
    if (!userObj) return "Unknown";
    
    // If it's a string (user ID), return as is
    if (typeof userObj === 'string') return userObj;
    
    // If it's an object, try to get name, email, or _id
    if (typeof userObj === 'object') {
      return userObj.name || userObj.email || userObj._id || "Unknown User";
    }
    
    return "Unknown";
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid #c0392b", paddingBottom: "0.5rem" }}>
        <div>
          <h1 style={{ color: "#c0392b", margin: 0 }}>Blood Bank Portal</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
            Welcome, {bank.name || "Admin"}
          </p>
        </div>
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Tab 
            label="Blood Requests"
            count={pendingRequestsCount}
            isActive={activeTab === "blood_requests"}
            onClick={() => setActiveTab("blood_requests")}
          />
          <Tab 
            label="Donation Requests"
            count={pendingDonationsCount}
            isActive={activeTab === "donation_requests"}
            onClick={() => setActiveTab("donation_requests")}
          />
          <Notifications 
            notifications={notifications} 
            markAllRead={onMarkAllNotificationsRead}
          />
          <button 
            onClick={handleLogout} 
            style={{
              background: "#c0392b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1.2rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Bank Profile */}
      <section style={{ marginBottom: "2rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "10px", background: "#faf6f6" }}>
        <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Bank Profile</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <p><strong>License No:</strong> {bank.license_no || "N/A"}</p>
          <p><strong>Email:</strong> {bank.email || "N/A"}</p>
          <p><strong>Location:</strong> {bank.location || "N/A"}</p>
          <p><strong>Contact:</strong> {bank.contact || "N/A"}</p>
          <p><strong>Capacity:</strong> {bank.capacity !== undefined ? `${bank.capacity} units` : "N/A"}</p>
        </div>
      </section>

      {/* Blood Stock */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Current Blood Stock</h2>
        {Object.keys(stock).length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No stock data available</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "15px" }}>
            {Object.entries(stock).map(([group, amount]) => (
              <div key={group} style={{
                padding: "1rem", 
                backgroundColor: "#fff0f0", 
                borderRadius: "8px", 
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                textAlign: "center",
                border: amount < 5 ? "2px solid #e74c3c" : "1px solid #f1c4c4"
              }}>
                <div style={{fontWeight: "bold", fontSize: "1rem", color: "#c0392b", marginBottom: "0.5rem"}}>
                  {group.replace(/_/g, "").toUpperCase()}
                </div>
                <div style={{fontSize: "1.5rem", fontWeight: "bold", color: amount < 5 ? "#e74c3c" : "#333"}}>
                  {amount}
                </div>
                {amount < 5 && (
                  <div style={{fontSize: "0.7rem", color: "#e74c3c", marginTop: "0.25rem"}}>
                    LOW STOCK
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ FIXED: Blood Requests Table */}
      {activeTab === "blood_requests" && (
        <section>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Incoming Blood Requests</h2>
          {requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
              No blood requests found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead style={{ backgroundColor: "#fce4e4" }}>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>User</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Blood Group</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Units</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Date Requested</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Status</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req._id}>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                        {renderUserInfo(req.user_id)}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>{req.blood_group}</td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>{req.units_requested}</td>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                        {new Date(req.requested_date).toLocaleDateString()}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          backgroundColor: req.status === "pending" ? "#fff3cd" : 
                                          req.status === "accepted" ? "#d4edda" : "#f8d7da",
                          color: req.status === "pending" ? "#856404" : 
                                req.status === "accepted" ? "#155724" : "#721c24"
                        }}>
                          {req.status?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
                        {req.status === "pending" ? (
                          <>
                            <button 
                              onClick={() => onAcceptRequest(req._id)} 
                              style={{ 
                                marginRight: "8px", 
                                background: "#27ae60", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "5px", 
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => onRejectRequest(req._id)} 
                              style={{
                                background: "#e74c3c", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "5px", 
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            {req.status === "accepted" ? "✅ Accepted" : "❌ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ✅ FIXED: Donations Table */}
      {activeTab === "donation_requests" && (
        <section>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Incoming Donation Offers</h2>
          {donations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
              No donation requests found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                <thead style={{ backgroundColor: "#fce4e4" }}>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Donor</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Blood Group</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Units</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "left" }}>Date Offered</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Status</th>
                    <th style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(don => (
                    <tr key={don._id}>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                        {renderUserInfo(don.user_id)}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>{don.blood_group}</td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>{don.units_donated}</td>
                      <td style={{ border: "1px solid #ccc", padding: "12px" }}>
                        {new Date(don.requested_date).toLocaleDateString()}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          backgroundColor: don.status === "pending" ? "#fff3cd" : 
                                          don.status === "accepted" ? "#d4edda" : "#f8d7da",
                          color: don.status === "pending" ? "#856404" : 
                                don.status === "accepted" ? "#155724" : "#721c24"
                        }}>
                          {don.status?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}>
                        {don.status === "pending" ? (
                          <>
                            <button 
                              onClick={() => onAcceptDonation(don._id)} 
                              style={{ 
                                marginRight: "8px", 
                                background: "#27ae60", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "5px", 
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => onRejectDonation(don._id)} 
                              style={{
                                background: "#e74c3c", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "5px", 
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                              }}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            {don.status === "accepted" ? "✅ Accepted" : "❌ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default BloodBankDashboard;
