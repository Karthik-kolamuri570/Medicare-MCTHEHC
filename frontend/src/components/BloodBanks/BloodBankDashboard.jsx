import React, { useState } from "react";
import "../../styles/BloodBankDashboard.css";
import { Bell, MapPin, Phone, Mail, Droplet, User, CheckCircle, XCircle } from "lucide-react";

// Notification bell and dropdown
function Notifications({ notifications = [], markAllRead }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const toggleDropdown = () => setOpen(!open);

  const handleMarkAllRead = () => {
    if (markAllRead) {
      markAllRead();
    }
  };

  return (
    <div className="bb-nav-item bb-notifications-wrapper">
      <button
        onClick={toggleDropdown}
        aria-label="Notifications"
        title={`${unreadCount} unread notifications`}
        className="bb-nav-btn bb-bell-btn"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="bb-bell-badge">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="bb-notifications-dropdown">
          <div className="bb-nd-header">
            <h4>Notifications</h4>
            <button onClick={handleMarkAllRead} className="bb-nd-markread">
              Mark all read
            </button>
          </div>
          <div className="bb-nd-body">
            {notifications.length === 0 ? (
              <p className="bb-nd-empty">No new notifications</p>
            ) : (
              notifications.map((n, idx) => (
                <div key={idx} className={`bb-nd-item ${n.read ? 'read' : 'unread'}`}>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{new Date(n.date).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Tab({ label, count = 0, isActive, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`bb-tab ${isActive ? 'active' : ''}`}
    >
      {label}
      {count > 0 && <span className="bb-tab-badge">{count}</span>}
    </button>
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

  const renderUserInfo = (userObj) => {
    if (!userObj) return "Unknown";
    if (typeof userObj === 'string') return userObj;
    if (typeof userObj === 'object') {
      return userObj.name || userObj.email || userObj._id || "Unknown User";
    }
    return "Unknown";
  };

  return (
    <div className="bb-container">
      <div className="bb-wrapper">
        
        {/* Header */}
        <header className="bb-header">
          <div className="bb-header-title">
            <h1>Blood Bank Portal</h1>
            <p>Welcome back, <strong>{bank.name || "Admin"}</strong></p>
          </div>
          <nav className="bb-nav">
            <div className="bb-tabs-container">
              <Tab 
                label="Blood Requests"
                count={pendingRequestsCount}
                isActive={activeTab === "blood_requests"}
                onClick={() => setActiveTab("blood_requests")}
              />
              <Tab 
                label="Donation Offers"
                count={pendingDonationsCount}
                isActive={activeTab === "donation_requests"}
                onClick={() => setActiveTab("donation_requests")}
              />
            </div>
            <div className="bb-nav-actions">
              <Notifications 
                notifications={notifications} 
                markAllRead={onMarkAllNotificationsRead}
              />
              <button onClick={handleLogout} className="bb-nav-btn bb-logout-btn">
                Logout
              </button>
            </div>
          </nav>
        </header>

        {/* Top Grid: Profile & Stock */}
        <div className="bb-top-grid">
          
          {/* Bank Profile */}
          <section className="bb-card bb-profile-card">
            <h2 className="bb-card-title"><Droplet size={20}/> Bank Profile</h2>
            <div className="bb-profile-grid">
              <div className="bb-profile-item">
                <span className="bb-pi-label">License No.</span>
                <span className="bb-pi-value">{bank.license_no || "N/A"}</span>
              </div>
              <div className="bb-profile-item">
                <span className="bb-pi-label">Capacity</span>
                <span className="bb-pi-value">{bank.capacity !== undefined ? `${bank.capacity} units` : "N/A"}</span>
              </div>
              <div className="bb-profile-item full-width">
                <Mail size={16} className="bb-pi-icon"/>
                <span className="bb-pi-value">{bank.email || "N/A"}</span>
              </div>
              <div className="bb-profile-item full-width">
                <MapPin size={16} className="bb-pi-icon"/>
                <span className="bb-pi-value">{bank.location || "N/A"}</span>
              </div>
              <div className="bb-profile-item full-width">
                <Phone size={16} className="bb-pi-icon"/>
                <span className="bb-pi-value">{bank.contact || "N/A"}</span>
              </div>
            </div>
          </section>

          {/* Blood Stock */}
          <section className="bb-card bb-stock-card">
            <h2 className="bb-card-title"><Droplet size={20}/> Current Blood Stock</h2>
            {Object.keys(stock).length === 0 ? (
              <div className="bb-empty">No stock data available</div>
            ) : (
              <div className="bb-stock-grid">
                {Object.entries(stock).map(([group, amount]) => (
                  <div key={group} className={`bb-stock-item ${amount < 5 ? 'critical' : 'normal'}`}>
                    <div className="bb-stock-group">{group.replace(/_/g, "").toUpperCase()}</div>
                    <div className="bb-stock-amount">{amount}</div>
                    {amount < 5 && <div className="bb-stock-alert">LOW STOCK</div>}
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Requests Table */}
        {activeTab === "blood_requests" && (
          <section className="bb-card bb-table-card">
            <h2 className="bb-card-title">Incoming Blood Requests</h2>
            {requests.length === 0 ? (
              <div className="bb-empty-large">
                <div className="bb-empty-icon">🩺</div>
                <h3>No blood requests found</h3>
                <p>All clear! You have no pending blood requests at the moment.</p>
              </div>
            ) : (
              <div className="bb-table-wrapper">
                <table className="bb-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Date Requested</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req._id}>
                        <td>
                          <div className="bb-user-cell">
                            <User size={16}/> {renderUserInfo(req.user_id)}
                          </div>
                        </td>
                        <td><span className="bb-blood-tag">{req.blood_group}</span></td>
                        <td><span className="bb-units-tag">{req.units_requested} Units</span></td>
                        <td>{new Date(req.requested_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`bb-status-pill status-${req.status}`}>
                            {req.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td>
                          {req.status === "pending" ? (
                            <div className="bb-action-btns">
                              <button onClick={() => onAcceptRequest(req._id)} className="bb-btn bb-btn-accept">
                                <CheckCircle size={14}/> Accept
                              </button>
                              <button onClick={() => onRejectRequest(req._id)} className="bb-btn bb-btn-reject">
                                <XCircle size={14}/> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`bb-status-text text-${req.status}`}>
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

        {/* Donations Table */}
        {activeTab === "donation_requests" && (
          <section className="bb-card bb-table-card">
            <h2 className="bb-card-title">Incoming Donation Offers</h2>
            {donations.length === 0 ? (
              <div className="bb-empty-large">
                <div className="bb-empty-icon">🩸</div>
                <h3>No donation offers found</h3>
                <p>No new donation offers at this time.</p>
              </div>
            ) : (
              <div className="bb-table-wrapper">
                <table className="bb-table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Blood Group</th>
                      <th>Units</th>
                      <th>Date Offered</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(don => (
                      <tr key={don._id}>
                        <td>
                          <div className="bb-user-cell">
                            <User size={16}/> {renderUserInfo(don.user_id)}
                          </div>
                        </td>
                        <td><span className="bb-blood-tag">{don.blood_group}</span></td>
                        <td><span className="bb-units-tag">{don.units_donated} Units</span></td>
                        <td>{new Date(don.requested_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`bb-status-pill status-${don.status}`}>
                            {don.status?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                        <td>
                          {don.status === "pending" ? (
                            <div className="bb-action-btns">
                              <button onClick={() => onAcceptDonation(don._id)} className="bb-btn bb-btn-accept">
                                <CheckCircle size={14}/> Accept
                              </button>
                              <button onClick={() => onRejectDonation(don._id)} className="bb-btn bb-btn-reject">
                                <XCircle size={14}/> Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`bb-status-text text-${don.status}`}>
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
    </div>
  );
}

export default BloodBankDashboard;
