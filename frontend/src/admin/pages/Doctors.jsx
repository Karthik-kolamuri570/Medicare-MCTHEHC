import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
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
        // fallback if API returns doctors directly
        setSelected(res.data || res);
      } else {
        // fallback: try using existing list
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
      <h2>Doctor Applications Review</h2>
      {loading && <p>Loading...</p>}
      <div className="doctors-grid">
        {doctors && doctors.length > 0 ? doctors.map((d) => (
          <div key={d._id} className="doctor-card">
            <div className="doctor-card-body">
              <div className="doctor-avatar">{d.name ? d.name.charAt(0) : 'D'}</div>
              <div className="doctor-info">
                <h4>{d.name}</h4>
                <p className="muted">{d.specialization}</p>
                <p className="muted">Applied: {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''}</p>
                <div className="doctor-actions">
                  <button className="btn small" onClick={() => viewDetails(d._id)}>View Details</button>
                  <button className="btn success small" onClick={() => approve(d._id)}>Approve</button>
                  <button className="btn danger small" onClick={() => reject(d._id)}>Reject</button>
                </div>
              </div>
            </div>
          </div>
        )) : <p>No pending doctors</p>}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>×</button>
            <h3>{selected.name}</h3>
            <p><strong>Specialization:</strong> {selected.specialization || 'Not provided'}</p>
            <p><strong>Experience:</strong> {selected.experience ? `${selected.experience} years` : 'Not provided'}</p>
            <p><strong>Hospital:</strong> {selected.hospital || 'Not provided'}</p>
            <p><strong>Location:</strong> {selected.location || 'Not provided'}</p>
            <p><strong>Fee:</strong> {selected.feePerConsultation ? `₹${selected.feePerConsultation}` : 'Not provided'}</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
              <button className="btn success" onClick={() => { approve(selected._id); setSelected(null); }}>Approve</button>
              <button className="btn danger" onClick={() => { reject(selected._id); setSelected(null); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
