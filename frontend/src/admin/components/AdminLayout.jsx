import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  BloodtypeOutlined as BloodIcon,
  EventNote as AppointmentIcon,
  Payment as PaymentIcon,
  Article as BlogIcon,
  History as AuditIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  VolunteerActivism as CampIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  NotificationsNone as NotificationsIcon
} from '@mui/icons-material';
import { Badge } from '@mui/material';
import api from '../../utils/api';
import '../styles/AdminLayout.css';
import '../styles/theme.css';
import adminService from '../services/adminService';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [notificationCount, setNotificationCount] = useState(0);

  // Poll for notification count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/api/admin/notifications/count');
        if (res.data?.success) setNotificationCount(res.data.count);
      } catch (err) { /* silent */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Doctor Approvals', icon: <PersonAddIcon />, path: '/admin/doctors' },
    { label: 'Blood Camps', icon: <CampIcon />, path: '/admin/blood-camps' },
    { label: 'Flame Bank Admin', icon: <BloodIcon />, path: '/admin/blood-banks' },
    { label: 'Appointments', icon: <AppointmentIcon />, path: '/admin/appointments' },
    { label: 'Payments', icon: <PaymentIcon />, path: '/admin/payments' },
    { label: 'Blog Moderation', icon: <BlogIcon />, path: '/admin/blogs' },
    { label: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' }
  ];

  const handleLogout = async () => {
    try {
      await adminService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const getPageTitle = () => {
    const pathToTitle = {
      '/admin/dashboard': 'Dashboard',
      '/admin/users': 'Users Management',
      '/admin/doctors': 'Doctor Approvals',
      '/admin/blood-banks': 'Blood Bank Administration',
      '/admin/appointments': 'Appointments Management',
      '/admin/payments': 'Payments & Revenue',
      '/admin/blogs': 'Blog Moderation',
      '/admin/audit-logs': 'Audit Logs',
      '/admin/settings': 'Settings'
    };
    return pathToTitle[location.pathname] || 'Admin Dashboard';
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">❤️</span>
            <span className="logo-text">Medicare</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              {sidebarOpen && <span className="menu-label">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogoutIcon />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <button
            className="menu-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </button>

          <div className="header-title">
            <h1>{getPageTitle()}</h1>
          </div>

          <div className="header-right">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </button>
            <button
              className="notification-badge-btn"
              onClick={() => navigate('/admin/notifications')}
              title="Notifications"
            >
              <Badge badgeContent={notificationCount} color="error" overlap="circular" className={notificationCount > 0 ? 'pulse-badge' : ''}>
                <NotificationsIcon />
              </Badge>
            </button>
            <div className="profile-section">
              <button
                className="profile-btn"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <ProfileIcon />
                <span className="profile-name">{adminUser.name || 'Admin'}</span>
              </button>

              {profileMenuOpen && (
                <div className="profile-menu">
                  <div className="profile-info">
                    <p><strong>{adminUser.name}</strong></p>
                    <p className="profile-email">{adminUser.email}</p>
                    <p className="profile-role">{adminUser.role}</p>
                  </div>
                  <hr />
                  <button
                    className="profile-menu-item logout"
                    onClick={handleLogout}
                  >
                    <LogoutIcon /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
