import React, { useState, useEffect } from 'react';

const DAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/doctor/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAnalytics(data.data);
            } else {
                setError(data.message || 'Failed to fetch analytics');
            }
        } catch (err) {
            setError('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#666', marginTop: 16 }}>Loading analytics...</p>
        </div>
    );

    if (error) return (
        <div style={styles.errorContainer}>
            <p style={{ color: '#dc3545' }}>❌ {error}</p>
        </div>
    );

    if (!analytics) return null;

    const maxDayCount = Math.max(...Object.values(analytics.dayOfWeekCounts), 1);

    return (
        <div style={styles.container}>
            <h1 style={styles.pageTitle}>📊 Analytics Dashboard</h1>
            <p style={styles.subtitle}>Track your practice performance and patient insights</p>

            {/* Top Stats Cards */}
            <div style={styles.statsGrid}>
                <StatCard icon="📋" label="Total Appointments" value={analytics.totalAppointments} color="#0072ff" />
                <StatCard icon="👥" label="Total Patients" value={analytics.totalPatients} color="#00c6ff" />
                <StatCard icon="💰" label="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString()}`} color="#28a745" />
                <StatCard icon="⭐" label="Avg Rating" value={analytics.averageRating} subtext={`${analytics.totalReviews} reviews`} color="#ffc107" />
                <StatCard icon="📝" label="Prescriptions" value={analytics.prescriptionCount} color="#6f42c1" />
                <StatCard icon="🩺" label="Second Opinions" value={analytics.totalSecondOpinions} subtext={`${analytics.acceptedSecondOpinions} accepted`} color="#e83e8c" />
            </div>

            {/* Appointment Status Breakdown */}
            <div style={styles.chartRow}>
                <div style={{ ...styles.card, flex: 1 }}>
                    <h3 style={styles.cardTitle}>Appointment Status</h3>
                    <div style={styles.statusGrid}>
                        {Object.entries(analytics.statusCounts).map(([status, count]) => (
                            <div key={status} style={styles.statusItem}>
                                <div style={{ ...styles.statusDot, backgroundColor: getStatusColor(status) }}></div>
                                <span style={styles.statusLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                <span style={styles.statusCount}>{count}</span>
                            </div>
                        ))}
                    </div>
                    <div style={styles.rateRow}>
                        <div style={styles.rateBox}>
                            <span style={{ fontSize: 24, fontWeight: 700, color: '#28a745' }}>{analytics.completionRate}%</span>
                            <span style={{ fontSize: 12, color: '#666' }}>Completion</span>
                        </div>
                        <div style={styles.rateBox}>
                            <span style={{ fontSize: 24, fontWeight: 700, color: '#dc3545' }}>{analytics.cancellationRate}%</span>
                            <span style={{ fontSize: 12, color: '#666' }}>Cancellation</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Trend (Bar Chart) */}
                <div style={{ ...styles.card, flex: 1.5 }}>
                    <h3 style={styles.cardTitle}>Monthly Appointments</h3>
                    <div style={styles.barChart}>
                        {analytics.monthlyData.map((m) => {
                            const maxVal = Math.max(...analytics.monthlyData.map(d => d.appointments), 1);
                            const height = (m.appointments / maxVal) * 120;
                            return (
                                <div key={m.month} style={styles.barColumn}>
                                    <span style={styles.barValue}>{m.appointments}</span>
                                    <div style={{ ...styles.bar, height: Math.max(height, 4), background: 'linear-gradient(180deg, #0072ff, #00c6ff)' }}></div>
                                    <span style={styles.barLabel}>{m.month.split('-')[1]}/{m.month.split('-')[0].slice(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Rating Distribution & Busiest Days */}
            <div style={styles.chartRow}>
                <div style={{ ...styles.card, flex: 1 }}>
                    <h3 style={styles.cardTitle}>⭐ Rating Distribution</h3>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = analytics.ratingDistribution[star] || 0;
                        const maxReview = Math.max(...Object.values(analytics.ratingDistribution), 1);
                        const width = (count / maxReview) * 100;
                        return (
                            <div key={star} style={styles.ratingRow}>
                                <span style={{ width: 30, fontSize: 13, fontWeight: 600 }}>{star}★</span>
                                <div style={styles.ratingBarBg}>
                                    <div style={{ ...styles.ratingBarFill, width: `${width}%`, backgroundColor: star >= 4 ? '#28a745' : star >= 3 ? '#ffc107' : '#dc3545' }}></div>
                                </div>
                                <span style={{ width: 25, fontSize: 12, color: '#666', textAlign: 'right' }}>{count}</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ ...styles.card, flex: 1 }}>
                    <h3 style={styles.cardTitle}>📅 Busiest Days</h3>
                    {Object.entries(analytics.dayOfWeekCounts).map(([day, count]) => {
                        const width = (count / maxDayCount) * 100;
                        return (
                            <div key={day} style={styles.ratingRow}>
                                <span style={{ width: 35, fontSize: 13, fontWeight: 600 }}>{day}</span>
                                <div style={styles.ratingBarBg}>
                                    <div style={{ ...styles.ratingBarFill, width: `${width}%`, backgroundColor: '#0072ff' }}></div>
                                </div>
                                <span style={{ width: 25, fontSize: 12, color: '#666', textAlign: 'right' }}>{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, subtext, color }) => (
    <div style={{ ...styles.statCard, borderTop: `3px solid ${color}` }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>{value}</span>
        <span style={{ fontSize: 12, color: '#666' }}>{label}</span>
        {subtext && <span style={{ fontSize: 11, color: '#999' }}>{subtext}</span>}
    </div>
);

function getStatusColor(status) {
    const colors = { pending: '#ffc107', accepted: '#28a745', rejected: '#dc3545', cancelled: '#6c757d', completed: '#0072ff' };
    return colors[status] || '#999';
}

const styles = {
    container: { maxWidth: 1100, margin: '0 auto', padding: '30px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    pageTitle: { fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 5px' },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 25 },
    loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 },
    errorContainer: { textAlign: 'center', padding: 40 },
    spinner: { width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #0072ff', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 },
    statCard: { background: '#fff', borderRadius: 12, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
    chartRow: { display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' },
    card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 280 },
    cardTitle: { fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginTop: 0, marginBottom: 16 },
    statusGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
    statusItem: { display: 'flex', alignItems: 'center', gap: 10 },
    statusDot: { width: 10, height: 10, borderRadius: '50%' },
    statusLabel: { flex: 1, fontSize: 13, color: '#444' },
    statusCount: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
    rateRow: { display: 'flex', gap: 16, marginTop: 20, paddingTop: 16, borderTop: '1px solid #eee' },
    rateBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
    barChart: { display: 'flex', alignItems: 'flex-end', gap: 16, height: 170, paddingTop: 20 },
    barColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 },
    bar: { width: '100%', maxWidth: 40, borderRadius: '6px 6px 0 0', minHeight: 4, transition: 'height 0.5s ease' },
    barValue: { fontSize: 11, fontWeight: 600, color: '#333' },
    barLabel: { fontSize: 10, color: '#888' },
    ratingRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
    ratingBarBg: { flex: 1, height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
    ratingBarFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
};

export default DAnalytics;
