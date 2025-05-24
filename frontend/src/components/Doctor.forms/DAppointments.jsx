import React, { useState } from "react";

const dummyAppointments = [
  {
    id: 1,
    patientName: "John Doe",
    problem: "Fever & Cough",
    availability: { from: "10:00 AM", to: "11:00 AM" },
    mode: "Online",
    contact: "johndoe@example.com"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    problem: "Back Pain",
    availability: { from: "02:00 PM", to: "03:00 PM" },
    mode: "Offline",
    contact: "9876543210"
  },
];

function DAppointments() {
  const [appointments, setAppointments] = useState(dummyAppointments);

  const handleResponse = (id, status) => {
    alert(`Appointment ID ${id} has been ${status}.`);
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px", backgroundColor: "#f8f9fa" }}>
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Appointments</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {appointments.map((appt) => (
          <div
            key={appt.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <p><strong>Patient Name:</strong> {appt.patientName}</p>
            <p><strong>Problem:</strong> {appt.problem}</p>
            <p><strong>Availability:</strong> {appt.availability.from} - {appt.availability.to}</p>
            <p><strong>Mode:</strong> {appt.mode}</p>
            <p><strong>Phone or Email:</strong> {appt.contact}</p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => handleResponse(appt.id, "accepted")}
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
                  cursor: "pointer"
                }}
                onClick={() => handleResponse(appt.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <p style={{ color: "#666", textAlign: "center" }}>No appointments left.</p>
        )}
      </div>
    </div>
          </div>
  );
}

export default DAppointments;