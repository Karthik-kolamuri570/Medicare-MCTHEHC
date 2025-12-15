import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAllAppointments();
        if (res && res.success) setAppointments(res.data || []);
        else setError('Failed to load appointments');
      } catch (err) {
        console.error(err);
        setError('Error while fetching appointments');
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="admin-appointments-page">
      <div className="appointments-header">
        <h2>Appointments</h2>
        <div className="appointments-toolbar">
          <div className="filters">
            <input className="filter-input" placeholder="Filter by Date Range" />
            <select className="filter-input">
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>Pending</option>
            </select>
            <select className="filter-input">
              <option>All Doctors</option>
            </select>
          </div>
          <div className="actions">
            <button className="btn muted">Reschedule Selected</button>
            <button className="btn danger">Cancel Selected</button>
            <button className="btn">Export Data</button>
            <button className="btn">Table View</button>
            <button className="btn">Calendar View</button>
          </div>
        </div>
      </div>
      {loading && <p>Loading appointments...</p>}
      {error && <p className="error">{error}</p>}

      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th style={{ width: 140 }}>Date</th>
              <th style={{ width: 120 }}>Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th style={{ width: 120 }}>Status</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} className="table-row">
                <td><input type="checkbox" /></td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.patientId?.name || a.patientId?.email || 'Unknown'}</td>
                <td>{a.doctorId?.name || a.doctorId?.specialization || 'Unknown'}</td>
                <td>
                  <span className={`status-badge status-${(a.status || '').toLowerCase()}`}>{a.status}</span>
                </td>
                <td>
                  <button className="btn small">View</button>
                  <button className="btn danger small">Cancel</button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && !loading && (
              <tr><td colSpan={7}>No appointments found</td></tr>
            )}
          </tbody>
        </table>

        <div className="appointments-footer">
          <div className="summary">0 of {appointments.length} row(s) selected.</div>
          <div className="pagination">
            <button className="btn small">◀</button>
            <span className="page">Page 1 of 1</span>
            <button className="btn small">▶</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
