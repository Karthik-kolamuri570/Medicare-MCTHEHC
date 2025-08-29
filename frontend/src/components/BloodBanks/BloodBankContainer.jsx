import React, { useEffect, useState } from "react";
import axios from "axios";
import BloodBankDashboard from "./BloodBankDashboard";

function BloodBankContainer() {
  const [bank, setBank] = useState({});
  const [stock, setStock] = useState({});
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // API endpoints
  const API_BASE = "http://localhost:1600/api";

  // Check authentication first
  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${API_BASE}/blood-bank/verify-auth`, {
        withCredentials: true // Include cookies for session
      });
      
      if (response.data.success && response.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        // Not authenticated - redirect to login
        window.location.href = "/api/blood-bank/login";
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Authentication failed - redirect to login
      window.location.href = "/api/blood-bank/login";
    } finally {
      setAuthChecking(false);
    }
  };

  // Fetch functions
  const fetchBankDetails = () => axios.get(`${API_BASE}/blood-bank/my-bank`, { withCredentials: true });
  const fetchRequests = () => axios.get(`${API_BASE}/blood-bank-user/blood-requests`, { withCredentials: true });
  const fetchDonations = () => axios.get(`${API_BASE}/blood-bank-user/donation-requests`, { withCredentials: true });
  const fetchNotifications = () => axios.get(`${API_BASE}/blood-bank/notifications`, { withCredentials: true });

  // Load all data after authentication is confirmed
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bankRes, requestsRes, donationsRes, notificationsRes] = await Promise.all([
        fetchBankDetails(),
        fetchRequests(),
        fetchDonations(),
        fetchNotifications(),
      ]);

      setBank(bankRes.data.bank || {});
      setStock(bankRes.data.bank?.blood_groups || {});
      setRequests(requestsRes.data.requests || []);
      setDonations(donationsRes.data.donations || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error("Error loading data:", error);
      
      // If 401 unauthorized, redirect to login
      if (error.response?.status === 401) {
        window.location.href = "/api/blood-bank/login";
      }
    } finally {
      setLoading(false);
    }
  };

  // Run authentication check on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Action handlers with error handling for unauthorized access
  const handleApiCall = async (apiCall, successCallback) => {
    try {
      await apiCall();
      if (successCallback) successCallback();
    } catch (error) {
      console.error("API call failed:", error);
      if (error.response?.status === 401) {
        window.location.href = "/api/blood-bank/login";
      }
    }
  };

  const onAcceptRequest = async (id) => {
    await handleApiCall(
      () => axios.post(`${API_BASE}/blood-bank-user/accept-request/${id}`, {}, { withCredentials: true }),
      async () => {
        const res = await fetchRequests();
        setRequests(res.data.requests || []);
      }
    );
  };

  const onRejectRequest = async (id) => {
    await handleApiCall(
      () => axios.put(`${API_BASE}/blood-bank-user/reject-request/${id}`, {}, { withCredentials: true }),
      async () => {
        const res = await fetchRequests();
        setRequests(res.data.requests || []);
      }
    );
  };

  const onAcceptDonation = async (id) => {
    await handleApiCall(
      () => axios.post(`${API_BASE}/blood-bank-user/accept-donation/${id}`, {}, { withCredentials: true }),
      async () => {
        const res = await fetchDonations();
        setDonations(res.data.donations || []);
      }
    );
  };

  const onRejectDonation = async (id) => {
    await handleApiCall(
      () => axios.put(`${API_BASE}/blood-bank-user/reject-donation/${id}`, {}, { withCredentials: true }),
      async () => {
        const res = await fetchDonations();
        setDonations(res.data.donations || []);
      }
    );
  };

  const onLogout = async () => {
    try {
      await axios.get(`${API_BASE}/blood-bank/bank-logout`, { withCredentials: true });
      // Clear local state
      setIsAuthenticated(false);
      setBank({});
      setStock({});
      setRequests([]);
      setDonations([]);
      setNotifications([]);
      // Redirect to login
      window.location.href = "/api/blood-bank/login";
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout API fails, clear local state and redirect
      window.location.href = "/api/blood-bank/login";
    }
  };

  const onMarkAllNotificationsRead = async () => {
    await handleApiCall(
      () => axios.put(`${API_BASE}/blood-bank/notifications/mark-all-read`, {}, { withCredentials: true }),
      () => {
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      }
    );
  };

  // Show loading while checking authentication
  if (authChecking) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        fontSize: "1.2rem",
        color: "#c0392b"
      }}>
        Verifying authentication...
      </div>
    );
  }

  // Show loading while fetching data (after authentication confirmed)
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        fontSize: "1.2rem",
        color: "#c0392b"
      }}>
        Loading dashboard...
      </div>
    );
  }

  // Only render dashboard if authenticated
  return isAuthenticated ? (
    <BloodBankDashboard
      bank={bank}
      stock={stock}
      requests={requests}
      donations={donations}
      notifications={notifications}
      onAcceptRequest={onAcceptRequest}
      onRejectRequest={onRejectRequest}
      onAcceptDonation={onAcceptDonation}
      onRejectDonation={onRejectDonation}
      onLogout={onLogout}
      onMarkAllNotificationsRead={onMarkAllNotificationsRead}
    />
  ) : null;
}

export default BloodBankContainer;
