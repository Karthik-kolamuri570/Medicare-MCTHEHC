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

  // Example API endpoints; adjust URLs as needed
  const fetchBankDetails = () => axios.get("/api/blood-bank/my-bank");
  const fetchStock = () => axios.get("/api/blood-bank/my-bank"); // Assuming stock is part of bank details
  const fetchRequests = () => axios.get("/api/blood-bank-user/blood-requests");
  const fetchDonations = () => axios.get("/api/blood-bank-user/donation-requests");
  const fetchNotifications = () => axios.get("/api/blood-bank/notifications"); // You need to create this endpoint or adjust accordingly

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [bankRes, requestsRes, donationsRes, notificationsRes] = await Promise.all([
          fetchBankDetails(),
          fetchRequests(),
          fetchDonations(),
          fetchNotifications(),
        ]);

        setBank(bankRes.data.bank || {});
        // Assuming blood groups stock is part of bank details as bankRes.data.bank.blood_groups
        setStock(bankRes.data.bank?.blood_groups || {});

        setRequests(requestsRes.data.requests || []);
        setDonations(donationsRes.data.donations || []);
        setNotifications(notificationsRes.data.notifications || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handlers for actions (implement API calls as needed)
  const onAcceptRequest = async (id) => {
    try {
      await axios.post(`/api/blood-bank-user/accept-request/${id}`);
      // Refresh requests after accepting
      const res = await fetchRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Accept request error:", err);
    }
  };

  const onRejectRequest = async (id) => {
    try {
      await axios.put(`/api/blood-bank-user/reject-request/${id}`);
      const res = await fetchRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Reject request error:", err);
    }
  };

  const onAcceptDonation = async (id) => {
    try {
      await axios.post(`/api/blood-bank-user/accept-donation/${id}`);
      const res = await fetchDonations();
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Accept donation error:", err);
    }
  };

  const onRejectDonation = async (id) => {
    try {
      await axios.put(`/api/blood-bank-user/reject-donation/${id}`);
      const res = await fetchDonations();
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Reject donation error:", err);
    }
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/blood-bank/bank-logout");
      // Redirect to login page or clear session
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const onMarkAllNotificationsRead = async () => {
    try {
      await axios.put("/api/blood-bank-user/notifications/mark-all-read"); // Implement this API if needed
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all notifications read error:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
}

export default BloodBankContainer;
