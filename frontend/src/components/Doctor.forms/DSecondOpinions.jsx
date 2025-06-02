import React, { useState } from "react";

const secondOpinionRequests = [
  {
    id: 1,
    patientName: "Alice Johnson",
    problem: "Chronic migraine",
    availability: { from: "10:00 AM", to: "12:00 PM" },
    mode: "Online",
    contact: "alice.johnson@example.com",
    previousTreatment: "Prescribed triptans, asked to track triggers.",
    records: "report1.pdf"
  },
  {
    id: 1,
    patientName: "Alice Johnson",
    problem: "Chronic migraine",
    availability: { from: "10:00 AM", to: "12:00 PM" },
    mode: "Online",
    contact: "alice.johnson@example.com",
    previousTreatment: "Prescribed triptans, asked to track triggers.",
    records: "report1.pdf"
  },
  {
    id: 1,
    patientName: "Alice Johnson",
    problem: "Chronic migraine",
    availability: { from: "10:00 AM", to: "12:00 PM" },
    mode: "Online",
    contact: "alice.johnson@example.com",
    previousTreatment: "Prescribed triptans, asked to track triggers.",
    records: "report1.pdf"
  },
  {
    id: 1,
    patientName: "Alice Johnson",
    problem: "Chronic migraine",
    availability: { from: "10:00 AM", to: "12:00 PM" },
    mode: "Online",
    contact: "alice.johnson@example.com",
    previousTreatment: "Prescribed triptans, asked to track triggers.",
    records: "report1.pdf"
  },
  {
    id: 1,
    patientName: "Alice Johnson",
    problem: "Chronic migraine",
    availability: { from: "10:00 AM", to: "12:00 PM" },
    mode: "Online",
    contact: "alice.johnson@example.com",
    previousTreatment: "Prescribed triptans, asked to track triggers.",
    records: "report1.pdf"
  },
];

function DSecondOpinions() {
  const [requests, setRequests] = useState(secondOpinionRequests);

  const handleResponse = (id, action) => {
    alert(`Request ID ${id} has been ${action}`);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
          <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "600px",
      backgroundColor: "#f8f9fa",
    }}>
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Get Second Opinion</h2>

      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            gap: "2rem"
          }}
        >
          {/* Left: Details */}
          <div style={{ flex: 1 }}>
            <p><strong>Patient Name:</strong> {req.patientName}</p>
            <p><strong>Problem:</strong> {req.problem}</p>
            <p><strong>Availability:</strong> {req.availability.from} - {req.availability.to}</p>
            <p><strong>Mode:</strong> {req.mode}</p>
            <p><strong>Phone or Email:</strong> {req.contact}</p>
            <p><strong>Files and Medical Records:</strong> {req.records}</p>
            <p><strong>Previous Treatment:</strong></p>
            <textarea
              value={req.previousTreatment}
              readOnly
              style={{
                width: "100%",
                height: "80px",
                padding: "0.5rem",
                resize: "none",
                border: "1px solid #ccc",
                borderRadius: "5px"
              }}
            />
          </div>

          {/* Right: Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
              onClick={() => handleResponse(req.id, "accepted")}
            >
              Accept
            </button>
            <button
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
              onClick={() => handleResponse(req.id, "rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <p style={{ color: "#666", textAlign: "center" }}>No more second opinion requests.</p>
      )}
    </div>
    </div>
  );
}

export default DSecondOpinions;