import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  WorkOutline as ExpIcon,
  LocalHospital as HospitalIcon,
  LocationOn as LocationIcon,
  AttachMoney as FeesIcon
} from '@mui/icons-material';
import './Doctors.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPendingDoctors();
      if (res) setDoctors(res);
    } catch (err) {
      console.error('Failed to load pending doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (doctorId) => {
    try {
      await adminService.approveDoctorRegistration(doctorId);
      fetchPending();
    } catch (err) { console.error(err); }
  };

  const reject = async (doctorId) => {
    try {
      await adminService.rejectDoctorRegistration(doctorId);
      fetchPending();
    } catch (err) { console.error(err); }
  };

  const viewDetails = async (doctorId) => {
    try {
      const res = await adminService.getDoctorProfile(doctorId);
      if (res && res.success) {
        setSelected(res.data);
      } else if (res && res.data) {
        setSelected(res.data || res);
      } else {
        const fallback = doctors.find(d => d._id === doctorId);
        setSelected(fallback || null);
      }
    } catch (err) {
      console.error('Failed to fetch doctor details', err);
      const fallback = doctors.find(d => d._id === doctorId);
      setSelected(fallback || null);
    }
  };

  return (
    <div className="admin-doctors-page">
      <div className="page-header">
        <h2>Doctor Applications Review</h2>
        <p className="subtitle">Review and manage pending doctor registration requests.</p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Loading applications...
        </div>
      )}

      <div className="doctors-grid">
        {!loading && doctors.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1', background: '#f8f9fa', borderRadius: '12px' }}>
            <h3>No pending applications</h3>
            <p style={{ color: '#666' }}>All caught up! There are no doctor applications waiting for approval.</p>
          </div>
        ) : (
          doctors.map((d) => (
            <div key={d._id} className="doctor-card">
              <div className="doctor-card-body">
                <div className="doctor-avatar">
                  {d.name ? d.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div className="doctor-info">
                  <h4>{d.name}</h4>
                  <p className="specialization">{d.specialization || 'General Practitioner'}</p>

                  <div className="meta-row">
                    <TimeIcon fontSize="inherit" />
                    <span>Applied: {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  {d.location && (
                    <div className="meta-row">
                      <LocationIcon fontSize="inherit" />
                      <span>{d.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-footer">
                <button className="btn btn-view" onClick={() => viewDetails(d._id)}>
                  View Details
                </button>
                <div className="action-buttons">
                  <button className="btn btn-icon btn-approve" onClick={() => approve(d._id)} title="Approve">
                    <CheckIcon fontSize="small" />
                  </button>
                  <button className="btn btn-icon btn-reject" onClick={() => reject(d._id)} title="Reject">
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Doctor Details</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="doctor-avatar" style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                  {selected.name ? selected.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px' }}>{selected.name}</h4>
                  <span style={{ color: '#666', fontSize: '14px' }}>{selected.email}</span>
                </div>
              </div>

              <div className="detail-row">
                <strong><ExpIcon style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} /> Specialization</strong>
                <span>{selected.specialization || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <strong><ExpIcon style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} /> Experience</strong>
                <span>{selected.experience ? `${selected.experience} years` : 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <strong><HospitalIcon style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} /> Hospital</strong>
                <span>{selected.hospital || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <strong><LocationIcon style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} /> Location</strong>
                <span>{selected.location || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <strong><FeesIcon style={{ fontSize: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} /> Consultation Fee</strong>
                <span>{selected.feePerConsultation ? `₹${selected.feePerConsultation}` : 'Not provided'}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-full btn-view" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-full btn-reject" onClick={() => { reject(selected._id); setSelected(null); }}>
                <CloseIcon fontSize="small" style={{ marginRight: '5px' }} /> Reject
              </button>
              <button className="btn btn-full btn-approve" onClick={() => { approve(selected._id); setSelected(null); }}>
                <CheckIcon fontSize="small" style={{ marginRight: '5px' }} /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
