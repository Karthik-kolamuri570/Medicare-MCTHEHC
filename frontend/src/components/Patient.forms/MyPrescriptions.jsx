import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Download, FileText, Clipboard, Pill, 
  Clock, ArrowRight, ShieldCheck, Heart, User, Check, AlertCircle, RefreshCw, X, Stethoscope
} from 'lucide-react';
import '../../styles/MyPrescriptions.css';

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(false);
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

    const isMedicineActive = (createdAtStr, durationStr) => {
        if (!createdAtStr) return true;
        try {
            const createdDate = new Date(createdAtStr);
            createdDate.setHours(0, 0, 0, 0);

            let days = 7; // default
            if (durationStr) {
                const match = durationStr.toLowerCase().match(/^(\d+)\s*(day|week|month|year)s?$/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    const unit = match[2];
                    if (unit === 'day') days = num;
                    else if (unit === 'week') days = num * 7;
                    else if (unit === 'month') days = num * 30;
                    else if (unit === 'year') days = num * 365;
                } else {
                    const numMatch = durationStr.match(/\d+/);
                    if (numMatch) {
                        days = parseInt(numMatch[0], 10);
                    }
                }
            }

            const endDate = new Date(createdDate);
            endDate.setDate(createdDate.getDate() + days);
            endDate.setHours(23, 59, 59, 999);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return today <= endDate;
        } catch (e) {
            return true;
        }
    };

    const isPrescriptionActive = (p) => {
        if (!p.medicines || p.medicines.length === 0) return false;
        return p.medicines.some(m => isMedicineActive(p.createdAt, m.duration));
    };

    const getInitials = (name) => {
        if (!name) return 'Dr';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Stats calculations
    let activeMedsCount = 0;
    prescriptions.forEach(p => {
        p.medicines?.forEach(m => {
            if (isMedicineActive(p.createdAt, m.duration)) activeMedsCount++;
        });
    });

    // Filter prescriptions
    const filteredPrescriptions = prescriptions.filter(p => {
        const docName = p.doctorId?.name || '';
        const diag = p.diagnosis || '';
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = 
            docName.toLowerCase().includes(search) ||
            diag.toLowerCase().includes(search) ||
            (p.medicines || []).some(m => (m.name || '').toLowerCase().includes(search));
            
        const active = isPrescriptionActive(p);
        
        if (activeTab === 'active') return matchesSearch && active;
        if (activeTab === 'completed') return matchesSearch && !active;
        return matchesSearch;
    });

    if (loading) return (
        <div className="mp-center">
            <RefreshCw className="mp-spinner" size={32} />
            <p>Loading prescriptions...</p>
        </div>
    );

    return (
        <div className="mp-container-wrapper">
            {/* Background Decorative Blur Blobs */}
            <div className="mp-blur-blob blue"></div>
            <div className="mp-blur-blob purple"></div>
            <div className="mp-blur-blob orange"></div>

            <div className="mp-container">
                {/* Header section */}
                <div className="mp-header-section">
                    <div>
                        <div className="mp-title-badge">
                            <Stethoscope size={12} />
                            <span>PATIENT RECORDS</span>
                        </div>
                        <h1 className="mp-page-title">My Prescriptions</h1>
                        <p className="mp-subtitle">Access and manage all prescriptions issued by your doctors</p>
                    </div>
                </div>

                {/* Dashboard Stats Overview */}
                {prescriptions.length > 0 && (
                    <div className="mp-stats-bar">
                        <div className="mp-stat-card">
                            <div className="mp-stat-icon-wrap blue">
                                <Clipboard className="mp-stat-icon" size={18} />
                            </div>
                            <div className="mp-stat-info">
                                <span className="mp-stat-label">Total Prescriptions</span>
                                <span className="mp-stat-value">{prescriptions.length}</span>
                            </div>
                        </div>
                        <div className="mp-stat-card">
                            <div className="mp-stat-icon-wrap emerald">
                                <Pill className="mp-stat-icon" size={18} />
                            </div>
                            <div className="mp-stat-info">
                                <span className="mp-stat-label">Active Medications</span>
                                <span className="mp-stat-value">{activeMedsCount}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions & Filters */}
                <div className="mp-actions-bar">
                    <div className="mp-search-wrapper">
                        <Search className="mp-search-icon" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by doctor, diagnosis, or medicine..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="mp-search-input"
                        />
                    </div>
                    <div className="mp-filter-group">
                        <button 
                            className={`mp-filter-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`mp-filter-btn ${activeTab === 'active' ? 'active' : ''}`}
                            onClick={() => setActiveTab('active')}
                        >
                            Active
                        </button>
                        <button 
                            className={`mp-filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Prescriptions List */}
                {filteredPrescriptions.length === 0 ? (
                    <div className="mp-empty-state">
                        <div className="mp-empty-icon-container">
                            <FileText size={36} className="mp-empty-icon" />
                        </div>
                        <h3>No prescriptions found</h3>
                        <p>Try clearing filters or search terms.</p>
                    </div>
                ) : (
                    <div className="mp-grid">
                        {filteredPrescriptions.map(p => {
                            const active = isPrescriptionActive(p);
                            return (
                                <div key={p._id} className="mp-card" onClick={() => setSelectedPrescription(p)}>
                                    <div className="mp-card-header">
                                        <div className={`mp-status-indicator ${active ? 'active' : 'completed'}`}>
                                            <span className="mp-status-dot"></span>
                                            <span className="mp-status-text">{active ? 'Active' : 'Completed'}</span>
                                        </div>
                                        <span className="mp-card-date">
                                            <Calendar size={12} />
                                            {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    
                                    <div className="mp-card-doctor-section">
                                        <div className="mp-doctor-avatar">
                                            {p.doctorId?.profileImage ? (
                                                <img src={p.doctorId.profileImage} alt={p.doctorId.name} className="mp-doctor-img" />
                                            ) : (
                                                <div className="mp-doctor-initials">{getInitials(p.doctorId?.name)}</div>
                                            )}
                                        </div>
                                        <div className="mp-doctor-info">
                                            <h3 className="mp-card-doctor">Dr. {p.doctorId?.name || 'N/A'}</h3>
                                            <p className="mp-card-spec">{p.doctorId?.specialization || 'Medical Specialist'}</p>
                                        </div>
                                    </div>

                                    <div className="mp-card-body">
                                        {p.diagnosis && (
                                            <div className="mp-diagnosis-container">
                                                <span className="mp-label-tag">Diagnosis</span>
                                                <p className="mp-card-diagnosis" title={p.diagnosis}>{p.diagnosis}</p>
                                            </div>
                                        )}
                                        
                                        <div className="mp-medicines-preview">
                                            <span className="mp-label-tag">Medications</span>
                                            <div className="mp-medicine-chips">
                                                {p.medicines?.slice(0, 3).map((m, idx) => (
                                                    <span key={idx} className="mp-med-chip">
                                                        <span className="mp-chip-dot"></span>
                                                        {m.name}
                                                    </span>
                                                ))}
                                                {p.medicines?.length > 3 && (
                                                    <span className="mp-med-chip more">+{p.medicines.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mp-card-footer">
                                        <button className="mp-view-details-btn">
                                            <span>View Details</span>
                                            <ArrowRight size={12} />
                                        </button>
                                        {p.pdfDownloadUrl && (
                                            <a 
                                                href={p.pdfDownloadUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="mp-download-icon-btn"
                                                title="Download PDF"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Download size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Prescription Detail Modal (Medical Letterhead Style) */}
                {selectedPrescription && (
                    <div className="mp-overlay" onClick={() => setSelectedPrescription(null)}>
                        <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
                            
                            <div className="mp-modal-header">
                                <div className="mp-modal-title-area">
                                    <ShieldCheck className="mp-verified-clinic-icon" size={20} />
                                    <div>
                                        <h2>Verified Prescription</h2>
                                        <p className="mp-rx-number">Rx ID: #{selectedPrescription._id.toString().slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPrescription(null)} className="mp-close-btn">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="mp-modal-body">
                                {/* Letterhead Paper container */}
                                <div className="mp-prescription-paper">
                                    
                                    {/* 1. Doctor / Clinic Details */}
                                    <div className="mp-paper-header">
                                        <div className="mp-paper-doctor">
                                            <h3>Dr. {selectedPrescription.doctorId?.name}</h3>
                                            <p className="mp-paper-doctor-spec">{selectedPrescription.doctorId?.specialization}</p>
                                            <p className="mp-paper-doctor-hosp">{selectedPrescription.doctorId?.hospital || 'Medicare Medical Center'}</p>
                                        </div>
                                        <div className="mp-paper-clinic-logo">
                                            <Heart className="mp-logo-heart" fill="rgba(37, 99, 235, 0.1)" size={28} />
                                            <span className="mp-logo-name">medicare</span>
                                            <span className="mp-logo-sub">HEALTHCARE</span>
                                        </div>
                                    </div>

                                    <div className="mp-paper-divider"></div>

                                    {/* 2. Patient / Date details */}
                                    <div className="mp-paper-patient-row">
                                        <div className="mp-patient-col">
                                            <span className="mp-paper-label">Issued To</span>
                                            <span className="mp-paper-value patient-name">Patient Profile</span>
                                        </div>
                                        <div className="mp-patient-col right">
                                            <span className="mp-paper-label">Date of Issue</span>
                                            <span className="mp-paper-value">
                                                {new Date(selectedPrescription.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3. Diagnosis Section */}
                                    <div className="mp-paper-section">
                                        <h4 className="mp-paper-section-title">Diagnosis</h4>
                                        <div className="mp-paper-diagnosis-box">
                                            {selectedPrescription.diagnosis}
                                        </div>
                                    </div>

                                    {/* 4. Rx Sign and Medicines */}
                                    <div className="mp-paper-section">
                                        <div className="mp-rx-sign-container">
                                            <span className="mp-rx-symbol">Rx</span>
                                            <span className="mp-rx-symbol-sub">Prescribed Medications</span>
                                        </div>
                                        
                                        <div className="mp-paper-table-wrapper">
                                            <table className="mp-paper-table">
                                                <thead>
                                                    <tr>
                                                        <th className="th-num">#</th>
                                                        <th className="th-med">Medication Name</th>
                                                        <th>Dosage</th>
                                                        <th>Frequency</th>
                                                        <th>Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPrescription.medicines.map((m, i) => (
                                                        <tr key={i} className="mp-paper-tr">
                                                            <td className="td-num">{i + 1}</td>
                                                            <td className="td-med-name">
                                                                <div className="mp-med-title">{m.name}</div>
                                                                {m.notes && <div className="mp-med-notes">{m.notes}</div>}
                                                            </td>
                                                            <td>{m.dosage}</td>
                                                            <td>
                                                                <span className="mp-frequency-badge">{m.frequency}</span>
                                                            </td>
                                                            <td>
                                                                <div className="mp-duration-wrap">
                                                                    <Clock size={12} />
                                                                    <span>{m.duration}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* 5. Additional Notes & Follow-up */}
                                    {(selectedPrescription.additionalNotes || selectedPrescription.followUpDate) && (
                                        <div className="mp-paper-double-col">
                                            {selectedPrescription.additionalNotes && (
                                                <div className="mp-paper-section col-6">
                                                    <h4 className="mp-paper-section-title">Instructions</h4>
                                                    <p className="mp-paper-notes-text">{selectedPrescription.additionalNotes}</p>
                                                </div>
                                            )}
                                            {selectedPrescription.followUpDate && (
                                                <div className="mp-paper-section col-6">
                                                    <h4 className="mp-paper-section-title">Follow-up Advice</h4>
                                                    <div className="mp-paper-followup-box">
                                                        <Calendar size={14} />
                                                        <div>
                                                            <span className="mp-follow-label">Scheduled Date</span>
                                                            <span className="mp-follow-val">{selectedPrescription.followUpDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 6. Doctor Signature Stamp */}
                                    <div className="mp-paper-footer">
                                        <div className="mp-signature-stamp-block">
                                            <div className="mp-clinical-stamp">
                                                <ShieldCheck size={16} />
                                                <span>DIGITAL RX VERIFIED</span>
                                                <small>MEDICARE SECURE NETWORK</small>
                                            </div>
                                            <div className="mp-signature-line">
                                                <div className="mp-signature-sim">Dr. {selectedPrescription.doctorId?.name}</div>
                                                <span className="mp-signature-label">Authorized Signature</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Download Action Footer */}
                                {selectedPrescription.pdfDownloadUrl && (
                                    <div className="mp-modal-actions">
                                        <a href={selectedPrescription.pdfDownloadUrl} target="_blank" rel="noopener noreferrer" className="mp-download-large-btn">
                                            <Download size={16} />
                                            <span>Download Official PDF Prescription</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPrescriptions;
