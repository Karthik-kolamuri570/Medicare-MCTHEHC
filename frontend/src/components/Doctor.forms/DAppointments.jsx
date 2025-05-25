import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
// const dummyAppointments = [
//   {
//     id: 1,
//     patientName: "John Doe",
//     problem: "Fever & Cough",
//     availability: { from: "10:00 AM", to: "11:00 AM" },
//     mode: "Online",
//     contact: "johndoe@example.com"
//   },
//   {
//     id: 2,
//     patientName: "Jane Smith",
//     problem: "Back Pain",
//     availability: { from: "02:00 PM", to: "03:00 PM" },
//     mode: "Offline",
//     contact: "9876543210"
//   },
// ];


function DAppointments() {
  
  const [appointments, setAppointments] = useState([]);
  useEffect(()=>{
    const fetchAppointments = async () => {
      try{
        const response= await axios.get("http://localhost:1600/api/doctor/appointments/", { withCredentials: true })
        const data=await response.data.data;
        console.log("Fetched Appointments:", data); // Debugging
        setAppointments(data);
      }
      catch(error){
        console.error("Error fetching appointments:", error);
      }
    }
    fetchAppointments();
  },[])
  

  const handleResponse = (id, status) => {
    alert(`Appointment ID ${id} has been ${status}.`);
    setAppointments((prev) => prev.filter((appt) => appt._id !== id)); // it tries to remove the appointment from the list after accepting or rejecting
    
  };

  return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "600px", backgroundColor: "#f8f9fa" }}>
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Appointments</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {appointments.map((appt) => (
          <div
            key={appt._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1.5rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <p><strong>Patient Name:</strong> {appt.patientId?.name}</p>
            <p><strong>Problem:</strong> {appt.problem}</p>
            <p><strong>Availability:</strong>Date: {appt.date} - Time: {appt.time}</p>
            <p><strong>Mode:</strong> Online</p>
            <p><strong>Phone or Email:</strong> {appt.patientId?.email}</p>
            <p><strong>Status :</strong> {appt.status}</p>


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
                onClick={() => handleResponse(appt._id, "accepted")}
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
                onClick={() => handleResponse(appt._id, "rejected")}
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