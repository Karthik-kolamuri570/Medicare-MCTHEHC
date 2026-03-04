
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, Clock, AlertCircle, Search, Filter, History, FileText, CheckCircle, XCircle, RefreshCw, X } from 'lucide-react';
import "../../styles/OnlineConsultation.css";
import toast from 'react-hot-toast';
import defaultDoctorImage from "../../assets/doctor1.png";

const OnlineConsultation = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Reschedule modal state
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, item: null });
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Track which item is being acted on

  // Helper to check if date is within last 7 days or future
  const isRecentOrFuture = (dateString) => {
    if (!dateString) return true;
    try {
      const datePart = typeof dateString === 'string' ? dateString.split('T')[0] : new Date(dateString).toISOString().split('T')[0];
      const apptDate = new Date(datePart);
      apptDate.setHours(0, 0, 0, 0);
      
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      return apptDate >= sevenDaysAgo;
    } catch {
      return true;
    }
  };

  // Helper to check if date/time is strictly future
  const isFuture = (dateString, timeString) => {
    if (!dateString) return true;
    try {
      const datePart = typeof dateString === 'string' ? dateString.split('T')[0] : new Date(dateString).toISOString().split('T')[0];
      const appointmentDateTime = new Date(`${datePart}T${timeString || '00:00'}`);
      const now = new Date();
      return appointmentDateTime >= now;
    } catch {
      return true;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Appointments
      const apptRes = await api.get("/api/patient/appointments");
      const appointments = (apptRes.data.data || []).map(item => ({
        ...item,
        type: 'appointment',
        status: item.status || 'Pending'
      }));

      // 2. Fetch Second Opinions
      let secondOpinions = [];
      try {
        const soRes = await api.get("/api/patient/get-second-opinion");
        secondOpinions = (soRes.data.data || []).map(item => ({
          ...item,
          type: 'second-opinion',
          status: item.status || 'Pending',
          date: typeof item.date === 'string' ? item.date.split('T')[0] : (item.date ? new Date(item.date).toISOString().split('T')[0] : item.createdAt?.split('T')[0]),
          time: item.time || '10:00'
        }));
      } catch (err) {
        console.warn("Could not fetch all second opinions, trying /accepted");
        try {
          const soResAccepted = await api.get("/api/patient/get-second-opinion/accepted");
          secondOpinions = (soResAccepted.data.data || []).map(item => ({
            ...item,
            type: 'second-opinion',
            status: item.status || 'Accepted',
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartChat = (pid, did) => {
    if (!did) return;
    navigate(`/chat/${did}-${pid}`);
  };

  // ============ CANCEL HANDLER ============
  const handleCancel = async (item) => {
    const isAppt = item.type === 'appointment';
    const confirmMsg = isAppt
      ? 'Are you sure you want to cancel this appointment?'
      : 'Are you sure you want to cancel this second opinion request?';

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(item._id);
    try {
      const endpoint = isAppt
        ? `/api/patient/cancel-appointment/${item._id}`
        : `/api/patient/cancel-second-opinion/${item._id}`;

      const res = await api.post(endpoint);
      if (res.data.success) {
        toast.success(res.data.message || 'Cancelled successfully!');
        fetchData(); // Refresh the list
      } else {
        toast.error(res.data.message || 'Failed to cancel.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // ============ RESCHEDULE HANDLERS ============
  const openRescheduleModal = (item) => {
    setRescheduleModal({ open: true, item });
    // Pre-fill with current date/time
    const currentDate = typeof item.date === 'string' ? item.date.split('T')[0] : '';
    setRescheduleDate(currentDate);
    setRescheduleTime(item.time || '');
  };

  const closeRescheduleModal = () => {
    setRescheduleModal({ open: false, item: null });
    setRescheduleDate('');
    setRescheduleTime('');
  };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select both date and time.');
      return;
    }

    // Validate future date
    const selectedDateTime = new Date(`${rescheduleDate}T${rescheduleTime}`);
    if (selectedDateTime <= new Date()) {
      toast.error('Please select a future date and time.');
      return;
    }

    const item = rescheduleModal.item;
    const isAppt = item.type === 'appointment';

    setActionLoading(item._id);
    try {
      const endpoint = isAppt
        ? `/api/patient/reschedule-appointment/${item._id}`
        : `/api/patient/reschedule-second-opinion/${item._id}`;

      const res = await api.put(endpoint, { date: rescheduleDate, time: rescheduleTime });
      if (res.data.success) {
        toast.success(res.data.message || 'Rescheduled successfully!');
        closeRescheduleModal();
        fetchData(); // Refresh the list
      } else {
        toast.error(res.data.message || 'Failed to reschedule.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reschedule. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // --- Filtering Logic ---
  const getFilteredItems = () => {
    return allItems.filter(item => {
      const isActive = isRecentOrFuture(item.date);

      // Tab Filters
      if (filter === 'all') {
        if (!isActive) return false;
      } else if (filter === 'appointments') {
        if (item.type !== 'appointment') return false;
        if (!isActive) return false;
      } else if (filter === 'second-opinions') {
        if (item.type !== 'second-opinion') return false;
        if (!isActive) return false;
      } else if (filter === 'history') {
        if (isActive) return false;
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

  // Helper: Can this item be cancelled or rescheduled?
  const canModify = (item) => {
    const s = item.status.toLowerCase();
    // Allow modification for all future items, and for pending items within the last 7 days
    if (s === 'pending') return isRecentOrFuture(item.date);
    if (s === 'accepted') return isFuture(item.date, item.time);
    return false;
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
              const status = item.status;
              const isPast = !isFuture(item.date, item.time);
              const displayStatus = (status.toLowerCase() === 'accepted' && isPast) ? 'Completed' : status;
              
              const canChat = status.toLowerCase() === 'accepted' && !isPast; // Disable chat for past items
              const doctorId = item.doctorId?._id || item.doctorId;
              const isItemLoading = actionLoading === item._id;

              return (
                <div key={item._id} className="oc-card">
                  <div className={`oc-card-img-section ${isAppt ? 'img-appointment' : 'img-second-opinion'}`}>
                    <img
                      src={item.doctorId?.profileImage || defaultDoctorImage}
                      alt={docName}
                      className="oc-card-img"
                      onError={(e) => { e.target.src = defaultDoctorImage; }}
                    />
                    <span className={`oc-type-tag ${isAppt ? 'tag-appointment' : 'tag-second-opinion'}`}>
                      {isAppt ? 'Appointment' : '2nd Opinion'}
                    </span>
                  </div>

                  <div className="oc-card-content">
                    {/* Header: Name + Status */}
                    <div className="oc-card-top">
                      <div className="oc-card-title-group">
                        <h3 className="oc-doc-name">{docName}</h3>
                        <span className="oc-doc-spec">{item.doctorId?.specialization || (isAppt ? "Specialist" : "Second Opinion")}</span>
                      </div>
                      <span className={`oc-status-pill status-${displayStatus.toLowerCase()}`}>
                        {(displayStatus.toLowerCase() === 'accepted' || displayStatus.toLowerCase() === 'completed') && <CheckCircle size={12} />}
                        {displayStatus.toLowerCase() === 'cancelled' && <XCircle size={12} />}
                        {displayStatus}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="oc-card-meta">
                      <div className="oc-meta-item">
                        <AlertCircle size={14} />
                        <span>{item.problem?.substring(0, 25) || "N/A"}{item.problem?.length > 25 ? "..." : ""}</span>
                      </div>
                      <div className="oc-meta-item">
                        <Calendar size={14} />
                        <span>{item.date || "N/A"}</span>
                      </div>
                      <div className="oc-meta-item">
                        <Clock size={14} />
                        <span>{item.time || "N/A"}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="oc-card-actions">
                      {!isRecentOrFuture(item.date) ? (
                        <div className="oc-status-display">
                          <span className="oc-status-label">Status:</span>
                          <span className={`oc-status-value status-text-${displayStatus.toLowerCase()}`}>{displayStatus}</span>
                        </div>
                      ) : (
                        <div className="oc-action-buttons">
                          {canChat && (
                            <button
                              className="oc-btn-chat"
                              onClick={() => handleStartChat(item.patientId, doctorId)}
                            >
                              <MessageSquare size={15} /> Chat
                            </button>
                          )}
                          {canModify(item) && (
                            <>
                              <button
                                className="oc-btn-reschedule"
                                onClick={() => openRescheduleModal(item)}
                                disabled={isItemLoading}
                              >
                                <RefreshCw size={14} /> Reschedule
                              </button>
                              <button
                                className="oc-btn-cancel"
                                onClick={() => handleCancel(item)}
                                disabled={isItemLoading}
                              >
                                {isItemLoading ? '...' : <><X size={14} /> Cancel</>}
                              </button>
                            </>
                          )}
                          {!canModify(item) && !canChat && (
                            <div className="oc-btn-disabled">
                              <XCircle size={16} /> {status}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ============ RESCHEDULE MODAL ============ */}
      {rescheduleModal.open && (
        <div className="oc-modal-overlay" onClick={closeRescheduleModal}>
          <div className="oc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oc-modal-header">
              <h2>Reschedule {rescheduleModal.item?.type === 'appointment' ? 'Appointment' : 'Second Opinion'}</h2>
              <button className="oc-modal-close" onClick={closeRescheduleModal}>
                <X size={20} />
              </button>
            </div>
            <div className="oc-modal-body">
              <p className="oc-modal-doctor">
                Dr. {rescheduleModal.item?.doctorId?.name || 'Doctor'}
                {rescheduleModal.item?.doctorId?.specialization && (
                  <span> — {rescheduleModal.item.doctorId.specialization}</span>
                )}
              </p>
              <div className="oc-modal-field">
                <label><Calendar size={16} /> New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="oc-modal-field">
                <label><Clock size={16} /> New Time</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="oc-modal-footer">
              <button className="oc-modal-btn-cancel" onClick={closeRescheduleModal}>
                Cancel
              </button>
              <button
                className="oc-modal-btn-confirm"
                onClick={handleReschedule}
                disabled={actionLoading === rescheduleModal.item?._id}
              >
                {actionLoading === rescheduleModal.item?._id ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultation;
