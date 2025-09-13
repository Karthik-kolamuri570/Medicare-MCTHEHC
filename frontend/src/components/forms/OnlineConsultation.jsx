
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OnlineConsultation = () => {
  const [appointments, setAppointments] = useState([]);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, secondOpinionsRes] = await Promise.all([
          axios.get("http://localhost:1600/api/patient/appointments", { withCredentials: true }),
          axios.get("http://localhost:1600/api/patient/get-second-opinion/accepted", { withCredentials: true }),
        ]);
        setAppointments([
          ...appointmentsRes.data.data.map(item => ({ ...item, isSecondOpinion: false })),
          ...secondOpinionsRes.data.data.map(item => ({ ...item, isSecondOpinion: true })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleStartChat = (pid, did) => {
    navigate(`/api/chat/${did}-${pid}`);
  };

  // --- UI STYLES ONLY ---
  const outerDiv = {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #e0e7ff 10%, #f7fbff 90%)",
    padding: "32px 0"
  };
  const container = {
    padding: "1rem",
    maxWidth: 1200,
    margin: "0 auto"
  };
  const header = {
    fontSize: "2.3rem",
    fontWeight: 800,
    color: "#18357B",
    margin: "1.5rem 0 2rem 0",
    textAlign: "left",
    letterSpacing: 1
  };
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "2.4rem"
  };
  const frosted = "rgba(255,255,255,0.82)";
  const cardBase = {
    position: "relative",
    borderRadius: "22px",
    background: frosted,
    backdropFilter: "blur(4px)",
    border: "1.5px solid #e0e5ef",
    boxShadow: "0 8px 36px 0 rgba(34,70,160,0.11)",
    padding: "30px 20px 25px 20px",
    transition: "transform 0.22s cubic-bezier(.27,.92,.24,1.12), box-shadow .18s",
    overflow: "hidden",
    willChange: "transform, box-shadow",
    cursor: "pointer",
    paddingTop: "50px" // Added padding top to reserve space for badge
  };
  const cardHover = {
    transform: "scale(1.035) translateY(-7px)",
    boxShadow: "0 18px 54px 0 #295bffa1"
  };
  const badgeStyle = (isSecond) => ({
    position: "absolute",
    top: 12, // moved higher inside padding-top
    right: 20,
    zIndex: 2,
    padding: "5px 18px",
    background: isSecond ? "linear-gradient(90deg,#ffe6eb 70%,#fff6fa 100%)" : "linear-gradient(90deg,#eafff6 70%,#ebfefc 100%)",
    color: isSecond ? "#ea225a" : "#27bb8c",
    borderRadius: 40,
    fontWeight: 800,
    fontSize: 15,
    letterSpacing: ".5px",
    boxShadow: "0 1px 7px 0 #ff567016",
    border: isSecond ? "1px solid #ffb4cd" : "1.5px solid #aaffd4"
  });
  const avatar = {
    width: 70,
    height: 70,
    fontSize: 36,
    fontWeight: 900,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#eaf6ff 80%,#d9def9 100%)",
    color: "#295bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 22,
    boxShadow: "0 2px 8px #a6beff13"
  };
  const name = { fontWeight: 800, fontSize: 22, color: "#214085", letterSpacing: ".6px" };
  const spec = { color: "#5c6f8c", fontWeight: 500, marginBottom: 11, fontSize: 16 };
  const info = { fontSize: 16.3, color: "#354159", marginBottom: 7.7, fontWeight: 600 };
  const infoAccent = { color: "#083d90", fontWeight: 800, marginRight: 5 };
  const button = {
    marginTop: 13,
    padding: "11px 30px",
    background: "linear-gradient(90deg,#2657d9 85%,#09e7cf 130%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    letterSpacing: ".8px",
    fontWeight: 800,
    fontSize: 17.2,
    outline: "none",
    boxShadow: "0 2px 13px 0 #80b8fb20,0 1px 6px 0 #00ffe411",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    transition: "background .12s, transform .09s"
  };

  return (
    <div style={outerDiv}>
      <div style={container}>
        <h2 style={header}>My Consultations</h2>
        {appointments.length === 0 ? (
          <p style={{ color: "#254", fontWeight: 600, fontSize: "1.2rem" }}>No appointments found</p>
        ) : (
          <div style={grid}>
            {appointments.map(appt => (
              <div
                key={appt._id}
                style={hovered === appt._id
                  ? { ...cardBase, ...cardHover, border: appt.isSecondOpinion ? "2.5px solid #ffb4cd" : "2.5px solid #aaffd9" }
                  : { ...cardBase, border: appt.isSecondOpinion ? "2.5px solid #ffb4cd" : "2.5px solid #aaffd9" }
                }
                onMouseEnter={() => setHovered(appt._id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span style={badgeStyle(appt.isSecondOpinion)}>
                  {appt.isSecondOpinion ? "Second Opinion" : "Appointment"}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 6 }}>
                  <div style={avatar}>{appt.doctorId?.name?.[0]?.toUpperCase() || "D"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={name}>{appt.doctorId?.name}</div>
                    <div style={spec}>{appt.doctorId?.specialization || "Doctor"}</div>
                  </div>
                </div>
                <div style={info}><span style={infoAccent}>Date:</span> {appt.date}</div>
                <div style={info}><span style={infoAccent}>Time:</span> {appt.time}</div>
                <button
                  onClick={() => handleStartChat(appt.patientId, appt.doctorId._id)}
                  style={button}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <span role="img" aria-label="chat">💬</span>
                  Start Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineConsultation;
