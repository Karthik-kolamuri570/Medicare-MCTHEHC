import React, { useState, useEffect } from 'react';

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
        <div style={styles.center}>
            <p style={{ color: '#666' }}>Loading prescriptions...</p>
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>💊 My Prescriptions</h1>
            <p style={styles.subtitle}>View all prescriptions from your consultations</p>

            {prescriptions.length === 0 ? (
                <div style={styles.emptyState}>
                    <span style={{ fontSize: 48 }}>📋</span>
                    <p style={{ color: '#888', fontSize: 14, marginTop: 12 }}>No prescriptions yet. Prescriptions will appear here after your doctor creates one.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {prescriptions.map(p => (
                        <div key={p._id} style={styles.card} onClick={() => setSelectedPrescription(p)}>
                            <div style={styles.cardHeader}>
                                <span style={styles.rxBadge}>Rx</span>
                                <span style={styles.cardDate}>{new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <h3 style={styles.cardDoctor}>Dr. {p.doctorId?.name || 'N/A'}</h3>
                            <p style={styles.cardSpec}>{p.doctorId?.specialization || ''} • {p.doctorId?.hospital || ''}</p>
                            <p style={styles.cardDiagnosis} title={p.diagnosis}>{p.diagnosis.length > 80 ? p.diagnosis.slice(0, 80) + '...' : p.diagnosis}</p>
                            <div style={styles.cardFooter}>
                                <span style={styles.medCount}>💊 {p.medicines?.length || 0} medicines</span>
                                {p.pdfDownloadUrl && (
                                    <a href={p.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadBtn}
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
                <div style={styles.overlay} onClick={() => setSelectedPrescription(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h2 style={{ margin: 0, fontSize: 20 }}>📋 Prescription Details</h2>
                            <button onClick={() => setSelectedPrescription(null)} style={styles.closeBtn}>✕</button>
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.infoRow}>
                                <div>
                                    <p style={styles.infoLabel}>Doctor</p>
                                    <p style={styles.infoValue}>Dr. {selectedPrescription.doctorId?.name}</p>
                                    <p style={styles.infoSub}>{selectedPrescription.doctorId?.specialization}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={styles.infoLabel}>Date</p>
                                    <p style={styles.infoValue}>{new Date(selectedPrescription.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Diagnosis</h4>
                                <p style={styles.sectionText}>{selectedPrescription.diagnosis}</p>
                            </div>

                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>Medicines</h4>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.tableHeaderRow}>
                                            <th style={styles.th}>#</th>
                                            <th style={styles.th}>Medicine</th>
                                            <th style={styles.th}>Dosage</th>
                                            <th style={styles.th}>Frequency</th>
                                            <th style={styles.th}>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPrescription.medicines.map((m, i) => (
                                            <tr key={i} style={i % 2 === 1 ? styles.tableRowAlt : {}}>
                                                <td style={styles.td}>{i + 1}</td>
                                                <td style={{ ...styles.td, fontWeight: 600 }}>{m.name}</td>
                                                <td style={styles.td}>{m.dosage}</td>
                                                <td style={styles.td}>{m.frequency}</td>
                                                <td style={styles.td}>{m.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selectedPrescription.additionalNotes && (
                                <div style={styles.section}>
                                    <h4 style={styles.sectionTitle}>Additional Notes</h4>
                                    <p style={styles.sectionText}>{selectedPrescription.additionalNotes}</p>
                                </div>
                            )}

                            {selectedPrescription.followUpDate && (
                                <div style={{ ...styles.section, background: '#fff3cd', padding: 12, borderRadius: 6 }}>
                                    <p style={{ margin: 0, fontSize: 13 }}>📅 <strong>Follow-up:</strong> {selectedPrescription.followUpDate}</p>
                                </div>
                            )}

                            {selectedPrescription.pdfDownloadUrl && (
                                <div style={{ textAlign: 'center', marginTop: 20 }}>
                                    <a href={selectedPrescription.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" style={styles.downloadBtnLarge}>
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

const styles = {
    container: { maxWidth: 1000, margin: '0 auto', padding: '30px 20px', fontFamily: "'Segoe UI', sans-serif" },
    pageTitle: { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 5px' },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
    center: { textAlign: 'center', padding: 60 },
    emptyState: { textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
    card: { background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderLeft: '4px solid #0072ff' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    rxBadge: { background: '#0072ff', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 },
    cardDate: { fontSize: 12, color: '#888' },
    cardDoctor: { fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' },
    cardSpec: { fontSize: 12, color: '#888', margin: '0 0 10px' },
    cardDiagnosis: { fontSize: 13, color: '#444', lineHeight: 1.4, margin: '0 0 12px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f0f0f0' },
    medCount: { fontSize: 12, color: '#666' },
    downloadBtn: { background: '#28a745', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 11, textDecoration: 'none', fontWeight: 600 },
    downloadBtnLarge: { background: 'linear-gradient(135deg, #28a745, #20c997)', color: '#fff', padding: '10px 28px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 600, display: 'inline-block' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { background: '#fff', borderRadius: 12, width: '90%', maxWidth: 650, maxHeight: '85vh', overflow: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eee' },
    closeBtn: { background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' },
    modalBody: { padding: 24 },
    infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' },
    infoLabel: { fontSize: 11, color: '#888', margin: '0 0 4px', textTransform: 'uppercase' },
    infoValue: { fontSize: 15, fontWeight: 600, color: '#1a1a2e', margin: 0 },
    infoSub: { fontSize: 12, color: '#888', margin: '2px 0 0' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 600, color: '#0072ff', margin: '0 0 8px' },
    sectionText: { fontSize: 13, color: '#444', lineHeight: 1.5, margin: 0 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
    tableHeaderRow: { background: '#f0f4ff' },
    th: { padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#333', borderBottom: '1px solid #e0e0e0' },
    td: { padding: '8px 10px', borderBottom: '1px solid #f0f0f0', color: '#444' },
    tableRowAlt: { background: '#fafbff' },
};

export default MyPrescriptions;
