import React, { useState, useEffect } from 'react';
import {
    Person as PersonIcon,
    Event as EventIcon,
    LocationOn as LocationIcon,
    DeleteOutline as DeleteIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import adminService from '../services/adminService';
import '../styles/Dashboard.css'; // Reusing the premium styles we added

const BloodCamps = () => {
    const [bloodCamps, setBloodCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        try {
            setLoading(true);
            const response = await adminService.getBloodCamps();
            setBloodCamps(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching blood camps:', err);
            setError('Failed to fetch blood camps');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCamp = async (id) => {
        if (window.confirm('Are you sure you want to delete this blood camp?')) {
            try {
                await adminService.deleteBloodCamp(id);
                setBloodCamps(bloodCamps.filter(camp => camp._id !== id));
            } catch (err) {
                console.error('Failed to delete camp:', err);
                alert('Failed to delete camp');
            }
        }
    };

    const getCampStatus = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const campDate = new Date(dateString);
        return campDate >= today ? 'upcoming' : 'completed';
    };

    if (loading) return <div className="dashboard-container"><div className="loading">Loading blood camps...</div></div>;
    if (error) return <div className="dashboard-container"><div className="error">{error} <button onClick={fetchCamps}>Retry</button></div></div>;

    return (
        <div className="dashboard-container">
            <div className="section-header">
                <div>
                    <h1>Blood Camps Management</h1>
                    <p style={{ color: '#666', marginTop: '5px' }}>View and manage all blood donation camps scheduled by doctors.</p>
                </div>
                <button className="refresh-btn" onClick={fetchCamps}>
                    <RefreshIcon /> Refresh
                </button>
            </div>

            <div className="blood-camps-section">
                <div className="camp-list">
                    {bloodCamps.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">⛺</div>
                            <p>No blood camps found.</p>
                        </div>
                    ) : (
                        bloodCamps.map(camp => (
                            <div className="camp-card" key={camp._id}>
                                <div className="camp-info">
                                    <h3 className="camp-name">{camp.name}</h3>
                                    <div className="camp-meta">
                                        <span className="meta-item">
                                            <PersonIcon fontSize="small" /> {camp.organizer?.name || 'Unknown'}
                                        </span>
                                        <span className="meta-item">
                                            <EventIcon fontSize="small" /> {new Date(camp.start_date).toLocaleDateString()}
                                        </span>
                                        <span className="meta-item location">
                                            <LocationIcon fontSize="small" /> {camp.location?.city}, {camp.location?.state}
                                        </span>
                                    </div>
                                </div>

                                <div className="camp-actions">
                                    <span className={`status-pill ${getCampStatus(camp.start_date)}`}>
                                        {getCampStatus(camp.start_date)}
                                    </span>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={() => handleDeleteCamp(camp._id)}
                                        title="Delete Camp"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodCamps;
