import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnlineConsultation = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:1600/api/patient/appointments", {
          withCredentials: true
        });
        setAppointments(res.data.data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleStartChat = (patientId,doctorId) => {
    navigate(`/api/chat/${doctorId}-${patientId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Consultations</h2>
      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
            <p><strong>Doctor:</strong> {appt.doctorId.name}</p>
            <p><strong>Date:</strong> {appt.date}</p>
            <p><strong>Time:</strong> {appt.time}</p>
            <button onClick={() => handleStartChat(appt.patientId, appt.doctorId._id)} style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" } }>
              Start Chat
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OnlineConsultation;
