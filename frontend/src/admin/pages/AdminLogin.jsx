import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  CircularProgress 
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import adminService from '../services/adminService';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await adminService.login(email, password);
      
      if (response.success) {
        // Redirect to dashboard on successful login
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <Container maxWidth="sm">
        <Box className="login-container">
          {/* Header */}
          <Box className="login-header">
            <div className="login-logo">
              <LockIcon className="lock-icon" />
            </div>
            <Typography variant="h4" className="login-title">
              Medicare Admin
            </Typography>
            <Typography variant="body2" className="login-subtitle">
              Sign in to your admin account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" className="login-alert">
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@medicare.com"
              disabled={loading}
              className="login-input"
              InputLabelProps={{ className: 'input-label' }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="login-input"
              InputLabelProps={{ className: 'input-label' }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                <>
                  <CircularProgress size={20} style={{ marginRight: '8px' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <Box className="demo-credentials">
            <Typography variant="caption" className="demo-label">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" className="demo-text">
              Email: admin@medicare.com
            </Typography>
            <Typography variant="caption" className="demo-text">
              Password: admin123456
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AdminLogin;
