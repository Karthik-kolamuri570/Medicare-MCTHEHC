import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ transactionId: '', status: 'All', customer: '', q: '' });

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: meta.limit, ...filters };
      const res = await adminService.getPayments(params);
      if (res && res.success) {
        setPayments(res.data || []);
        setMeta(prev => ({ ...prev, page: res.meta.page, limit: res.meta.limit, total: res.meta.total }));
      }
    } catch (err) {
      console.error('Error fetching payments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(1); }, []);

  const applyFilters = () => fetchPayments(1);
  const resetFilters = () => { setFilters({ transactionId: '', status: 'All', customer: '', q: '' }); fetchPayments(1); };

  const exportCSV = () => {
    const rows = payments.map(p => ({ TransactionID: p.paymentId || p._id, Date: p.date, Customer: p.patientName || (p.patient && p.patient.email) || '-', Amount: p.amount || 0, Status: p.paymentStatus || '-', Reconciliation: p.reconciliation || '-' }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_page_${meta.page}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm('Issue refund for payment ' + paymentId + ' ?')) return;
    try {
      setLoading(true);
      const res = await adminService.refundPayment(paymentId);
      if (res && res.success) {
        alert('Refund issued');
        fetchPayments(meta.page);
      }
    } catch (err) {
      console.error(err);
      alert('Refund failed: ' + (err.message || ''));
    } finally { setLoading(false); }
  };

  const mismatches = payments.filter(p => p.reconciliation === 'Mismatched').length;

  return (
    <div className="admin-payments-page">
      <h1 className="page-title">Payments Management</h1>
      <p className="subtitle">Overview and detailed management of all financial transactions within the platform.</p>

      <div className="payments-card">
        <h3>Transaction Controls</h3>
        <div className="controls">
          <input placeholder="e.g., TXN789012" value={filters.transactionId} onChange={e => setFilters({...filters, transactionId: e.target.value})} />
          <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
            <option>All</option>
            <option>Paid</option>
            <option>Refunded</option>
            <option>Pending</option>
          </select>
          <input placeholder="Name or Email" value={filters.customer} onChange={e => setFilters({...filters, customer: e.target.value})} />
          <button className="btn primary" onClick={applyFilters}>Apply Filters</button>
          <button className="btn" onClick={resetFilters}>Reset Filters</button>
        </div>

        <div className="controls-cta">
          <button className="btn danger">{mismatches} Reconciliation Mismatches</button>
          <button className="btn" onClick={exportCSV}>Export Data (CSV)</button>
        </div>
      </div>

      <div className="payments-list">
        <h3>Recent Transactions</h3>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reconciliation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan={7} className="empty">{loading ? 'Loading...' : 'No transactions yet'}</td></tr>}
            {payments.map(p => (
              <tr key={p._id}>
                <td className="tx-id">{p.paymentId || p._id}</td>
                <td>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                <td>{p.patientName || (p.patient && p.patient.email) || '-'}</td>
                <td>₹{p.amount || 0}</td>
                <td><span className={`status-badge ${p.paymentStatus && p.paymentStatus.toLowerCase()}`}>{p.paymentStatus || '-'}</span></td>
                <td><span className={`recon-badge ${p.reconciliation === 'Matched' ? 'matched' : p.reconciliation === 'Mismatched' ? 'mismatched' : 'pending'}`}>{p.reconciliation}</span></td>
                <td>{p.paymentStatus === 'Paid' ? <button className="btn small" onClick={() => handleRefund(p.paymentId)}>Refund</button> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="summary">Showing page {meta.page} of {Math.ceil((meta.total||0)/meta.limit) || 1}</div>
          <div className="controls">
            <button className="btn" disabled={meta.page <= 1} onClick={() => fetchPayments(meta.page - 1)}>Previous</button>
            <button className="btn" disabled={(meta.page * meta.limit) >= meta.total} onClick={() => fetchPayments(meta.page + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
