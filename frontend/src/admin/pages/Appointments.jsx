import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './Appointments.css';

const formatName = (appt) => {
  return appt.patientName || appt.patient?.name || appt.patient?.email || (appt.patient && appt.patient[0] && appt.patient[0].name) || 'Unknown';
};

const formatDoctor = (appt) => {
  return appt.doctorName || appt.doctor?.name || (appt.doctor && appt.doctor[0] && appt.doctor[0].name) || appt.doctor?.specialization || 'Unknown';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!isNaN(d)) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  // fallback for YYYY-MM-DD strings
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const dd = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T00:00:00`);
    if (!isNaN(dd)) return dd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateStr;
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // timeStr like '16:19' or '11:53'
  const m = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return timeStr;
  let hr = parseInt(m[1], 10);
  const min = m[2];
  const ampm = hr >= 12 ? 'PM' : 'AM';
  hr = hr % 12 || 12;
  return `${hr}:${min} ${ampm}`;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', doctorId: '', fromDate: '', toDate: '', q: '' });
  const [doctors, setDoctors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [rescheduleValues, setRescheduleValues] = useState({ date: '', time: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await adminService.getDoctors({ verified: 'approved' });
        let data = [];
        if (!res) data = [];
        else if (res && res.success) data = res.data || [];
        else if (Array.isArray(res)) data = res;
        else if (res.data && Array.isArray(res.data)) data = res.data;
        setDoctors(data || []);
      } catch (e) { console.error(e); }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await adminService.getAppointments({ page, limit, ...filters });
        if (res && res.success) {
          setAppointments(res.data || []);
          setTotal(res.meta?.total || 0);
        } else setError('Failed to load appointments');
      } catch (err) {
        console.error(err);
        setError('Error while fetching appointments');
      } finally { setLoading(false); }
    };
    fetch();
  }, [page, limit, filters]);

  useEffect(() => {
    // when page data changes, clear select all
    setSelectAll(false);
    setSelected(new Set());
  }, [appointments]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const ids = new Set(appointments.map(a => a._id));
      setSelected(ids);
      setSelectAll(true);
    }
  };

  const doBulkCancel = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Cancel ${selected.size} appointment(s)?`)) return;
    setLoading(true);
    try {
      const res = await adminService.bulkCancelAppointments(Array.from(selected));
      if (res && res.success) {
        setSelected(new Set());
        setSelectAll(false);
        // refresh
        const r2 = await adminService.getAppointments({ page, limit, ...filters });
        if (r2 && r2.success) {
          setAppointments(r2.data || []);
          setTotal(r2.meta?.total || 0);
        }
      } else alert('Failed to cancel');
    } catch (e) { console.error(e); alert('Error while cancelling'); }
    finally { setLoading(false); }
  };

  const doCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    setLoading(true);
    try {
      const res = await adminService.cancelAppointment(id);
      if (res && res.success) {
        const r2 = await adminService.getAppointments({ page, limit, ...filters });
        if (r2 && r2.success) {
          setAppointments(r2.data || []);
          setTotal(r2.meta?.total || 0);
        }
      } else alert('Failed to cancel');
    } catch (e) { console.error(e); alert('Error while cancelling'); }
    finally { setLoading(false); }
  };

  const openModal = (appt) => {
    setModalData(appt);
    setRescheduleValues({ date: appt.date || '', time: appt.time || '' });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setModalData(null); };

  const submitReschedule = async () => {
    if (!modalData) return;
    const { date, time } = rescheduleValues;
    if (!date || !time) { alert('Date and time required'); return; }
    setLoading(true);
    try {
      const res = await adminService.rescheduleAppointment(modalData._id, date, time);
      if (res && res.success) {
        closeModal();
        const r2 = await adminService.getAppointments({ page, limit, ...filters });
        if (r2 && r2.success) {
          setAppointments(r2.data || []);
          setTotal(r2.meta?.total || 0);
        }
      } else alert('Failed to reschedule');
    } catch (e) { console.error(e); alert('Error while rescheduling'); }
    finally { setLoading(false); }
  };

  const exportCSV = () => {
    const rows = appointments.map(a => ({
      Date: a.date,
      Time: a.time,
      Patient: formatName(a),
      Doctor: formatDoctor(a),
      Status: a.status
    }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `appointments_page_${page}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-appointments-page">
      <div className="appointments-header">
        <h2>Appointments</h2>
        <div className="appointments-toolbar">
          <div className="filters">
            <input type="date" className="filter-input" value={filters.fromDate} onChange={(e)=>{ setFilters(f=>({...f, fromDate: e.target.value})); setPage(1); }} />
            <input type="date" className="filter-input" value={filters.toDate} onChange={(e)=>{ setFilters(f=>({...f, toDate: e.target.value})); setPage(1); }} />
            <select className="filter-input" value={filters.status} onChange={(e)=>{ setFilters(f=>({...f, status: e.target.value})); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
            </select>
            <input className="filter-input" placeholder="Search patient or doctor" value={filters.q} onChange={(e)=>{ setFilters(f=>({...f, q: e.target.value})); setPage(1); }} />
            <select className="filter-input" value={filters.doctorId} onChange={(e)=>{ setFilters(f=>({...f, doctorId: e.target.value})); setPage(1); }}>
              <option value="">All Doctors</option>
              {doctors.map(d => (<option key={d._id} value={d._id}>{d.name || d.email || d.specialization}</option>))}
            </select>
          </div>
            <div className="toolbar-right">
              <div className="total-count">{total} appointment(s)</div>
              <div className="actions">
                <button className="btn muted" onClick={() => {
                  if (selected.size === 0) return; const id = Array.from(selected)[0]; const appt = appointments.find(a=>a._id===id); if (appt) openModal(appt);
                }}>Reschedule Selected</button>
                <button className="btn danger" onClick={doBulkCancel}>Cancel Selected</button>
                <button className="btn" onClick={exportCSV}>Export Data</button>
                <button className="btn">Table View</button>
                <button className="btn">Calendar View</button>
              </div>
            </div>
        </div>
      </div>
      {loading && <p>Loading appointments...</p>}
      {error && <p className="error">{error}</p>}

      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
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
              <tr key={a._id} className={`table-row ${selected.has(a._id) ? 'selected' : ''}`}>
                <td><input type="checkbox" checked={selected.has(a._id)} onChange={() => toggleSelect(a._id)} /></td>
                <td className="cell-date">{formatDate(a.date)}</td>
                <td className="cell-time">{formatTime(a.time)}</td>
                <td>{formatName(a)}</td>
                <td>{formatDoctor(a)}</td>
                <td>
                  <span className={`status-badge status-${(a.status || '').toLowerCase()}`}>{a.status}</span>
                </td>
                <td>
                  <button className="btn icon-btn" title="View" onClick={() => openModal(a)}><span className="icon">👁️</span></button>
                  <button className="btn icon-btn" title="Reschedule" onClick={() => openModal(a)}><span className="icon">✏️</span></button>
                  <button className="btn icon-btn danger" title="Cancel" onClick={() => doCancel(a._id)}><span className="icon">🗑️</span></button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && !loading && (
              <tr><td colSpan={7}>No appointments found</td></tr>
            )}
          </tbody>
        </table>

        <div className="appointments-footer">
          <div className="summary">{selected.size} of {total} row(s) selected.</div>
          <div className="pagination">
            <button className="btn small" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>◀</button>
            <span className="page">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
            <button className="btn small" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}>▶</button>
          </div>
        </div>
      </div>

      <div className="appointments-actions">
        <button className="btn muted" disabled={selected.size === 0}>Reschedule Selected</button>
        <button className="btn danger" disabled={selected.size === 0} onClick={doBulkCancel}>Cancel Selected</button>
        <button className="btn" onClick={exportCSV}>Export Data</button>
      </div>

      {modalOpen && modalData && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Appointment Details</h3>
            <div className="modal-row"><strong>Date:</strong> {modalData.date}</div>
            <div className="modal-row"><strong>Time:</strong> {modalData.time}</div>
            <div className="modal-row"><strong>Patient:</strong> {formatName(modalData)}</div>
            <div className="modal-row"><strong>Doctor:</strong> {formatDoctor(modalData)}</div>
            <div className="modal-row"><strong>Status:</strong> {modalData.status}</div>

            <h4>Reschedule</h4>
            <div className="modal-row"><input type="date" value={rescheduleValues.date} onChange={(e)=>setRescheduleValues(s=>({...s,date:e.target.value}))} /></div>
            <div className="modal-row"><input type="time" value={rescheduleValues.time} onChange={(e)=>setRescheduleValues(s=>({...s,time:e.target.value}))} /></div>
            <div className="modal-actions">
              <button className="btn" onClick={submitReschedule}>Save</button>
              <button className="btn muted" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
