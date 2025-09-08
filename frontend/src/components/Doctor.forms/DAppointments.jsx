import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from '../ui/Loader';  // Assuming this is your loading spinner component

function DAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // <-- Loading state

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);  // Start loading
      try {
        const response = await axios.get("http://localhost:1600/api/doctor/appointments/");
        const data = response.data.data;
        console.log("Fetched Appointments:", data);
        toast.success("Appointments fetched successfully!");
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchAppointments();
  }, []);

  const acceptResponse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:1600/api/doctor/accept-appointment/${id}`);

      const result = response.data;
      if (result.success) {
        const updated = result.data;
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
        );
        toast.success("Appointment accepted successfully!");
        console.log("✅ Appointment accepted:", updated);
      } else {
        toast.error("Failed to accept appointment: " + result.message);
        console.warn("⚠️ Could not accept appointment:", result.message);
      }
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast.error("Error accepting appointment");
    }
  };

  const rejectResponse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:1600/api/doctor/reject-appointment/${id}`);
      const result = response.data;
      if (result.success) {
        const updated = result.data;
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
        );
        toast.success("Appointment rejected successfully!");
        console.log("❌ Appointment rejected", updated);
      } else {
        toast.error("Failed to reject appointment: " + result.message);
        console.warn("⚠️ Could not reject appointment:", result.message);
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Error rejecting appointment");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "600px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ padding: "6rem", width: "600px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Appointments</h2>
        
        {loading ? (
          <Loader />  // Renders your loading indicator while loading is true
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <div
                  key={appt._id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <p>
                    <strong>Patient Name:</strong> {appt.patientId?.name}
                  </p>
                  <p>
                    <strong>Problem:</strong> {appt.problem}
                  </p>
                  <p>
                    <strong>Availability:</strong> Date: {appt.date} - Time: {appt.time}
                  </p>
                  <p>
                    <strong>Mode:</strong> Online
                  </p>
                  <p>
                    <strong>Phone or Email:</strong> {appt.patientId?.email}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: appt.status === "Accepted" ? "green" : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {appt.status}
                    </span>
                  </p>

                  {appt.status === "Pending" && (
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => acceptResponse(appt._id)}
                      >
                        Accept
                      </button>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => rejectResponse(appt._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: "#666", textAlign: "center" }}>No appointments available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DAppointments;
