import React, { useState, useEffect } from "react";
import axios from "axios";

function DAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:1600/api/doctor/appointments/");
        const data = response.data.data;
        console.log("Fetched Appointments:", data);
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const acceptResponse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:1600/api/doctor/accept-appointment/${id}`);

      const result = response.data;
      if (result.success) {
        const updatedAppt = result.data;

        // Update the appointment status locally in the frontend state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === updatedAppt._id ? { ...appt, status: updatedAppt.status } : appt
          )
        );

        console.log("✅ Appointment accepted:", updatedAppt);
      } else {
        console.warn("⚠️ Could not accept appointment:", result.message);
      }
    } catch (error) {
      console.error("❌ Error accepting appointment:", error);
    }
  };

  const rejectResponse = async (id) => {
    // Implement rejection logic similarly if needed
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
      <div style={{ padding: "2rem", width: "600px" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Appointments</h2>

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
      </div>
    </div>
  );
}

export default DAppointments;
