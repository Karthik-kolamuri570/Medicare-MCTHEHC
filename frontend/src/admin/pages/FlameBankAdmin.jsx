
import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './FlameBankAdmin.css';
import {
    LocalHospital as HospitalIcon,
    WaterDrop as BloodIcon,
    Warning as AlertIcon,
    LocationOn as LocationIcon,
    Domain as BuildingIcon
} from '@mui/icons-material';

const FlameBankAdmin = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUnits: 0, activeBanks: 0, criticalShortages: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await adminService.getBloodBanks();
            if (response && response.success) {
                setBanks(response.data);
                calculateStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch blood banks:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (banksData) => {
        let units = 0;
        let critical = 0;

        banksData.forEach(bank => {
            // Sum all blood groups
            if (bank.blood_groups) {
                Object.values(bank.blood_groups).forEach(count => {
                    units += (count || 0);
                });

                // Check for critical levels (< 10 units is arbitrary critical threshold per type)
                const hasCritical = Object.values(bank.blood_groups).some(c => c < 10);
                if (hasCritical) critical++;
            }
        });

        setStats({
            totalUnits: units,
            activeBanks: banksData.length,
            criticalShortages: critical
        });
    };

    const getStatusBadge = (count) => {
        if (count < 10) return <span className="blood-badge critical">Critical</span>;
        if (count < 30) return <span className="blood-badge low">Low</span>;
        return <span className="blood-badge stable">Stable</span>;
    };

    const getCapacityColor = (percent) => {
        if (percent > 90) return '#ef4444'; // Full (Red warning?) or maybe just distinct
        if (percent > 50) return '#22c55e'; // Good
        return '#f59e0b'; // Low usage
    };

    if (loading) {
        return <div className="loading-container">Loading Flame Bank Data...</div>;
    }

    return (
        <div className="flame-bank-container">
            <div className="fb-header">
                <div className="fb-title">Flame Bank Overview</div>
                <div className="fb-subtitle">Real-time inventory monitoring across all facilities</div>
            </div>

            {/* Global Stats */}
            <div className="fb-stats-grid">
                <div className="fb-stat-card">
                    <div className="fb-icon-box red"><BloodIcon /></div>
                    <div className="fb-stat-info">
                        <h3>Total Blood Units</h3>
                        <div className="value">{stats.totalUnits.toLocaleString()}</div>
                    </div>
                </div>
                <div className="fb-stat-card">
                    <div className="fb-icon-box blue"><BuildingIcon /></div>
                    <div className="fb-stat-info">
                        <h3>Active Banks</h3>
                        <div className="value">{stats.activeBanks}</div>
                    </div>
                </div>
                <div className="fb-stat-card">
                    <div className="fb-icon-box orange"><AlertIcon /></div>
                    <div className="fb-stat-info">
                        <h3>Critical Shortages</h3>
                        <div className="value">{stats.criticalShortages} banks</div>
                    </div>
                </div>
            </div>

            {/* Bank List */}
            <div className="fb-grid-container">
                <div className="fb-section-title">All Blood Banks Status</div>

                {banks.map(bank => {
                    const totalStock = bank.blood_groups ? Object.values(bank.blood_groups).reduce((a, b) => a + b, 0) : 0;
                    const capacityPercent = Math.min(100, Math.round((totalStock / (bank.capacity || 1000)) * 100));

                    return (
                        <div key={bank._id} className="fb-bank-card">
                            {/* Bank Header */}
                            <div className="fb-bank-header">
                                <div className="fb-bank-info">
                                    <div className="fb-bank-icon"><HospitalIcon /></div>
                                    <div className="fb-bank-details">
                                        <h2>{bank.name}</h2>
                                        <div className="fb-bank-location">
                                            <LocationIcon style={{ fontSize: 16 }} /> {bank.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="fb-capacity-wrapper">
                                    <div className="fb-capacity-label">{capacityPercent}% Capacity ({totalStock} / {bank.capacity || 1000})</div>
                                    <div className="fb-progress-bar">
                                        <div
                                            className="fb-progress-fill"
                                            style={{
                                                width: `${capacityPercent}%`,
                                                background: getCapacityColor(capacityPercent)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Inventory Grid */}
                            <div className="fb-inventory-title">Available Units by Type</div>
                            <div className="fb-inventory-grid">
                                {bank.blood_groups && Object.entries(bank.blood_groups).map(([type, count]) => {
                                    // Convert key like 'A_pos' to 'A+'
                                    const label = type.replace('_pos', '+').replace('_neg', '-').replace('_', '');
                                    return (
                                        <div key={type} className="blood-unit-card">
                                            <div className="blood-type">{label}</div>
                                            <div className="blood-count">{count} Units</div>
                                            {getStatusBadge(count)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlameBankAdmin;
