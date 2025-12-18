import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  People as UsersIcon,
  PersonAdd as SignupsIcon,
  CheckCircle as ApprovalsIcon,
  EventNote as AppointmentsIcon,
  AttachMoney as RevenueIcon,
  BloodtypeOutlined as BloodIcon,
  TrendingUp as TrendingIcon,
  Refresh as RefreshIcon,
  DeleteOutline as DeleteIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminService from '../services/adminService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [patientAnalytics, setPatientAnalytics] = useState([]);
  const [appointmentAnalytics, setAppointmentAnalytics] = useState([]);
  const [revenueDetails, setRevenueDetails] = useState([]);
  const [bloodCamps, setBloodCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [dashStats, patientAnal, appointmentAnal, revenueAnal, campsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPatientAnalytics(),
        adminService.getAppointmentAnalytics(),
        adminService.getRevenueDetails(),
        adminService.getBloodCamps()
      ]);

      setDashboardData(dashStats);
      setPatientAnalytics(patientAnal || []);
      setAppointmentAnalytics(appointmentAnal || []);
      setRevenueDetails(revenueAnal || []);
      setBloodCamps(campsData?.data || []);

      console.log('Dashboard data loaded:', {
        dashStats,
        patientAnal,
        appointmentAnal,
        revenueAnal
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = () => {
    fetchAllDashboardData();
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          {error}
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { doctors: 0, patients: 0, appointments: 0, pendingApprovals: 0 };
  const revenue = dashboardData?.revenue || [];
  const doctorStats = dashboardData?.doctorStats || [];

  // Use real data from API with proper formatting
  const appointmentsData = appointmentAnalytics.map(item => ({
    status: item._id || 'Unknown',
    count: item.count || 0
  }));

  const patientAgeData = patientAnalytics.map(item => ({
    ageGroup: item._id || 'Unknown',
    count: item.count || 0
  }));

  const revenueData = revenueDetails.map(item => ({
    doctor: item._id?.doctorName || 'Unknown',
    revenue: item.totalRevenue || 0,
    appointments: item.appointmentCount || 0
  })).slice(0, 10); // Top 10 doctors

  const MetricCard = ({ icon, label, value, change, isPositive = true }) => (
    <div className="metric-card">
      <div className="metric-icon" style={{ color: '#1976d2' }}>
        {icon}
      </div>
      <div className="metric-content">
        <p className="metric-label">{label}</p>
        <h3 className="metric-value">{value || 0}</h3>
        {change && (
          <p className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome Back, Admin! 👋</h1>
          <p>Here's a quick overview of Medicare's performance and recent activities.</p>
        </div>
        <button className="refresh-btn" onClick={fetchDashboardData}>
          <RefreshIcon /> Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <section className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <MetricCard
            icon={<UsersIcon />}
            label="Total Patients"
            value={stats.patients || 0}
          />
          <MetricCard
            icon={<SignupsIcon />}
            label="Total Doctors"
            value={stats.doctors || 0}
          />
          <MetricCard
            icon={<ApprovalsIcon />}
            label="Pending Doctor Approvals"
            value={stats.pendingApprovals || 0}
          />
          <MetricCard
            icon={<AppointmentsIcon />}
            label="Total Appointments"
            value={stats.appointments || 0}
          />
          <MetricCard
            icon={<RevenueIcon />}
            label="Total Revenue"
            value={`₹${(revenue.reduce((sum, item) => sum + (item.total || 0), 0)).toLocaleString()}`}
          />
          <MetricCard
            icon={<BloodIcon />}
            label="Blood Camps"
            value={bloodCamps.length || 0}
          />
        </div>
      </section>

      {/* Operational Trends */}
      <section className="trends-section">
        <h2>Operational Trends</h2>
        <div className="charts-grid">
          {/* Appointment Status Distribution */}
          <div className="chart-card">
            <h3>Appointment Status Distribution</h3>
            {appointmentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>No appointment data available</p>
              </div>
            )}
          </div>

          {/* Patient Age Distribution */}
          <div className="chart-card">
            <h3>Patient Age Distribution</h3>
            {patientAgeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patientAgeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>No patient data available</p>
              </div>
            )}
          </div>

          {/* Top Revenue Generating Doctors */}
          <div className="chart-card">
            <h3>Top Revenue Generating Doctors</h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="doctor" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                <p>No revenue data available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions & Activity Feed */}
      <div className="actions-activity-grid">
        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">📋</div>
              <h4>Review Pending Doctors</h4>
              <p>Approve or reject new doctor applications.</p>
              <button className="action-btn" onClick={() => navigate('/admin/doctors')}>Go to Doctors</button>
            </div>
            <div className="action-card">
              <div className="action-icon">👥</div>
              <h4>Manage Users</h4>
              <p>View and edit user profiles.</p>
              <button className="action-btn" onClick={() => navigate('/admin/users')}>Go to Users</button>
            </div>
            <div className="action-card">
              <div className="action-icon">📅</div>
              <h4>Schedule Appointment</h4>
              <p>Create or modify patient appointments.</p>
              <button className="action-btn" onClick={() => navigate('/admin/appointments')}>Go to Appointments</button>
            </div>
            <div className="action-card">
              <div className="action-icon">🩸</div>
              <h4>Check Blood Stock</h4>
              <p>Monitor blood inventory levels.</p>
              <button className="action-btn" onClick={() => navigate('/admin/blood-banks')}>Go to Blood Bank</button>
            </div>
          </div>
        </section>

        {/* Blood Camps Management - Premium UI */}
        <section className="blood-camps-section">
          <div className="section-header">
            <h2>Blood Camps Overview</h2>
            <span className="badge-count">{bloodCamps.length} Active</span>
          </div>
          <div className="camp-list">
            {bloodCamps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⛺</div>
                <p>No blood camps scheduled yet.</p>
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
        </section>
      </div>
    </div>
  );
};

export default Dashboard;































// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   People as UsersIcon,
//   PersonAdd as SignupsIcon,
//   CheckCircle as ApprovalsIcon,
//   EventNote as AppointmentsIcon,
//   AttachMoney as RevenueIcon,
//   BloodtypeOutlined as BloodIcon,
//   TrendingUp as TrendingIcon,
//   Refresh as RefreshIcon
// } from '@mui/icons-material';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import adminService from '../services/adminService';
// import '../styles/Dashboard.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [patientAnalytics, setPatientAnalytics] = useState([]);
//   const [appointmentAnalytics, setAppointmentAnalytics] = useState([]);
//   const [revenueDetails, setRevenueDetails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchAllDashboardData();
//   }, []);

//   const fetchAllDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch all data in parallel
//       const [dashStats, patientAnal, appointmentAnal, revenueAnal] = await Promise.all([
//         adminService.getDashboardStats(),
//         adminService.getPatientAnalytics(),
//         adminService.getAppointmentAnalytics(),
//         adminService.getRevenueDetails()
//       ]);

//       setDashboardData(dashStats);
//       setPatientAnalytics(patientAnal || []);
//       setAppointmentAnalytics(appointmentAnal || []);
//       setRevenueDetails(revenueAnal || []);

//       console.log('Dashboard data loaded:', {
//         dashStats,
//         patientAnal,
//         appointmentAnal,
//         revenueAnal
//       });
//     } catch (err) {
//       setError('Failed to load dashboard data');
//       console.error('Dashboard fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDashboardData = () => {
//     fetchAllDashboardData();
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-container">
//         <div className="loading">Loading dashboard...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="dashboard-container">
//         <div className="error">
//           {error}
//           <button onClick={fetchDashboardData}>Retry</button>
//         </div>
//       </div>
//     );
//   }

//   const stats = dashboardData?.stats || {};
//   const revenue = dashboardData?.revenue || [];
//   const doctorStats = dashboardData?.doctorStats || [];

//   // Convert analytics data to chart format
//   const appointmentsPerDay = appointmentAnalytics.map(item => ({
//     day: item._id || 'Unknown',
//     appointments: item.count || 0
//   }));

//   // Convert revenue data to chart format (already formatted from backend)
//   const dailyRevenue = revenue.map(item => ({
//     day: item.month || 'Unknown',
//     revenue: item.total || 0
//   }));

//   // Convert doctor stats to blood donations visualization
//   const bloodDonations = doctorStats.map(item => ({
//     day: item._id || 'Unknown',
//     donations: item.count || 0
//   }));

//   const MetricCard = ({ icon, label, value, change, isPositive = true }) => (
//     <div className="metric-card">
//       <div className="metric-icon" style={{ color: '#1976d2' }}>
//         {icon}
//       </div>
//       <div className="metric-content">
//         <p className="metric-label">{label}</p>
//         <h3 className="metric-value">{value}</h3>
//         {change && (
//           <p className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
//             {isPositive ? '↑' : '↓'} {change}
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="dashboard-container">
//       {/* Welcome Section */}
//       <div className="welcome-section">
//         <div className="welcome-content">
//           <h1>Welcome Back, Admin! 👋</h1>
//           <p>Here's a quick overview of HealthSphere's performance and recent activities.</p>
//         </div>
//         <button className="refresh-btn" onClick={fetchDashboardData}>
//           <RefreshIcon /> Refresh
//         </button>
//       </div>

//       {/* Key Metrics */}
//       <section className="metrics-section">
//         <h2>Key Metrics</h2>
//         <div className="metrics-grid">
//           <MetricCard
//             icon={<UsersIcon />}
//             label="Total Users"
//             value={stats.patients ? stats.patients + stats.doctors : 0}
//             change="+12% (7d)"
//             isPositive={true}
//           />
//           <MetricCard
//             icon={<SignupsIcon />}
//             label="Total Doctors"
//             change="+8% (prev 7d)"
//             value={stats.doctors || 0}
//             isPositive={true}
//           />
//           <MetricCard
//             icon={<ApprovalsIcon />}
//             label="Pending Doctor Approvals"
//             value={stats.pendingApprovals || 0}
//             change="Action needed"
//             isPositive={stats.pendingApprovals === 0}
//           />
//           <MetricCard
//             icon={<AppointmentsIcon />}
//             label="Total Appointments"
//             value={stats.appointments || 0}
//             change={`${stats.appointments > 100 ? '+' : ''}${(stats.appointments / 10).toFixed(1)}% activity`}
//             isPositive={true}
//           />
//           <MetricCard
//             icon={<RevenueIcon />}
//             label="Revenue (Last 30d)"
//             value={`$${(dailyRevenue.reduce((sum, item) => sum + item.revenue, 0)).toLocaleString()}`}
//             change="+15% (prev 30d)"
//             isPositive={true}
//           />
//           <MetricCard
//             icon={<BloodIcon />}
//             label="Doctor Specializations"
//             value={doctorStats.length || 0}
//             change="Tracked"
//             isPositive={true}
//           />
//         </div>
//       </section>

//       {/* Operational Trends */}
//       <section className="trends-section">
//         <h2>Operational Trends</h2>
//         <div className="charts-grid">
//           {/* Appointments per Day */}
//           <div className="chart-card">
//             <h3>Appointments per Day</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={appointmentsPerDay}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="appointments" fill="#1976d2" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Daily Revenue */}
//           <div className="chart-card">
//             <h3>Daily Revenue</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={dailyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="revenue" stroke="#4caf50" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Blood Donations */}
//           <div className="chart-card">
//             <h3>Blood Donations (Units)</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={bloodDonations}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="donations" fill="#f44336" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* Quick Actions & Activity Feed */}
//       <div className="actions-activity-grid">
//         {/* Quick Actions */}
//         <section className="quick-actions-section">
//           <h2>Quick Actions</h2>
//           <div className="actions-grid">
//             <div className="action-card">
//               <div className="action-icon">📋</div>
//               <h4>Review Pending Doctors</h4>
//               <p>Approve or reject new doctor applications.</p>
//               <button className="action-btn" onClick={() => navigate('/admin/doctors')}>Go to Doctors</button>
//             </div>
//             <div className="action-card">
//               <div className="action-icon">👥</div>
//               <h4>Manage Users</h4>
//               <p>View and edit user profiles.</p>
//               <button className="action-btn" onClick={() => navigate('/admin/users')}>Go to Users</button>
//             </div>
//             <div className="action-card">
//               <div className="action-icon">📅</div>
//               <h4>Manage Appointments</h4>
//               <p>Create or modify patient appointments.</p>
//               <button className="action-btn" onClick={() => navigate('/admin/appointments')}>Go to Appointments</button>
//             </div>
//             <div className="action-card">
//               <div className="action-icon">🩸</div>
//               <h4>Check Blood Stock</h4>
//               <p>Monitor blood inventory levels.</p>
//               <button className="action-btn" onClick={() => navigate('/admin/blood-banks')}>Go to Blood Bank</button>
//             </div>
//           </div>
//         </section>

//         {/* Activity Feed */}
//         <section className="activity-feed-section">
//           <h2>Latest Events</h2>
//           <div className="activity-list">
//             <div className="activity-item">
//               <div className="activity-icon">👤</div>
//               <div className="activity-content">
//                 <p><strong>New user registered</strong> by Jane Doe</p>
//                 <span className="activity-time">2 minutes ago</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">📋</div>
//               <div className="activity-content">
//                 <p><strong>Doctor application submitted</strong> by Dr. Smith</p>
//                 <span className="activity-time">1 hour ago</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">📅</div>
//               <div className="activity-content">
//                 <p><strong>Appointment booked</strong> by John Doe (Dr. Ava Sharma)</p>
//                 <span className="activity-time">3 hours ago</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">🩸</div>
//               <div className="activity-content">
//                 <p><strong>Blood unit added to stock</strong> by Admin (A+ unit #789)</p>
//                 <span className="activity-time">Yesterday</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">💳</div>
//               <div className="activity-content">
//                 <p><strong>Payment processed</strong> System (TXN123456)</p>
//                 <span className="activity-time">Yesterday</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">📝</div>
//               <div className="activity-content">
//                 <p><strong>Blog post published</strong> by Alice Johnson (Healthy Living Tips)</p>
//                 <span className="activity-time">2 days ago</span>
//               </div>
//             </div>
//             <div className="activity-item">
//               <div className="activity-icon">👤</div>
//               <div className="activity-content">
//                 <p><strong>User profile updated</strong> by Admin (Jane Doe)</p>
//                 <span className="activity-time">3 days ago</span>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
