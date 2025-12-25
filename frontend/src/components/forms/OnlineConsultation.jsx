
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, AlertCircle, Search, Filter, History, FileText, CheckCircle, XCircle } from 'lucide-react';
import "../../styles/OnlineConsultation.css";

const OnlineConsultation = () => {
  const [filter, setFilter] = useState('all'); // all, appointments, second-opinions, history
  const [searchTerm, setSearchTerm] = useState("");
  const [allItems, setAllItems] = useState([]); // Combined list
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper to check if date/time is present or future
  const isPresentOrFuture = (dateString, timeString) => {
    if (!dateString) return true; // Fallback
    try {
      // Normalizing date formats if needed, assuming YYYY-MM-DD
      const appointmentDateTime = new Date(`${dateString}T${timeString || '00:00'}`);
      const now = new Date();
      // Reset seconds/milliseconds for cleaner comparison
      now.setSeconds(0);
      now.setMilliseconds(0);
      appointmentDateTime.setSeconds(0);
      appointmentDateTime.setMilliseconds(0);

      return appointmentDateTime >= now;
    } catch {
      return true; // Keep if parsing fails to avoid hiding valid data
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Appointments
        const apptRes = await axios.get("http://localhost:1600/api/patient/appointments", { withCredentials: true });
        const appointments = (apptRes.data.data || []).map(item => ({
          ...item,
          type: 'appointment',
          // Ensure status is normalized
          status: item.status || 'Pending'
        }));

        // 2. Fetch Second Opinions
        let secondOpinions = [];
        try {
          const soRes = await axios.get("http://localhost:1600/api/patient/get-second-opinion", { withCredentials: true });
          secondOpinions = (soRes.data.data || []).map(item => ({
            ...item,
            type: 'second-opinion',
            status: item.status || 'Pending',
            // Ensure date is YYYY-MM-DD for consistency
            date: typeof item.date === 'string' ? item.date.split('T')[0] : (item.date ? new Date(item.date).toISOString().split('T')[0] : item.createdAt?.split('T')[0]),
            time: item.time || '10:00' // Default if missing
          }));
        } catch (err) {
          console.warn("Could not fetch all second opinions, trying /accepted");
          try {
            const soResAccepted = await axios.get("http://localhost:1600/api/patient/get-second-opinion/accepted", { withCredentials: true });
            secondOpinions = (soResAccepted.data.data || []).map(item => ({
              ...item,
              type: 'second-opinion',
              status: item.status || 'Accepted', // Endpoint returns accepted
              date: item.date || item.createdAt?.split('T')[0],
              time: item.time || '10:00'
            }));
          } catch (fallbackErr) { console.error("Second opinion fetch failed", fallbackErr); }
        }

        // Combine and Sort (Newest first)
        const combined = [...appointments, ...secondOpinions].sort((a, b) => {
          const dateA = new Date(`${a.date || '2025-01-01'}T${a.time || '00:00'}`);
          const dateB = new Date(`${b.date || '2025-01-01'}T${b.time || '00:00'}`);
          return dateB - dateA;
        });

        setAllItems(combined);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartChat = (pid, did) => {
    if (!did) return;
    navigate(`/api/chat/${did}-${pid}`);
  };

  // --- Filtering Logic ---
  const getFilteredItems = () => {
    return allItems.filter(item => {
      const isFuture = isPresentOrFuture(item.date, item.time);

      // Tab Filters
      if (filter === 'all') {
        // All PRESENT/FUTURE items of both types
        if (!isFuture) return false;
      } else if (filter === 'appointments') {
        if (item.type !== 'appointment') return false;
        if (!isFuture) return false;
      } else if (filter === 'second-opinions') {
        if (item.type !== 'second-opinion') return false;
        if (!isFuture) return false;
      } else if (filter === 'history') {
        // ONLY Past items (any type)
        if (isFuture) return false;
      }

      // Search Filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const docName = item.doctorId?.name?.toLowerCase() || "";
        const prob = item.problem?.toLowerCase() || "";
        if (!docName.includes(term) && !prob.includes(term)) return false;
      }

      return true;
    });
  };

  const filteredItems = getFilteredItems();

  // --- Stats Calculation ---
  const stats = {
    total: filteredItems.length,
    appointments: filteredItems.filter(i => i.type === 'appointment').length,
    secondOpinions: filteredItems.filter(i => i.type === 'second-opinion').length
  };

  return (
    <div className="oc-container">
      <div className="oc-wrapper">
        <div className="oc-header">
          <h1 className="oc-title">My Consultations</h1>
          <p className="oc-subtitle">Track your appointments and expert opinions</p>
        </div>

        {/* Controls Bar */}
        <div className="oc-controls">
          <div className="oc-search-wrapper">
            <Search className="oc-search-icon" size={18} />
            <input
              type="text"
              placeholder="Search doctor or problem..."
              className="oc-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="oc-tabs">
            <button
              className={`oc-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`oc-tab ${filter === 'appointments' ? 'active' : ''}`}
              onClick={() => setFilter('appointments')}
            >
              Appointments
            </button>
            <button
              className={`oc-tab ${filter === 'second-opinions' ? 'active' : ''}`}
              onClick={() => setFilter('second-opinions')}
            >
              Get Second Opinions
            </button>
            <button
              className={`oc-tab ${filter === 'history' ? 'active' : ''}`}
              onClick={() => setFilter('history')}
            >
              <History size={14} style={{ marginRight: 5 }} /> History
            </button>
          </div>
        </div>

        {/* Stats Row (Dynamic based on filter) */}
        <div className="oc-stats">
          <div className="oc-stat-card">
            <div className="oc-stat-number">{stats.total}</div>
            <div className="oc-stat-label">Showing</div>
          </div>
          <div className="oc-stat-card">
            <div className="oc-stat-number" style={{ color: '#3b82f6' }}>{stats.appointments}</div>
            <div className="oc-stat-label">Appointments</div>
          </div>
          <div className="oc-stat-card">
            <div className="oc-stat-number" style={{ color: '#db2777' }}>{stats.secondOpinions}</div>
            <div className="oc-stat-label">Second Opinions</div>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading consultations...</div>
        ) : filteredItems.length === 0 ? (
          <div className="oc-empty">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h3>No consultations found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="oc-grid">
            {filteredItems.map(item => {
              const isAppt = item.type === 'appointment';
              const docName = item.doctorId?.name || "Pending Assignment";
              const initial = docName[0] || "?";
              const status = item.status;
              const canChat = status.toLowerCase() === 'accepted';
              const doctorId = item.doctorId?._id || item.doctorId;

              return (
                <div key={item._id} className="oc-card">
                  <div className={`oc-card-header-stripe ${isAppt ? 'stripe-appointment' : 'stripe-second-opinion'}`}></div>
                  <div className="oc-card-body">
                    {/* Type Badge */}
                    <span className={`oc-type-badge ${isAppt ? 'type-appointment' : 'type-second-opinion'}`}>
                      {isAppt ? 'Appointment' : 'Second Opinion'}
                    </span>

                    {/* Status Badge */}
                    <span className={`oc-status-badge status-${status.toLowerCase()}`}>
                      {status.toLowerCase() === 'accepted' && <CheckCircle size={14} />}
                      {status}
                    </span>

                    <div className="oc-doctor-info">
                      <div className="oc-avatar">{initial}</div>
                      <div className="oc-details">
                        <h3>{docName}</h3>
                        <p>{item.doctorId?.specialization || (isAppt ? "Specialist" : "Second Opinion")}</p>
                      </div>
                    </div>

                    <div className="oc-meta">
                      <div className="oc-meta-row">
                        <span className="oc-meta-label">
                          <AlertCircle size={14} /> Problem
                        </span>
                        <span className="oc-meta-value">
                          {item.problem?.substring(0, 20) || "N/A"}{item.problem?.length > 20 ? "..." : ""}
                        </span>
                      </div>
                      <div className="oc-meta-row">
                        <span className="oc-meta-label">
                          <Calendar size={14} /> Date
                        </span>
                        <span className="oc-meta-value">{item.date || "N/A"}</span>
                      </div>
                      <div className="oc-meta-row">
                        <span className="oc-meta-label">
                          <Clock size={14} /> Time
                        </span>
                        <span className="oc-meta-value">{item.time || "N/A"}</span>
                      </div>
                    </div>

                    <div className="oc-actions">
                      {!isPresentOrFuture(item.date, item.time) ? (
                        <div className="oc-status-display">
                          <span className="oc-status-label">Status:</span>
                          <span className={`oc-status-value status-text-${status.toLowerCase()}`}>{status}</span>
                        </div>
                      ) : (
                        <>
                          {canChat ? (
                            <button
                              className="oc-btn-chat"
                              onClick={() => handleStartChat(item.patientId, doctorId)}
                            >
                              <MessageSquare size={18} /> Start Chat
                            </button>
                          ) : (
                            <div className={status === 'Pending' ? "oc-btn-wait" : "oc-btn-disabled"}>
                              {status === 'Pending' ? (
                                <>
                                  <Clock size={18} /> Wait for Doctor Acceptance
                                </>
                              ) : (
                                <>
                                  <XCircle size={18} /> {status}
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default OnlineConsultation;
