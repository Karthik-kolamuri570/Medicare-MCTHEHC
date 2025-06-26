import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: "60px",
    gap: "40px",
    backgroundColor: "#fdfdfd",
    minHeight: "600px",
    boxSizing: "border-box",
  },
  virtualHall: {
    border: "3px solid black",
    borderRadius: "20px",
    padding: "30px",
    width: "650px",
    height: "auto",
    backgroundColor: "#f4f4f4",
    boxShadow: "2px 2px 5px #ccc",
  },
  schedules: {
    border: "3px solid black",
    borderRadius: "20px",
    padding: "30px",
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    boxShadow: "2px 2px 5px #ccc",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "30px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "12px",
    boxShadow: "0 1px 6px rgba(0, 0, 0, 0.06)",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    border: "1px solid #ddd",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  cardLabel: {
    fontWeight: "600",
    color: "#333",
    marginRight: "5px",
    display: "inline-block",
    minWidth: "80px",
  },
};

const DOnlineConsultation = () => {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [consultedIds, setConsultedIds] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:1600/api/doctor/accepted-appointments", {
          withCredentials: true, // Important if using cookies/session
        });
        const initialPatients = response.data.data;
        console.log("Fetched appointments:", initialPatients);
        const doctorId=initialPatients[0]?.doctorId;
        console.log("Doctor ID:", doctorId);
          //Getting today's date in YYYY-MM-DD format by ...
        //"2025-06-26T05:04:23.456Z" gets by toISOString() 
        // ["2025-06-26", "05:04:23.456Z"] gets by split('T') then we take the first paart [0] i.e, date ...
        const today = new Date().toISOString().split("T")[0];
        const todayList = initialPatients.filter((p) => p.date === today);
        const futureList = initialPatients.filter((p) => p.date > today);
        setTodayAppointments(todayList);
        setFutureAppointments(futureList);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleVirtualCardClick = (doctorId,patientId) => {

    navigate(`/api/chat/${doctorId}-${patientId}`);
  };

  const handleScheduleCardClick = (patient) => {
    //In place of alert, you can navigate to a detailed view of the appointment
    alert(
      `Appointment Details:\n\nName: ${patient.patientId.name}\nDate: ${patient.date}\nTime: ${patient.time}\nProblem: ${patient.problem}`
    );
  };


  //copied from chat Gpt 
  const renderCard = (patient, isVirtual = false) => {
  // guard clause: skip rendering if patientId is not populated
  if (!patient?.patientId || !patient?.patientId?.name) return null;

  return (
    <div
      key={patient._id}
      style={{
        ...styles.card,
        backgroundColor: consultedIds.includes(patient._id) ? "#e0ffe0" : "#fff",
        border: consultedIds.includes(patient._id) ? "2px solid #4caf50" : "1px solid #ddd",
      }}
      onClick={() =>
        isVirtual ? handleVirtualCardClick(patient.doctorId, patient.patientId._id) : handleScheduleCardClick(patient)
      }
      title={isVirtual ? "Click to begin consultation" : "View appointment details"}
    >
      <div>
        <span style={styles.cardLabel}>Name:</span> {patient.patientId.name}
      </div>
      <div>
        <span style={styles.cardLabel}>Date:</span> {patient.date}
      </div>
      <div>
        <span style={styles.cardLabel}>Time:</span> {patient.time}
      </div>
      <div>
        <span style={styles.cardLabel}>Problem:</span> {patient.problem}
      </div>
    </div>
  );
};


  return (
    <div style={styles.container}>
      <div style={styles.virtualHall}>
        <h2>Virtual Waiting Hall</h2>
        <p style={styles.title}>Today's Appointments (Ready for Consultation)</p>
        {todayAppointments.length > 0 ? (
          todayAppointments.map((patient) => renderCard(patient, true))
        ) : (
          <p>No patients in waiting today</p>
        )}
      </div>

      <div style={styles.schedules}>
        <h2>Schedules</h2>

        <p style={styles.title}>Present Appointments:</p>
        {todayAppointments.length > 0 ? (
          todayAppointments.map((patient) => renderCard(patient, false))
        ) : (
          <p>No present appointments</p>
        )}

        <p style={styles.title}>Future Appointments:</p>
        {futureAppointments.length > 0 ? (
          futureAppointments.map((patient) => renderCard(patient, false))
        ) : (
          <p>No future appointments</p>
        )}
      </div>
    </div>
  );
};

export default DOnlineConsultation;
