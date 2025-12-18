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

      {/* Appointments Table */}
      <div className="appointments-table-wrapper">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon className="empty-icon" />
            <h3>No Appointments Found</h3>
            <p>There are no appointments matching your criteria.</p>
          </div>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <div className="cell-with-avatar">
                      <div className="avatar patient-avatar">
                        {apt.patient?.name?.charAt(0) || 'P'}
                      </div>
                      <div className="cell-info">
                        <span className="primary">{apt.patient?.name || 'Unknown'}</span>
                        <span className="secondary">{apt.patient?.email || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-avatar">
                      <div className="avatar doctor-avatar">
                        {apt.doctor?.name?.charAt(0) || 'D'}
                      </div>
                      <div className="cell-info">
                        <span className="primary">{apt.doctor?.name || 'Unknown'}</span>
                        <span className="secondary">{apt.doctor?.specialization || ''}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="date-time-cell">
                      <span className="date"><CalendarIcon /> {formatDate(apt.date)}</span>
                      <span className="time"><TimeIcon /> {apt.time || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${apt.type?.toLowerCase() || 'consultation'}`}>
                      {apt.type || 'Consultation'}
                    </span>
                  </td>
                  <td>
                    <div className="payment-cell">
                      <PaymentIcon />
                      <span className={`payment-status ${apt.paymentStatus?.toLowerCase() || 'pending'}`}>
                        {apt.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(apt.status)}`}>
                      {getStatusIcon(apt.status)}
                      {apt.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        title="View Details"
                        onClick={() => handleViewDetails(apt)}
                      >
                        <ViewIcon />
                      </button>

                      {(apt.status?.toLowerCase() === 'scheduled' || apt.status?.toLowerCase() === 'pending') && (
                        <button
                          className="action-btn cancel"
                          title="Cancel Record"
                          onClick={() => handleCancelAppointment(apt._id)}
                        >
                          <CancelledIcon />
                        </button>
                      )}

                      <button
                        className="action-btn delete"
                        title="Delete Record"
                        onClick={() => handleDeleteAppointment(apt._id)}
                      >
                        <DeleteIcon />
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

      {/* Modal */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4><PatientIcon /> Patient Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <span>{selectedAppointment.patient?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <span>{selectedAppointment.patient?.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Contact</label>
                    <span>{selectedAppointment.patient?.contact || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4><DoctorIcon /> Doctor Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <span>{selectedAppointment.doctor?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Specialization</label>
                    <span>{selectedAppointment.doctor?.specialization || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Fee</label>
                    <span>₹{selectedAppointment.fee || selectedAppointment.doctor?.feePerConsultation || 0}</span>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4><CalendarIcon /> Appointment Details</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Date</label>
                    <span>{formatDate(selectedAppointment.date)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Time</label>
                    <span>{selectedAppointment.time || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-badge ${getStatusClass(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status</label>
                    <span className={`payment-status ${selectedAppointment.paymentStatus?.toLowerCase()}`}>
                      {selectedAppointment.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {activeTab === 'opinion' && (
                <div className="detail-section">
                  <h4><FilterIcon /> Second Opinion Details</h4>
                  <div className="detail-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="detail-item">
                      <label>Problem Description</label>
                      <span>{selectedAppointment.problem || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Proposed Treatment</label>
                      <span>{selectedAppointment.treatment || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Consultation Mode</label>
                      <span style={{ textTransform: 'capitalize' }}>{selectedAppointment.mode || 'N/A'}</span>
                    </div>
                    {selectedAppointment.files && selectedAppointment.files.length > 0 && (
                      <div className="detail-item">
                        <label>Attached Files</label>
                        <div className="files-list">
                          {selectedAppointment.files.map((file, idx) => (
                            <a key={idx} href={file} target="_blank" rel="noopener noreferrer" className="file-link">
                              View Document {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
