import React, { useState } from "react";

// Notification bell and dropdown
function Notifications({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const toggleDropdown = () => setOpen(!open);
  const markAllRead = () => console.log("Mark all notifications as read");

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleDropdown}
        aria-label="Notifications"
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
            <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: "0.9rem" }}>
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
        position: "relative"
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
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid #c0392b", paddingBottom: "0.5rem" }}>
        <h1 style={{ color: "#c0392b" }}>Blood Bank</h1>
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
            onClick={onLogout} 
            style={{
              background: "#c0392b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1.2rem",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Bank Profile */}
      <section style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eee", borderRadius: "10px", background: "#faf6f6" }}>
        <h2 style={{ color: "#e74c3c" }}>Bank Profile</h2>
        <p><strong>License No:</strong> {bank.license_no || "N/A"}</p>
        <p><strong>Email:</strong> {bank.email || "N/A"}</p>
        <p><strong>Location:</strong> {bank.location || "N/A"}</p>
        <p><strong>Contact:</strong> {bank.contact || "N/A"}</p>
        <p><strong>Capacity:</strong> {bank.capacity !== undefined ? bank.capacity : "N/A"}</p>
      </section>

      {/* Blood Stock */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Blood Stock</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "15px" }}>
          {Object.entries(stock).map(([group, amount]) => (
            <div key={group} style={{padding: "1rem", backgroundColor: "#fff0f0", borderRadius: "8px", boxShadow: "0 0 5px #f1c4c4", textAlign: "center"}}>
              <div style={{fontWeight: "bold", fontSize: "1.2rem", color: "#c0392b"}}>{group.replace(/_/g, "").toUpperCase()}</div>
              <div style={{fontSize: "1.5rem"}}>{amount}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Conditional Content based on Active Tab */}
      {activeTab === "blood_requests" && (
        <section>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Incoming Blood Requests</h2>
          {requests.length === 0 ? (
            <p>No pending blood requests.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#fce4e4" }}>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>User</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Blood Group</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Units</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date Requested</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{req.user_id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{req.blood_group}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{req.units_requested}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{new Date(req.requested_date).toLocaleDateString()}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      <button onClick={() => onAcceptRequest(req._id)} style={{ marginRight: "8px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px" }}>Accept</button>
                      <button onClick={() => onRejectRequest(req._id)} style={{background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px"}}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
      {activeTab === "donation_requests" && (
        <section>
          <h2 style={{ color: "#e74c3c", marginBottom: "1rem" }}>Donation Requests</h2>
          {donations.length === 0 ? (
            <p>No pending donation requests.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#fce4e4" }}>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>User</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Blood Group</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Units</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date Offered</th>
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(don => (
                  <tr key={don._id}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{don.user_id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{don.blood_group}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{don.units_donated}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{new Date(don.requested_date).toLocaleDateString()}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      <button onClick={() => onAcceptDonation(don._id)} style={{ marginRight: "8px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px" }}>Accept</button>
                      <button onClick={() => onRejectDonation(don._id)} style={{background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px"}}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}

export default BloodBankDashboard;
