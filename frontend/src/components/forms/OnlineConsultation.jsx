
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
  const [activeMainTab, setActiveMainTab] = useState('consultations');
  const [vaultFiles, setVaultFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const fetchVaultFiles = async () => {
    try {
      setVaultLoading(true);
      const res = await api.get('/api/patient/medical-records');
      if (res.data.success) {
        setVaultFiles(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching medical records:", err);
    } finally {
      setVaultLoading(false);
    }
  };

  const handleUploadFile = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      setUploading(true);
      const res = await api.post('/api/patient/medical-records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        toast.success(res.data.message || 'Records uploaded successfully!');
        fetchVaultFiles();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload files.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVaultFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    try {
      const res = await api.delete(`/api/patient/medical-records/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Record deleted!');
        fetchVaultFiles();
      }
    } catch (err) {
      toast.error('Failed to delete record.');
    }
  };

  const fetchTimelineData = async () => {
    try {
      setTimelineLoading(true);
      const rxRes = await api.get('/api/patient/prescriptions');
      const prescriptions = (rxRes.data.data || []).map(item => ({
        ...item,
        type: 'prescription',
        date: item.createdAt?.split('T')[0],
        time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      }));

      const combined = [...allItems, ...prescriptions].sort((a, b) => {
        const dateA = new Date(`${a.date || '2025-01-01'}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date || '2025-01-01'}T${b.time || '00:00'}`);
        return dateB - dateA;
      });

      setTimelineItems(combined);
    } catch (err) {
      console.error("Error fetching timeline data:", err);
    } finally {
      setTimelineLoading(false);
    }
  };

  useEffect(() => {
    if (activeMainTab === 'vault') {
      fetchVaultFiles();
    } else if (activeMainTab === 'timeline') {
      fetchTimelineData();
    }
  }, [activeMainTab, allItems]);

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
          <h1 className="oc-title">My Care Center</h1>
          <p className="oc-subtitle">Access your appointments, secure medical vault, and care timeline</p>
        </div>

        {/* Main Tab Navigation */}
        <div className="oc-main-tabs">
          <button 
            onClick={() => setActiveMainTab('consultations')} 
            className={`oc-main-tab ${activeMainTab === 'consultations' ? 'active' : ''}`}
          >
            <Calendar size={18} /> My Appointments
          </button>
          <button 
            onClick={() => setActiveMainTab('vault')} 
            className={`oc-main-tab ${activeMainTab === 'vault' ? 'active' : ''}`}
          >
            <FileText size={18} /> Medical Vault
          </button>
          <button 
            onClick={() => setActiveMainTab('timeline')} 
            className={`oc-main-tab ${activeMainTab === 'timeline' ? 'active' : ''}`}
          >
            <History size={18} /> Care Timeline
          </button>
        </div>

        {/* --- CONSULTATIONS MAIN TAB --- */}
        {activeMainTab === 'consultations' && (
          <>
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

            {/* Stats Row */}
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
                  
                  const canChat = status.toLowerCase() === 'accepted' && !isPast;
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
          </>
        )}

        {/* --- VAULT MAIN TAB --- */}
        {activeMainTab === 'vault' && (
          <div className="vault-container" style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#0f172a', margin: '0 0 4px 0' }}>Medical Document Vault</h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>Securely upload and manage your medical reports and test results.</p>
              </div>
              <div>
                <label className="upload-btn" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                  transition: 'background 0.2s'
                }}>
                  <RefreshCw className={uploading ? "mp-spinner" : ""} size={16} />
                  {uploading ? "Uploading..." : "Upload New Record"}
                  <input type="file" multiple onChange={handleUploadFile} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
            </div>

            {vaultLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading records...</div>
            ) : vaultFiles.length === 0 ? (
              <div className="oc-empty" style={{ padding: '48px 24px' }}>
                <FileText size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                <h3>Your vault is empty</h3>
                <p style={{ maxWidth: '320px', margin: '8px auto 0' }}>Upload your laboratory tests and medical files to securely access them at any time.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
                {vaultFiles.map((file) => {
                  const isImage = file.fileType?.startsWith('image/');
                  return (
                    <div key={file._id} style={{
                      backgroundColor: '#fff',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                      transition: 'all 0.25s ease'
                    }}
                    className="vault-file-card"
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: isImage ? '#fdf2f8' : '#eff6ff',
                            color: isImage ? '#db2777' : '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}>
                            {isImage ? '🖼️' : '📄'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={file.title}>
                              {file.title}
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                              {new Date(file.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{
                          flex: 1,
                          textAlign: 'center',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          padding: '8px 0',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          transition: 'background 0.2s'
                        }}
                        className="vault-view-btn"
                        >
                          View
                        </a>
                        <button onClick={() => handleDeleteVaultFile(file._id)} style={{
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          transition: 'background 0.2s'
                        }}
                        className="vault-delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TIMELINE MAIN TAB --- */}
        {activeMainTab === 'timeline' && (
          <div className="timeline-container" style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#0f172a', margin: '0 0 4px 0' }}>Treatment & Care Timeline</h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>A complete chronological journey of your healthcare: appointments, opinions, and medical prescriptions.</p>
            </div>

            {timelineLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading timeline...</div>
            ) : timelineItems.length === 0 ? (
              <div className="oc-empty" style={{ padding: '48px 24px' }}>
                <History size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                <h3>Timeline is empty</h3>
                <p style={{ maxWidth: '320px', margin: '8px auto 0' }}>Your history will populate automatically as you schedule appointments and receive prescriptions.</p>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '32px', margin: '16px 0' }}>
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '8px',
                  bottom: '8px',
                  width: '3px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '99px'
                }}></div>

                {timelineItems.map((item, index) => {
                  const isRx = item.type === 'prescription';
                  const isSecondOpinion = item.type === 'second-opinion';

                  let dotBg = '#3b82f6';
                  let dotIcon = '📅';
                  let cardTitle = 'Appointment booked';
                  let cardSub = '';
                  let details = '';

                  if (isRx) {
                    dotBg = '#10b981';
                    dotIcon = '💊';
                    cardTitle = 'Prescription Issued';
                    cardSub = `Dr. ${item.doctorId?.name || 'Doctor'}`;
                    details = `Diagnosis: ${item.diagnosis || 'General checkup'}`;
                  } else if (isSecondOpinion) {
                    dotBg = '#db2777';
                    dotIcon = '🤝';
                    cardTitle = 'Second Opinion Request';
                    cardSub = `Dr. ${item.doctorId?.name || 'Pending Specialist'}`;
                    details = `Reason/Problem: ${item.problem}`;
                  } else {
                    cardSub = `Dr. ${item.doctorId?.name || 'Doctor'}`;
                    details = `Reason/Problem: ${item.problem}`;
                  }

                  return (
                    <div key={item._id || index} style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: dotBg,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        boxShadow: '0 0 0 4px #fff',
                        zIndex: 2
                      }}>
                        {dotIcon}
                      </div>

                      <div style={{
                        backgroundColor: '#fff',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        borderRadius: '16px',
                        padding: '18px',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: dotBg, letterSpacing: '0.05em' }}>
                            {cardTitle}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                            {item.date} {item.time && `• ${item.time}`}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '750', color: '#0f172a', margin: 0 }}>
                          {cardSub}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                          {details}
                        </p>
                        {isRx && (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <button onClick={() => navigate('/prescriptions')} style={{
                              background: 'none',
                              border: '1px solid #10b981',
                              color: '#10b981',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            className="timeline-action-btn"
                            >
                              View Full Prescription Detail
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
