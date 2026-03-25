import React, { useState } from 'react';

const FREQUENCY_OPTIONS = [
    'Once daily', 'Twice daily', 'Thrice daily', 'Four times daily',
    'As needed', 'Before meals', 'After meals', 'At bedtime'
];

const PrescriptionForm = ({ appointmentId, patientName, onSuccess, onCancel }) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: 'Once daily', duration: '', notes: '' }
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: 'Once daily', duration: '', notes: '' }]);
    };

    const removeMedicine = (index) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        }
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate
        if (!diagnosis.trim()) return setError('Diagnosis is required');
        for (let i = 0; i < medicines.length; i++) {
            if (!medicines[i].name.trim()) return setError(`Medicine name is required for item ${i + 1}`);
            if (!medicines[i].dosage.trim()) return setError(`Dosage is required for item ${i + 1}`);
            if (!medicines[i].duration.trim()) return setError(`Duration is required for item ${i + 1}`);
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/doctor/prescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointmentId,
                    diagnosis,
                    medicines,
                    additionalNotes,
                    followUpDate: followUpDate || null
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                if (onSuccess) onSuccess(data.data);
            } else {
                setError(data.message || 'Failed to create prescription');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={styles.successContainer}>
                <div style={styles.successIcon}>✅</div>
                <h3 style={{ color: '#28a745', margin: '10px 0' }}>Prescription Created!</h3>
                <p style={{ color: '#666' }}>The prescription has been generated and PDF is available for download.</p>
                {onCancel && (
                    <button onClick={onCancel} style={styles.btnSecondary}>Close</button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.header}>
                <h2 style={styles.title}>📝 Write Prescription</h2>
                {patientName && <p style={styles.patientLabel}>Patient: <strong>{patientName}</strong></p>}
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            {/* Diagnosis */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Diagnosis *</label>
                <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    style={styles.textarea}
                    rows={3}
                    placeholder="Enter the diagnosis..."
                    required
                />
            </div>

            {/* Medicines */}
            <div style={styles.fieldGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={styles.label}>Medicines *</label>
                    <button type="button" onClick={addMedicine} style={styles.addBtn}>+ Add Medicine</button>
                </div>

                {medicines.map((med, idx) => (
                    <div key={idx} style={styles.medicineCard}>
                        <div style={styles.medHeader}>
                            <span style={styles.medNum}>#{idx + 1}</span>
                            {medicines.length > 1 && (
                                <button type="button" onClick={() => removeMedicine(idx)} style={styles.removeBtn}>✕</button>
                            )}
                        </div>
                        <div style={styles.medGrid}>
                            <div style={styles.medField}>
                                <label style={styles.smallLabel}>Name *</label>
                                <input type="text" value={med.name} onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                    style={styles.input} placeholder="e.g. Paracetamol" required />
                            </div>
                            <div style={styles.medField}>
                                <label style={styles.smallLabel}>Dosage *</label>
                                <input type="text" value={med.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                    style={styles.input} placeholder="e.g. 500mg" required />
                            </div>
                            <div style={styles.medField}>
                                <label style={styles.smallLabel}>Frequency *</label>
                                <select value={med.frequency} onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                                    style={styles.input}>
                                    {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div style={styles.medField}>
                                <label style={styles.smallLabel}>Duration *</label>
                                <input type="text" value={med.duration} onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                    style={styles.input} placeholder="e.g. 5 days" required />
                            </div>
                        </div>
                        <div style={{ marginTop: 8 }}>
                            <label style={styles.smallLabel}>Notes</label>
                            <input type="text" value={med.notes} onChange={(e) => updateMedicine(idx, 'notes', e.target.value)}
                                style={styles.input} placeholder="e.g. Take with food" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Notes */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Additional Notes</label>
                <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    style={styles.textarea}
                    rows={2}
                    placeholder="Any additional advice or instructions..."
                />
            </div>

            {/* Follow-up Date */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Follow-up Date</label>
                <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                    style={{ ...styles.input, maxWidth: 200 }} />
            </div>

            {/* Actions */}
            <div style={styles.actions}>
                {onCancel && <button type="button" onClick={onCancel} style={styles.btnSecondary}>Cancel</button>}
                <button type="submit" disabled={submitting} style={{ ...styles.btnPrimary, opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? 'Creating...' : '✅ Create Prescription'}
                </button>
            </div>
        </form>
    );
};

const styles = {
    form: { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', maxWidth: 720, margin: '0 auto', fontFamily: "'Segoe UI', sans-serif" },
    header: { marginBottom: 20, paddingBottom: 16, borderBottom: '2px solid #f0f0f0' },
    title: { margin: 0, fontSize: 22, color: '#1a1a2e' },
    patientLabel: { margin: '8px 0 0', fontSize: 14, color: '#666' },
    fieldGroup: { marginBottom: 20 },
    label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 },
    smallLabel: { display: 'block', fontSize: 11, fontWeight: 500, color: '#888', marginBottom: 3 },
    input: { width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' },
    medicineCard: { background: '#f8f9ff', borderRadius: 8, padding: 16, marginTop: 12, border: '1px solid #e8ecf4' },
    medHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    medNum: { fontSize: 12, fontWeight: 600, color: '#0072ff' },
    medGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
    medField: {},
    addBtn: { background: 'none', border: '1px dashed #0072ff', color: '#0072ff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 },
    removeBtn: { background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 16, fontWeight: 700 },
    errorBox: { background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc3545', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 },
    successContainer: { textAlign: 'center', padding: 40 },
    successIcon: { fontSize: 48 },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #f0f0f0' },
    btnPrimary: { background: 'linear-gradient(135deg, #0072ff, #00c6ff)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    btnSecondary: { background: '#f0f0f0', color: '#333', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
};

export default PrescriptionForm;
