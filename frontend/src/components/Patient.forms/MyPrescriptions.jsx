import React, { useState, useEffect } from 'react';
import '../../styles/MyPrescriptions.css';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/patient/prescriptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPrescriptions(data.data);
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="mp-center">
            <p>Loading prescriptions...</p>
        </div>
    );

    return (
        <div className="mp-container">
            <h1 className="mp-page-title">My Prescriptions</h1>
            <p className="mp-subtitle">View all prescriptions from your consultations</p>

            {prescriptions.length === 0 ? (
                <div className="mp-empty-state">
                    <span className="mp-empty-icon">📋</span>
                    <p className="mp-empty-text">No prescriptions yet. Prescriptions will appear here after your doctor creates one.</p>
                </div>
            ) : (
                <div className="mp-grid">
                    {prescriptions.map(p => (
                        <div key={p._id} className="mp-card" onClick={() => setSelectedPrescription(p)}>
                            <div className="mp-card-header">
                                <span className="mp-rx-badge">Rx</span>
                                <span className="mp-card-date">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <h3 className="mp-card-doctor">Dr. {p.doctorId?.name || 'N/A'}</h3>
                            <p className="mp-card-spec">{p.doctorId?.specialization || ''} • {p.doctorId?.hospital || ''}</p>
                            <p className="mp-card-diagnosis" title={p.diagnosis}>{p.diagnosis}</p>
                            <div className="mp-card-footer">
                                <span className="mp-med-count">💊 {p.medicines?.length || 0} medicines</span>
                                {p.pdfDownloadUrl && (
                                    <a href={p.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" className="mp-download-btn"
                                        onClick={(e) => e.stopPropagation()}>
                                        📥 PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedPrescription && (
                <div className="mp-overlay" onClick={() => setSelectedPrescription(null)}>
                    <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mp-modal-header">
                            <h2>📋 Prescription Details</h2>
                            <button onClick={() => setSelectedPrescription(null)} className="mp-close-btn">✕</button>
                        </div>
                        <div className="mp-modal-body">
                            <div className="mp-info-row">
                                <div>
                                    <p className="mp-info-label">Doctor</p>
                                    <p className="mp-info-value">Dr. {selectedPrescription.doctorId?.name}</p>
                                    <p className="mp-info-sub">{selectedPrescription.doctorId?.specialization}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="mp-info-label">Date</p>
                                    <p className="mp-info-value">{new Date(selectedPrescription.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="mp-section">
                                <h4 className="mp-section-title">Diagnosis</h4>
                                <p className="mp-section-text">{selectedPrescription.diagnosis}</p>
                            </div>

                            <div className="mp-section">
                                <h4 className="mp-section-title">Medicines</h4>
                                <div className="mp-table-wrapper">
                                    <table className="mp-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                            <th>Medicine</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPrescription.medicines.map((m, i) => (
                                            <tr key={i} className={i % 2 === 1 ? 'mp-table-alt' : ''}>
                                                <td>{i + 1}</td>
                                                <td style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                                                <td>{m.dosage}</td>
                                                <td>{m.frequency}</td>
                                                <td>{m.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                            </div>

                            {selectedPrescription.additionalNotes && (
                                <div className="mp-section">
                                    <h4 className="mp-section-title">Additional Notes</h4>
                                    <p className="mp-section-text">{selectedPrescription.additionalNotes}</p>
                                </div>
                            )}

                            {selectedPrescription.followUpDate && (
                                <div className="mp-follow-up">
                                    <p>📅 <strong>Follow-up:</strong> {selectedPrescription.followUpDate}</p>
                                </div>
                            )}

                            {selectedPrescription.pdfDownloadUrl && (
                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <a href={selectedPrescription.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" className="mp-download-large">
                                        📥 Download PDF
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPrescriptions;
