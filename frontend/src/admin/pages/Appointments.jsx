import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PatientIcon,
  LocalHospital as DoctorIcon,
  CheckCircle as CompletedIcon,
  Schedule as ScheduledIcon,
  Cancel as CancelledIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as PaymentIcon
} from '@mui/icons-material';
import adminService from '../services/adminService';
import './Appointments.css';

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit] = useState(10);
  const [globalStats, setGlobalStats] = useState({});
  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'opinion'

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filterStatus, searchTerm, activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        q: searchTerm || undefined
      };

      let response;
      if (activeTab === 'regular') {
        response = await adminService.getAppointments(params);

        // Also fetch global status stats
        const statsResponse = await adminService.getAppointmentAnalytics();
        if (Array.isArray(statsResponse)) {
          const statsObj = {};
          statsResponse.forEach(item => {
            statsObj[item._id?.toLowerCase()] = item.count;
          });
          setGlobalStats(statsObj);
        }
      } else {
        response = await adminService.getSecondOpinions(params);
        // For second opinions, update global total
        setGlobalStats({ total: response.meta?.total || 0 });
      }

      if (response.success) {
        setAppointments(response.data || []);
        setTotalPages(response.meta?.totalPages || Math.ceil((response.meta?.total || 0) / limit) || 1);
        setTotalResults(response.meta?.total || 0);
      } else {
        setAppointments(response.data || response || []);
      }
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this record?')) {
      try {
        let response;
        if (activeTab === 'regular') {
          response = await adminService.deleteAppointment(id);
        } else {
          response = await adminService.deleteSecondOpinion(id);
        }

        if (response.success) {
          fetchAppointments();
        } else {
          alert('Failed to delete: ' + (response.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete record');
      }
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm(`Are you sure you want to cancel this ${activeTab === 'regular' ? 'appointment' : 'request'}?`)) {
      try {
        let response;
        if (activeTab === 'regular') {
          response = await adminService.cancelAppointment(id);
        } else {
          response = await adminService.cancelSecondOpinion(id);
        }

        if (response.success) {
          fetchAppointments();
        } else {
          alert('Failed to cancel: ' + (response.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Cancel error:', err);
        alert('Failed to cancel');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <CompletedIcon className="status-icon completed" />;
      case 'scheduled': return <ScheduledIcon className="status-icon scheduled" />;
      case 'cancelled': return <CancelledIcon className="status-icon cancelled" />;
      default: return <ScheduledIcon className="status-icon pending" />;

    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'scheduled': return 'status-scheduled';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // No longer needed client-side filter as we use server-side paging/filtering
  const filteredAppointments = appointments;

  const stats = {
    total: totalResults,
    scheduled: globalStats['scheduled'] || 0,
    completed: globalStats['completed'] || 0,
    cancelled: globalStats['cancelled'] || 0
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="appointments-container">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchAppointments}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      {/* Header */}
      <div className="appointments-header">
        <div className="header-content">
          <h1>{activeTab === 'regular' ? 'Appointments' : 'Second Opinions'} Management</h1>
          <p className="subtitle">View and manage all {activeTab === 'regular' ? 'patient appointments' : 'second opinion requests'}</p>
        </div>
        <button className="refresh-btn" onClick={fetchAppointments}>
          <RefreshIcon /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="appointments-tabs">
        <button
          className={`tab-btn ${activeTab === 'regular' ? 'active' : ''}`}
          onClick={() => { setActiveTab('regular'); setCurrentPage(1); }}
        >
          <CalendarIcon /> Regular Appointments
        </button>
        <button
          className={`tab-btn ${activeTab === 'opinion' ? 'active' : ''}`}
          onClick={() => { setActiveTab('opinion'); setCurrentPage(1); }}
        >
          <DoctorIcon /> Get Second Opinions
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"><CalendarIcon /></div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="stat-card scheduled">
          <div className="stat-icon"><ScheduledIcon /></div>
          <div className="stat-info">
            <h3>{stats.scheduled}</h3>
            <p>Scheduled</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon"><CompletedIcon /></div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-icon"><CancelledIcon /></div>
          <div className="stat-info">
            <h3>{stats.cancelled}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FilterIcon className="filter-icon" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Pro Table Section */}
      <div className="pro-table-wrapper">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state-v2">
            <div className="empty-icon-glow">
              <CalendarIcon fontSize="large" />
            </div>
            <h3>No Appointments</h3>
            <p>Your filter returned empty results.</p>
          </div>
        ) : (
          <table className="elite-pro-table">
            <thead>
              <tr>
                <th className="th-patient">Patient Information</th>
                <th className="th-doctor">Doctor Details</th>
                <th className="th-schedule">Schedule</th>
                <th className="th-type">Type</th>
                <th className="th-payment">Billing</th>
                <th className="th-status">Live Status</th>
                <th className="th-actions">Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id} className={`pro-row ${getStatusClass(apt.status)}`}>
                  <td>
                    <div className="elite-cell identity">
                      <div className="avatar-v2 p-avatar">
                        {apt.patient?.name?.charAt(0) || 'P'}
                      </div>
                      <div className="info-v2">
                        <span className="main-text">{apt.patient?.name || 'Unknown'}</span>
                        <span className="sub-text">{apt.patient?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="elite-cell identity">
                      <div className="avatar-v2 d-avatar">
                        {apt.doctor?.name?.charAt(0) || 'D'}
                      </div>
                      <div className="info-v2">
                        <span className="main-text">Dr. {apt.doctor?.name || 'Unknown'}</span>
                        <span className="sub-text">{apt.doctor?.specialization || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="elite-cell schedule">
                      <span className="dt-date"><CalendarIcon fontSize="inherit" /> {formatDate(apt.date)}</span>
                      <span className="dt-time"><TimeIcon fontSize="inherit" /> {apt.time || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`elite-type-badge ${apt.type?.toLowerCase()}`}>
                      {apt.type || 'Consultation'}
                    </span>
                  </td>
                  <td>
                    <span className={`elite-pay-badge ${apt.paymentStatus?.toLowerCase()}`}>
                      {apt.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className={`elite-status-pill ${getStatusClass(apt.status)}`}>
                      <span className="status-dot"></span>
                      <span className="status-label">{apt.status || 'Pending'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="elite-actions">
                      <button className="elite-btn v2-view" onClick={() => handleViewDetails(apt)} title="View Detail">
                        <ViewIcon fontSize="small" />
                      </button>
                      {(apt.status?.toLowerCase() === 'scheduled' || apt.status?.toLowerCase() === 'pending') && (
                        <button className="elite-btn v2-cancel" onClick={() => handleCancelAppointment(apt._id)} title="Cancel">
                          <CancelledIcon fontSize="small" />
                        </button>
                      )}
                      <button className="elite-btn v2-delete" onClick={() => handleDeleteAppointment(apt._id)} title="Remove">
                        <DeleteIcon fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing <span>{(currentPage - 1) * limit + 1}</span> to <span>{Math.min(currentPage * limit, totalResults)}</span> of <span>{totalResults}</span> results
          </div>
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Elite Modal */}
      {showModal && selectedAppointment && (
        <div className="elite-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="elite-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-status-bar ${getStatusClass(selectedAppointment.status)}`}></div>

            <div className="elite-modal-header">
              <div className="header-ident">
                <div className="header-icon-box">
                  <CalendarIcon />
                </div>
                <div>
                  <h2>Appointment Details</h2>
                  <p className="modal-subtitle">ID: {selectedAppointment._id?.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <button className="elite-close-x" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="elite-modal-body">
              {/* Top Row: User & Doctor Ident */}
              <div className="modal-info-grid">
                <div className="modal-section-v2 patient-zone">
                  <h3><PatientIcon fontSize="small" /> Patient</h3>
                  <div className="zone-content">
                    <div className="avatar-large">{selectedAppointment.patient?.name?.charAt(0)}</div>
                    <div className="zone-details">
                      <strong className="name-big">{selectedAppointment.patient?.name}</strong>
                      <span>{selectedAppointment.patient?.email}</span>
                      <span>{selectedAppointment.patient?.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-section-v2 doctor-zone">
                  <h3><DoctorIcon fontSize="small" /> Medical Provider</h3>
                  <div className="zone-content">
                    <div className="avatar-large d-bg">{selectedAppointment.doctor?.name?.charAt(0)}</div>
                    <div className="zone-details">
                      <strong className="name-big">Dr. {selectedAppointment.doctor?.name}</strong>
                      <span>{selectedAppointment.doctor?.specialization}</span>
                      <span className="fee-tag">Consultation Fee: ₹{selectedAppointment.fee || selectedAppointment.doctor?.feePerConsultation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Schedule & Billing */}
              <div className="modal-data-strip">
                <div className="data-bit">
                  <label><TimeIcon fontSize="inherit" /> Date & Time</label>
                  <span>{formatDate(selectedAppointment.date)} at {selectedAppointment.time}</span>
                </div>
                <div className="data-bit">
                  <label><PaymentIcon fontSize="inherit" /> Billing Status</label>
                  <span className={`billing-pill ${selectedAppointment.paymentStatus?.toLowerCase()}`}>
                    {selectedAppointment.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div className="data-bit">
                  <label>Current Status</label>
                  <span className={`status-pill-v2 ${getStatusClass(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Details & Analysis */}
              <div className="modal-special-section">
                <h3>
                  {activeTab === 'opinion' ? <FilterIcon fontSize="small" /> : <CalendarIcon fontSize="small" />}
                  {activeTab === 'opinion' ? ' Second Opinion Analysis' : ' Appointment Particulars'}
                </h3>
                <div className="special-grid">
                  <div className="special-item full">
                    <label>Reported Problem / Reason for Visit</label>
                    <p className="problem-text">{selectedAppointment.problem || 'No description provided.'}</p>
                  </div>

                  {activeTab === 'regular' && selectedAppointment.specialization && (
                    <div className="special-item">
                      <label>Requested Specialization</label>
                      <span className="mode-badge">{selectedAppointment.specialization}</span>
                    </div>
                  )}

                  {activeTab === 'opinion' && (
                    <>
                      <div className="special-item full">
                        <label>Proposed Treatment (Previous Physician)</label>
                        <p>{selectedAppointment.treatment || 'No treatment details.'}</p>
                      </div>
                      <div className="special-item">
                        <label>Consultation Mode</label>
                        <span className="mode-badge">{selectedAppointment.mode}</span>
                      </div>
                      {selectedAppointment.files && selectedAppointment.files.length > 0 && (
                        <div className="special-item">
                          <label>Medical Records</label>
                          <div className="elite-files">
                            {selectedAppointment.files.map((file, idx) => (
                              <a key={idx} href={file} target="_blank" rel="noopener noreferrer" className="elite-file-link">
                                Record #{idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedAppointment.createdAt && (
                    <div className="special-item">
                      <label>Request Date</label>
                      <span className="timestamp-text">{new Date(selectedAppointment.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="elite-modal-footer">
              <button className="footer-close-btn" onClick={() => setShowModal(false)}>Dismiss Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
