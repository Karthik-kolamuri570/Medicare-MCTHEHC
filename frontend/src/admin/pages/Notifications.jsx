import { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import "../../styles/Notifications.css";
import { FaBell, FaTrash, FaEye, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaClock, FaUserMd, FaExclamationTriangle, FaInfoCircle, FaRedo, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getDateGroup = (dateStr) => {
    if (!dateStr) return 'Older';
    const now = new Date();
    const date = new Date(dateStr);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today - 86400000);
    if (date >= today) return 'Today';
    if (date >= yesterday) return 'Yesterday';
    if (date >= new Date(today - 6 * 86400000)) return 'This Week';
    return 'Older';
};

const NOTIF_CONFIG = {
    'verification': { icon: FaShieldAlt, color: '#8b5cf6', label: 'Admin Action' },
    'new-doctor': { icon: FaUserMd, color: '#3b82f6', label: 'Doctor App' },
    'appointment-cancelled': { icon: FaTimesCircle, color: '#ef4444', label: 'Cancelled' },
    'payment-refund': { icon: FaExclamationTriangle, color: '#f59e0b', label: 'Refund' },
    'default': { icon: FaBell, color: '#64748b', label: 'Notification' },
};

function ANotifications() {
    const [unseenNotifications, setUnseenNotifications] = useState([]);
    const [seenNotifications, setSeenNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('unseen');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/notifications');
            if (response.data?.success) {
                const data = response.data.data;
                setUnseenNotifications(data.unseenNotifications || []);
                setSeenNotifications(data.seenNotifications || []);
            }
        } catch (err) {
            console.error("Error fetching admin notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    // Auto-refresh every 30s
    useEffect(() => {
        const interval = setInterval(() => {
            if (!actionLoading) fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [actionLoading]);

    const handleMarkAllAsSeen = async () => {
        if (unseenNotifications.length === 0) return;
        setActionLoading(true);
        try {
            const res = await api.post('/api/admin/notifications/mark-seen');
            if (res.data?.success) {
                toast.success('All notifications marked as read');
                fetchNotifications();
            }
        } catch { toast.error('Failed to mark notifications'); }
        finally { setActionLoading(false); }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Clear ALL notifications? This cannot be undone.')) return;
        setActionLoading(true);
        try {
            const res = await api.delete('/api/admin/notifications/clear');
            if (res.data?.success) {
                toast.success('All notifications cleared');
                fetchNotifications();
            }
        } catch { toast.error('Failed to clear notifications'); }
        finally { setActionLoading(false); }
    };

    const handleDeleteOne = async (index, type) => {
        setActionLoading(true);
        try {
            const res = await api.post('/api/admin/notifications/delete', { index, type });
            if (res.data?.success) {
                toast.success('Notification removed');
                fetchNotifications();
            }
        } catch { toast.error('Failed to delete notification'); }
        finally { setActionLoading(false); }
    };

    const currentList = activeTab === 'unseen' ? unseenNotifications : seenNotifications;
    const totalCount = unseenNotifications.length + seenNotifications.length;

    // Group by date
    const grouped = useMemo(() => {
        const groups = {};
        currentList.forEach((n, i) => {
            const key = getDateGroup(n.createdAt);
            if (!groups[key]) groups[key] = [];
            groups[key].push({ ...n, _idx: i });
        });
        const order = ['Today', 'Yesterday', 'This Week', 'Older'];
        return order.filter(k => groups[k]).map(k => ({ label: k, items: groups[k] }));
    }, [currentList]);

    const getConfig = (type) => NOTIF_CONFIG[type] || NOTIF_CONFIG['default'];

    return (
        <div className="ntf-page">
            <div className="ntf-container">
                <div className="ntf-header">
                    <div className="ntf-header-left">
                        <div className="ntf-bell-wrapper">
                            <FaBell className="ntf-bell-icon" />
                            {unseenNotifications.length > 0 && (
                                <span className="ntf-badge">{unseenNotifications.length}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="ntf-title">Admin Alerts</h1>
                            <p className="ntf-subtitle">
                                {unseenNotifications.length > 0
                                    ? `${unseenNotifications.length} unseen alert${unseenNotifications.length > 1 ? 's' : ''}`
                                    : "All clear! No pending alerts"}
                                {seenNotifications.length > 0 && ` · ${seenNotifications.length} reviewed`}
                            </p>
                        </div>
                    </div>
                    <div className="ntf-header-actions">
                        {unseenNotifications.length > 0 && (
                            <button className="ntf-btn ntf-btn-mark" onClick={handleMarkAllAsSeen} disabled={actionLoading}>
                                <FaEye /> Mark All Read
                            </button>
                        )}
                        {totalCount > 0 && (
                            <button className="ntf-btn ntf-btn-clear" onClick={handleClearAll} disabled={actionLoading}>
                                <FaTrash /> Clear All
                            </button>
                        )}
                    </div>
                </div>

                <div className="ntf-content-box">
                    <div className="ntf-tabs">
                        <button className={`ntf-tab ${activeTab === 'unseen' ? 'active' : ''}`} onClick={() => setActiveTab('unseen')}>
                            Pending {unseenNotifications.length > 0 && <span className="ntf-tab-count">{unseenNotifications.length}</span>}
                        </button>
                        <button className={`ntf-tab ${activeTab === 'seen' ? 'active' : ''}`} onClick={() => setActiveTab('seen')}>
                            Reviewed {seenNotifications.length > 0 && <span className="ntf-tab-count">{seenNotifications.length}</span>}
                        </button>
                    </div>

                    <div className="ntf-list">
                        {loading ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="ntf-sk-item">
                                        <div className="ntf-sk-icon ntf-sk-anim"></div>
                                        <div className="ntf-sk-body">
                                            <div className="ntf-sk-line ntf-sk-short ntf-sk-anim"></div>
                                            <div className="ntf-sk-line ntf-sk-long ntf-sk-anim"></div>
                                            <div className="ntf-sk-line ntf-sk-med ntf-sk-anim"></div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : currentList.length === 0 ? (
                            <div className="ntf-empty">
                                <FaShieldAlt className="ntf-empty-icon" />
                                <h3>{activeTab === 'unseen' ? "No pending alerts" : "No reviewed alerts"}</h3>
                                <p>{activeTab === 'unseen' ? "The system is performing optimally. ✅" : "Reviewed alerts will appear here"}</p>
                            </div>
                        ) : (
                            grouped.map((group) => (
                                <div key={group.label} className="ntf-group">
                                    <div className="ntf-group-label">{group.label}</div>
                                    {group.items.map((notification) => {
                                        const cfg = getConfig(notification.type);
                                        const IconComp = cfg.icon;
                                        return (
                                            <div key={notification._idx} className={`ntf-item ${activeTab === 'unseen' ? 'ntf-item-unseen' : ''}`}>
                                                <div className="ntf-item-icon" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                                                    <IconComp />
                                                </div>
                                                <div className="ntf-item-content">
                                                    <div className="ntf-item-top">
                                                        <span className="ntf-type-label" style={{ color: cfg.color }}>
                                                            {cfg.label}
                                                        </span>
                                                        {notification.createdAt && (
                                                            <span className="ntf-time">{timeAgo(notification.createdAt)}</span>
                                                        )}
                                                    </div>
                                                    <p className="ntf-item-message">{notification.message || 'Notification'}</p>
                                                    <div className="ntf-item-meta">
                                                        {notification.data?.doctorName && (
                                                            <span className="ntf-meta-tag"><FaUserMd /> Dr. {notification.data.doctorName}</span>
                                                        )}
                                                        {notification.data?.email && (
                                                            <span className="ntf-meta-tag"><FaInfoCircle /> {notification.data.email}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    className="ntf-item-delete"
                                                    onClick={() => handleDeleteOne(notification._idx, activeTab === 'unseen' ? 'unseen' : 'seen')}
                                                    disabled={actionLoading}
                                                    title="Delete alert"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ANotifications;
