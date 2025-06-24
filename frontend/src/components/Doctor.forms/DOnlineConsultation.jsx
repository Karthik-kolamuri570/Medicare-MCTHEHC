import React, { useState } from "react";

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
  // card: {
  //   backgroundColor: "#ffffff",
  //   borderRadius: "12px",
  //   padding: "20px",
  //   marginBottom: "20px",
  //   boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
  //   fontSize: "0.95rem",
  //   lineHeight: "1.6",
  //   border: "1px solid #e0e0e0",
  //   cursor: "pointer",
  //   transition: "transform 0.2s ease, box-shadow 0.2s ease",
  //   display: "flex",
  //   flexDirection: "column",
  //   gap: "6px",
  // },
  // cardLabel: {
  //   fontWeight: "600",
  //   color: "#37474f",
  //   marginRight: "5px",
  //   display: "inline-block",
  //   minWidth: "90px",
  // },
  card: {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '12px 16px',
  marginBottom: '12px',
  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.06)',
  fontSize: '0.9rem',
  lineHeight: '1.4',
  border: '1px solid #ddd',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
},

cardLabel: {
  fontWeight: '600',
  color: '#333',
  marginRight: '5px',
  display: 'inline-block',
  minWidth: '80px'
}

};

const initialPatients = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2025-06-24",
    time: "10:00 AM",
    problem: "Fever and headache",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2025-06-24",
    time: "10:30 AM",
    problem: "Skin rash",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    date: "2025-06-24",
    time: "11:00 AM",
    problem: "Back pain",
  },
];

const DOnlineConsultation = () => {
  const [presentIds, setPresentIds] = useState([]);

  const handleCardClick = (id) => {
    if (!presentIds.includes(id)) {
      setPresentIds([...presentIds, id]);
    }
  };

  const presentPatients = initialPatients.filter((p) =>
    presentIds.includes(p.id)
  );
  const futurePatients = initialPatients.filter(
    (p) => !presentIds.includes(p.id)
  );

  const renderCard = (patient, isClickable = true) => (
    <div
      key={patient.id}
      style={styles.card}
      onClick={isClickable ? () => handleCardClick(patient.id) : undefined}
      title={isClickable ? "Click to mark as Present" : ""}
    >
      <div>
        <span style={styles.cardLabel}>Name:</span> {patient.patientName}
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

  return (
    <div style={styles.container}>
      <div style={styles.virtualHall}>
        <h2>Virtual Waiting Hall</h2>
        <p style={styles.title}>Click to move to Present Appointments</p>
        {initialPatients.map((patient) => renderCard(patient))}
      </div>

      <div style={styles.schedules}>
        <h2>Schedules</h2>

        <p style={styles.title}>Present Appointments:</p>
        {presentPatients.length ? (
          presentPatients.map((p) => renderCard(p, false))
        ) : (
          <p>None yet</p>
        )}

        <p style={styles.title}>Future Appointments:</p>
        {futurePatients.length ? (
          futurePatients.map((p) => renderCard(p, false))
        ) : (
          <p>None remaining</p>
        )}
      </div>
    </div>
  );
};

export default DOnlineConsultation;
