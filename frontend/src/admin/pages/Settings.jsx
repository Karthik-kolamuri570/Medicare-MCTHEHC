import React, { useState } from 'react';
import {
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Settings as SettingsIcon,
    Email as EmailIcon,
    Notifications as NotificationIcon,
    Security as SecurityIcon,
    Palette as PaletteIcon,
    Storage as StorageIcon,
    Language as LanguageIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        // General
        appName: 'Medicare',
        timezone: 'Asia/Kolkata',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',

        // Email
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@medicare.com',

        // Notifications
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,

        // Security
        sessionTimeout: '30',
        passwordMinLength: '8',
        requireSpecialChar: true,
        twoFactorAuth: false,

        // Appearance
        primaryColor: '#1976d2',
        theme: 'light'
    });

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving settings:', settings);
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <SettingsIcon /> },
        { id: 'email', label: 'Email', icon: <EmailIcon /> },
        { id: 'notifications', label: 'Notifications', icon: <NotificationIcon /> },
        { id: 'security', label: 'Security', icon: <SecurityIcon /> },
        { id: 'appearance', label: 'Appearance', icon: <PaletteIcon /> },
        { id: 'system', label: 'System', icon: <StorageIcon /> }
    ];

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div>
                    <h1>Application Settings</h1>
                    <p className="subtitle">Configure your Medicare admin portal preferences</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => window.location.reload()}>
                        <RefreshIcon fontSize="small" /> Reset
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        <SaveIcon fontSize="small" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="settings-layout">
                {/* Sidebar Tabs */}
                <div className="settings-sidebar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="settings-content">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h2><SettingsIcon /> General Settings</h2>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Application Name</label>
                                    <input
                                        type="text"
                                        value={settings.appName}
                                        onChange={(e) => handleChange('appName', e.target.value)}
                                        placeholder="Medicare"
                                    />
                                </div>

                                <div className="form-group">
                                    <label><ScheduleIcon fontSize="small" /> Timezone</label>
                                    <select value={settings.timezone} onChange={(e) => handleChange('timezone', e.target.value)}>
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York">America/New York (EST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label><LanguageIcon fontSize="small" /> Language</label>
                                    <select value={settings.language} onChange={(e) => handleChange('language', e.target.value)}>
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="es">Spanish</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Date Format</label>
                                    <select value={settings.dateFormat} onChange={(e) => handleChange('dateFormat', e.target.value)}>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Settings */}
                    {activeTab === 'email' && (
                        <div className="settings-section">
                            <h2><EmailIcon /> Email Configuration</h2>
                            <div className="settings-grid">
                                <div className="form-group full-width">
                                    <label>SMTP Host</label>
                                    <input
                                        type="text"
                                        value={settings.smtpHost}
                                        onChange={(e) => handleChange('smtpHost', e.target.value)}
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>SMTP Port</label>
                                    <input
                                        type="number"
                                        value={settings.smtpPort}
                                        onChange={(e) => handleChange('smtpPort', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>From Email</label>
                                    <input
                                        type="email"
                                        value={settings.fromEmail}
                                        onChange={(e) => handleChange('fromEmail', e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>SMTP Username</label>
                                    <input
                                        type="text"
                                        value={settings.smtpUser}
                                        onChange={(e) => handleChange('smtpUser', e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>SMTP Password</label>
                                    <input
                                        type="password"
                                        value={settings.smtpPassword}
                                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2><NotificationIcon /> Notification Preferences</h2>
                            <div className="toggle-list">
                                <div className="toggle-item">
                                    <div>
                                        <h4>Email Notifications</h4>
                                        <p>Receive email alerts for important events</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4>SMS Notifications</h4>
                                        <p>Get text messages for critical updates</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.smsNotifications}
                                            onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4>Push Notifications</h4>
                                        <p>Browser push notifications for real-time updates</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.pushNotifications}
                                            onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2><SecurityIcon /> Security Settings</h2>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Minimum Password Length</label>
                                    <input
                                        type="number"
                                        value={settings.passwordMinLength}
                                        onChange={(e) => handleChange('passwordMinLength', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="toggle-list">
                                <div className="toggle-item">
                                    <div>
                                        <h4>Require Special Characters</h4>
                                        <p>Passwords must contain special characters</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.requireSpecialChar}
                                            onChange={(e) => handleChange('requireSpecialChar', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Enable 2FA for enhanced security</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.twoFactorAuth}
                                            onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div className="settings-section">
                            <h2><PaletteIcon /> Appearance</h2>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Primary Color</label>
                                    <div className="color-picker-wrapper">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        />
                                        <span className="color-value">{settings.primaryColor}</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Theme</label>
                                    <select value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)}>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Settings */}
                    {activeTab === 'system' && (
                        <div className="settings-section">
                            <h2><StorageIcon /> System Maintenance</h2>
                            <div className="action-cards">
                                <div className="action-card">
                                    <h4>Database Backup</h4>
                                    <p>Create a backup of your database</p>
                                    <button className="btn-action">Create Backup</button>
                                </div>

                                <div className="action-card">
                                    <h4>Clear Cache</h4>
                                    <p>Clear application cache to improve performance</p>
                                    <button className="btn-action">Clear Cache</button>
                                </div>

                                <div className="action-card">
                                    <h4>System Logs</h4>
                                    <p>View and download system logs</p>
                                    <button className="btn-action">View Logs</button>
                                </div>

                                <div className="action-card">
                                    <h4>Export Data</h4>
                                    <p>Export all application data</p>
                                    <button className="btn-action">Export</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
