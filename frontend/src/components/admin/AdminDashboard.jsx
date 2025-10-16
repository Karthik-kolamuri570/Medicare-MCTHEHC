// components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats');
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box className="p-6">
      {/* Stats Overview */}
      <Grid container spacing={4} className="mb-6">
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Doctors"
            value={dashboardData.stats.doctors}
            icon="👨‍⚕️"
            trend="+15%"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Patients"
            value={dashboardData.stats.patients}
            icon="👥"
            trend="+8%"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Appointments"
            value={dashboardData.stats.appointments}
            icon="📅"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Pending Approvals"
            value={dashboardData.stats.pendingApprovals}
            icon="⏳"
            trend="0"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card className="p-4">
            <Typography variant="h6" className="mb-4">Revenue Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="p-4">
            <Typography variant="h6" className="mb-4">Doctor Specializations</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.doctorStats}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, trend }) => (
  <Card className="p-4">
    <div className="flex justify-between items-center">
      <div>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="h2">
          {value}
        </Typography>
        <Typography color="textSecondary">
          {trend}
        </Typography>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  </Card>
);

export default AdminDashboard;
