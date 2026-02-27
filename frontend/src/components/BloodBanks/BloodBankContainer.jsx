
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
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

  const API_BASE = "/api";

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login?role=bank";
        return;
      }
      const response = await api.get(`${API_BASE}/blood-bank/verify-auth`);
      if (response.data.success && response.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        window.location.href = "/login?role=bank";
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      window.location.href = "/login?role=bank";
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchBankDetails = () =>
    api.get(`${API_BASE}/blood-bank/my-bank`);
  const fetchRequests = () =>
    api.get(`${API_BASE}/blood-bank/requests`);
  const fetchDonations = () =>
    api.get(`${API_BASE}/blood-bank/donations`);
  const fetchNotifications = () =>
    api.get(`${API_BASE}/blood-bank/notifications`);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bankRes, requestsRes, donationsRes, notificationsRes] =
        await Promise.all([
          fetchBankDetails(),
          fetchRequests(),
          fetchDonations(),
          fetchNotifications(),
        ]);

      setBank(bankRes.data.bank || {});
      setStock(bankRes.data.bank?.blood_groups || {});
      setRequests(requestsRes.data.requests ? [...requestsRes.data.requests] : []);
      setDonations(donationsRes.data.donations ? [...donationsRes.data.donations] : []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error("Error loading data:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login?role=bank";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();

      // Start polling after authenticated
      const intervalId = setInterval(() => {
        fetchRequests()
          .then((res) => {
            if (res.data.requests) setRequests([...res.data.requests]);
          })
          .catch((err) => console.error("Polling requests failed:", err));

        fetchDonations()
          .then((res) => {
            if (res.data.donations) setDonations([...res.data.donations]);
          })
          .catch((err) => console.error("Polling donations failed:", err));

        fetchBankDetails()
          .then((res) => {
            if (res.data.bank) {
              setBank(res.data.bank);
              setStock(res.data.bank.blood_groups || {});
            }
          })
          .catch((err) => console.error("Polling bank details failed:", err));
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  const handleApiCall = async (apiCall, successCallback) => {
    try {
      await apiCall();
      if (successCallback) await successCallback();
    } catch (error) {
      console.error("API call failed:", error);
      if (error.response?.status === 401) {
        window.location.href = "/login?role=bank";
      }
    }
  };

  const refetchAllData = async () => {
    const [requestsRes, donationsRes, bankRes] = await Promise.all([
      fetchRequests(),
      fetchDonations(),
      fetchBankDetails(),
    ]);
    setRequests(requestsRes.data.requests ? [...requestsRes.data.requests] : []);
    setDonations(donationsRes.data.donations ? [...donationsRes.data.donations] : []);
    setBank(bankRes.data.bank || {});
    setStock(bankRes.data.bank?.blood_groups || {});
  };

  const onAcceptRequest = async (id) => {
    await handleApiCall(
      () =>
        api.put(`${API_BASE}/blood-bank-user/accept-request/${id}`, {}),
      refetchAllData
    );
  };

  const onRejectRequest = async (id) => {
    await handleApiCall(
      () =>
        api.put(`${API_BASE}/blood-bank-user/reject-request/${id}`, {}),
      refetchAllData
    );
  };

  const onAcceptDonation = async (id) => {
    await handleApiCall(
      () =>
        api.put(`${API_BASE}/blood-bank-user/accept-donation/${id}`, {}),
      refetchAllData
    );
  };

  const onRejectDonation = async (id) => {
    await handleApiCall(
      () =>
        api.put(`${API_BASE}/blood-bank-user/reject-donation/${id}`, {}),
      refetchAllData
    );
  };

  const onLogout = async () => {
    try {
      await api.get(`${API_BASE}/blood-bank/bank-logout`);
      // Clear JWT tokens from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setBank({});
      setStock({});
      setRequests([]);
      setDonations([]);
      setNotifications([]);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      // Clear tokens even on error
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const onMarkAllNotificationsRead = async () => {
    await handleApiCall(
      () =>
        api.put(
          `${API_BASE}/blood-bank/notifications/mark-all-read`,
          {}
        ),
      () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    );
  };

  if (authChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#c0392b",
        }}
      >
        Verifying authentication...
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#c0392b",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

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
