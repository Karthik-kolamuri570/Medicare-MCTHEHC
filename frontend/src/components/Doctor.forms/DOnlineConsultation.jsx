// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const styles = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "stretch",
//     padding: "150px",
//     gap: "40px",
//     backgroundColor: "#fdfdfd",
//     minHeight: "800px",
//     boxSizing: "border-box",
//   },
//   virtualHall: {
//     border: "3px solid black",
//     borderRadius: "20px",
//     padding: "30px",
//     width: "650px",
//     height: "auto",
//     backgroundColor: "#f4f4f4",
//     boxShadow: "2px 2px 5px #ccc",
//   },
//   schedules: {
//     border: "3px solid black",
//     borderRadius: "20px",
//     padding: "30px",
//     width: "100%",
//     height: "auto",
//     backgroundColor: "#fff",
//     boxShadow: "2px 2px 5px #ccc",
//   },
//   title: {
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     marginTop: "30px",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: "10px",
//     padding: "12px 16px",
//     marginBottom: "12px",
//     boxShadow: "0 1px 6px rgba(0, 0, 0, 0.06)",
//     fontSize: "0.9rem",
//     lineHeight: "1.4",
//     border: "1px solid #ddd",
//     cursor: "pointer",
//     transition: "transform 0.15s ease, box-shadow 0.15s ease",
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   cardLabel: {
//     fontWeight: "600",
//     color: "#333",
//     marginRight: "5px",
//     display: "inline-block",
//     minWidth: "80px",
//   },
// };

// const DOnlineConsultation = () => {
//   const navigate = useNavigate();
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [futureAppointments, setFutureAppointments] = useState([]);
//   const [consultedIds, setConsultedIds] = useState([]);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:1600/api/doctor/accepted-appointments",
//           {
//             withCredentials: true, // Important if using cookies/session
//           }
//         );
//         const initialPatients = response.data.data;
//         console.log("Fetched appointments:", initialPatients);
//         const doctorId = initialPatients[0]?.doctorId;
//         console.log("Doctor ID:", doctorId);
//         //Getting today's date in YYYY-MM-DD format by ...
//         //"2025-06-26T05:04:23.456Z" gets by toISOString()
//         // ["2025-06-26", "05:04:23.456Z"] gets by split('T') then we take the first paart [0] i.e, date ...
//         const today = new Date().toISOString().split("T")[0];
//         const todayList = initialPatients.filter((p) => p.date === today);
//         const futureList = initialPatients.filter((p) => p.date > today);
//         setTodayAppointments(todayList);
//         setFutureAppointments(futureList);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const handleVirtualCardClick = (doctorId, patientId) => {
//     navigate(`/api/chat/${doctorId}-${patientId}`);
//   };

//   const handleScheduleCardClick = (patient) => {
//     //In place of alert, you can navigate to a detailed view of the appointment
//     alert(
//       `Appointment Details:\n\nName: ${patient.patientId.name}\nDate: ${patient.date}\nTime: ${patient.time}\nProblem: ${patient.problem}`
//     );
//   };

//   //copied from chat Gpt
//   const renderCard = (patient, isVirtual = false) => {
//     // guard clause: skip rendering if patientId is not populated
//     if (!patient?.patientId || !patient?.patientId?.name) return null;

//     return (
//       <div
//         key={patient._id}
//         style={{
//           ...styles.card,
//           backgroundColor: consultedIds.includes(patient._id)
//             ? "#e0ffe0"
//             : "#fff",
//           border: consultedIds.includes(patient._id)
//             ? "2px solid #4caf50"
//             : "1px solid #ddd",
//         }}
//         onClick={() =>
//           isVirtual
//             ? handleVirtualCardClick(patient.doctorId, patient.patientId._id)
//             : handleScheduleCardClick(patient)
//         }
//         title={
//           isVirtual ? "Click to begin consultation" : "View appointment details"
//         }
//       >
//         <div>
//           <span style={styles.cardLabel}>Name:</span> {patient.patientId.name}
//         </div>
//         <div>
//           <span style={styles.cardLabel}>Date:</span> {patient.date}
//         </div>
//         <div>
//           <span style={styles.cardLabel}>Time:</span> {patient.time}
//         </div>
//         <div>
//           <span style={styles.cardLabel}>Problem:</span> {patient.problem}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.virtualHall}>
//         <h2>Virtual Waiting Hall</h2>
//         <p style={styles.title}>
//           Today's Appointments (Ready for Consultation)
//         </p>
//         {todayAppointments.length > 0 ? (
//           todayAppointments.map((patient) => renderCard(patient, true))
//         ) : (
//           <p>No patients in waiting today</p>
//         )}
//       </div>

//       <div style={styles.schedules}>
//         <h2>Schedules</h2>

//         <p style={styles.title}>Present Appointments:</p>
//         {todayAppointments.length > 0 ? (
//           todayAppointments.map((patient) => renderCard(patient, false))
//         ) : (
//           <p>No present appointments</p>
//         )}

//         <p style={styles.title}>Future Appointments:</p>
//         {futureAppointments.length > 0 ? (
//           futureAppointments.map((patient) => renderCard(patient, false))
//         ) : (
//           <p>No future appointments</p>
//         )}
//       </div>
//     </div>
//   );
// };
// export default DOnlineConsultation;














import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    padding: "150px",
    gap: "40px",
    backgroundColor: "#fdfdfd",
    minHeight: "800px",
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
    const fetchData = async () => {
      try {
        const [appointmentsRes, secondOpinionsRes] = await Promise.all([
          axios.get("http://localhost:1600/api/doctor/accepted-appointments", {
            withCredentials: true,
          }),
          axios.get("http://localhost:1600/api/doctor/get-second-opinion/accept", {
            withCredentials: true,
          }),
        ]);

        // Mark each entry with isSecondOpinion flag
        console.log("Getting Second Opinion Data:", secondOpinionsRes.data.data);
        const appointments = appointmentsRes.data.data.map((item) => ({
          ...item,
          isSecondOpinion: false,
        }));

        const secondOpinions = secondOpinionsRes.data.data.map((item) => ({
          ...item,
          isSecondOpinion: true,
        }));

        const today = new Date().toISOString().split("T")[0];

        // Combine and filter by today's date and future dates
        const todayList = [...appointments, ...secondOpinions].filter(
          (p) => (p.date ? p.date.split("T")[0] : p.date) === today
        );
        const futureList = [...appointments, ...secondOpinions].filter(
          (p) => (p.date ? p.date.split("T")[0] : p.date) > today
        );

        setTodayAppointments(todayList);
        setFutureAppointments(futureList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVirtualCardClick = (doctorId, patientId) => {
    navigate(`/api/chat/${doctorId}-${patientId}`);
  };

  const handleScheduleCardClick = (patient) => {
    const patientName =
      typeof patient.patientId === "object" && patient.patientId !== null
        ? patient.patientId.name
        : `(Patient ID: ${patient.patientId})`;

    alert(
      `Appointment Details:\n\nName: ${patientName}\nDate: ${
        patient.date ? patient.date.split("T")[0] : patient.date
      }\nTime: ${patient.time}\nProblem: ${patient.problem}`
    );
  };

  const renderCard = (patient, isVirtual = false) => {
    if (!patient?.patientId) return null;

    const patientName =
      typeof patient.patientId === "object" && patient.patientId !== null
        ? patient.patientId.name
        : `(Patient ID: ${patient.patientId})`;

    if (!patientName) return null;

    const dateString = patient.date ? patient.date.split("T")[0] : patient.date;

    return (
      <div
        key={patient._id}
        style={{
          ...styles.card,
          backgroundColor: consultedIds.includes(patient._id)
            ? patient.isSecondOpinion
              ? "#e1f5fe"
              : "#e0ffe0"
            : patient.isSecondOpinion
            ? "#f0f9ff"
            : "#fff",
          border: consultedIds.includes(patient._id)
            ? patient.isSecondOpinion
              ? "2px solid #0288d1"
              : "2px solid #4caf50"
            : patient.isSecondOpinion
            ? "2px dashed #0288d1"
            : "1px solid #ddd",
        }}
        onClick={() =>
          isVirtual
            ? handleVirtualCardClick(
                patient.doctorId,
                typeof patient.patientId === "object"
                  ? patient.patientId._id
                  : patient.patientId
              )
            : handleScheduleCardClick(patient)
        }
        title={
          isVirtual
            ? patient.isSecondOpinion
              ? "Click to begin second opinion consultation"
              : "Click to begin consultation"
            : "View appointment details"
        }
      >
        <div>
          <span style={styles.cardLabel}>Name:</span> {patientName}
        </div>
        <div>
          <span style={styles.cardLabel}>Date:</span> {dateString}
        </div>
        <div>
          <span style={styles.cardLabel}>Time:</span> {patient.time}
        </div>
        <div>
          <span style={styles.cardLabel}>Problem:</span> {patient.problem}
        </div>
        {patient.isSecondOpinion && (
          <div style={{ fontWeight: "600", color: "#0288d1" }}>Second Opinion</div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.virtualHall}>
        <h2>Virtual Waiting Hall</h2>
        <p style={styles.title}>Today's Appointments (Ready for Consultation)</p>
        {todayAppointments.length > 0 ? (
          todayAppointments.map((p) => renderCard(p, true))
        ) : (
          <p>No patients in waiting today</p>
        )}
      </div>

      <div style={styles.schedules}>
        <h2>Schedules</h2>

        <p style={styles.title}>Present Appointments:</p>
        {todayAppointments.length > 0 ? (
          todayAppointments.map((p) => renderCard(p, false))
        ) : (
          <p>No present appointments</p>
        )}

        <p style={styles.title}>Future Appointments:</p>
        {futureAppointments.length > 0 ? (
          futureAppointments.map((p) => renderCard(p, false))
        ) : (
          <p>No future appointments</p>
        )}
      </div>
    </div>
  );
};

export default DOnlineConsultation;

































































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // Icons
// const VideoIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
//   </svg>
// );

// const CalendarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const ClockIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const StethoscopeIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 717.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
//   </svg>
// );

// const EyeIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const DOnlineConsultation = () => {
//   const navigate = useNavigate();
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [futureAppointments, setFutureAppointments] = useState([]);
//   const [consultedIds, setConsultedIds] = useState([]);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const styles = `
//     .consultation-container {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       min-height: 100vh;
//       padding: 2rem 1rem;
//       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//       margin-top: 70px;
//     }

//     .header-section {
//       text-align: center;
//       color: white;
//       margin-bottom: 3rem;
//     }

//     .main-title {
//       font-size: 2.5rem;
//       font-weight: 800;
//       margin-bottom: 0.5rem;
//       text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//     }

//     .subtitle {
//       font-size: 1.1rem;
//       opacity: 0.9;
//       font-weight: 400;
//     }

//     .content-wrapper {
//       display: flex;
//       gap: 2rem;
//       max-width: 1400px;
//       margin: 0 auto;
//       align-items: flex-start;
//     }

//     .virtual-hall {
//       flex: 1;
//       background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
//       border-radius: 20px;
//       padding: 2rem;
//       box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       backdrop-filter: blur(10px);
//       position: relative;
//       overflow: hidden;
//     }

//     .virtual-hall::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       height: 4px;
//       background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
//       background-size: 200% 100%;
//       animation: shimmer 3s ease-in-out infinite;
//     }

//     @keyframes shimmer {
//       0%, 100% { background-position: 0% 0%; }
//       50% { background-position: 100% 0%; }
//     }

//     .schedules-section {
//       flex: 1;
//       background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
//       border-radius: 20px;
//       padding: 2rem;
//       box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       backdrop-filter: blur(10px);
//       max-height: 80vh;
//       overflow-y: auto;
//     }

//     .section-title {
//       font-size: 1.8rem;
//       font-weight: 700;
//       color: #1e293b;
//       margin-bottom: 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//     }

//     .section-subtitle {
//       font-size: 1.2rem;
//       font-weight: 600;
//       color: #475569;
//       margin: 2rem 0 1rem 0;
//       padding-bottom: 0.5rem;
//       border-bottom: 2px solid #e2e8f0;
//       position: relative;
//     }

//     .section-subtitle::after {
//       content: '';
//       position: absolute;
//       bottom: -2px;
//       left: 0;
//       width: 60px;
//       height: 2px;
//       background: linear-gradient(90deg, #667eea, #764ba2);
//     }

//     .appointment-card {
//       background: white;
//       border-radius: 16px;
//       padding: 1.5rem;
//       margin-bottom: 1rem;
//       box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
//       border: 2px solid transparent;
//       cursor: pointer;
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//       position: relative;
//       overflow: hidden;
//     }

//     .appointment-card::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: -100%;
//       width: 100%;
//       height: 100%;
//       background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
//       transition: left 0.6s;
//     }

//     .appointment-card:hover::before {
//       left: 100%;
//     }

//     .appointment-card:hover {
//       transform: translateY(-5px) scale(1.02);
//       box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
//       border-color: #667eea;
//     }

//     .appointment-card.selected {
//       border-color: #667eea;
//       box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
//       background: linear-gradient(135deg, #f8faff, #ffffff);
//     }

//     .virtual-card {
//       border-left: 5px solid #10b981;
//       background: linear-gradient(135deg, #ecfdf5, #ffffff);
//     }

//     .virtual-card:hover {
//       border-left-color: #059669;
//       box-shadow: 0 15px 35px rgba(16, 185, 129, 0.2);
//     }

//     .second-opinion-card {
//       border-left: 5px solid #3b82f6;
//       background: linear-gradient(135deg, #eff6ff, #ffffff);
//     }

//     .second-opinion-card:hover {
//       border-left-color: #2563eb;
//       box-shadow: 0 15px 35px rgba(59, 130, 246, 0.2);
//     }

//     .consulted-card {
//       opacity: 0.8;
//       background: linear-gradient(135deg, #f0fdf4, #dcfce7);
//       border-left-color: #22c55e;
//     }

//     .card-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-start;
//       margin-bottom: 1rem;
//     }

//     .patient-name {
//       font-size: 1.2rem;
//       font-weight: 700;
//       color: #1e293b;
//       margin-bottom: 0.5rem;
//     }

//     .consultation-badge {
//       padding: 0.5rem 1rem;
//       border-radius: 20px;
//       font-size: 0.75rem;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: white;
//       display: flex;
//       align-items: center;
//       gap: 0.3rem;
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//     }

//     .virtual-badge {
//       background: linear-gradient(135deg, #10b981, #059669);
//     }

//     .second-opinion-badge {
//       background: linear-gradient(135deg, #3b82f6, #2563eb);
//     }

//     .schedule-badge {
//       background: linear-gradient(135deg, #6b7280, #4b5563);
//     }

//     .card-content {
//       display: flex;
//       flex-direction: column;
//       gap: 0.75rem;
//     }

//     .info-row {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//       padding: 0.5rem 0.75rem;
//       background: linear-gradient(135deg, #f8fafc, #f1f5f9);
//       border-radius: 10px;
//       transition: all 0.3s ease;
//     }

//     .info-row:hover {
//       background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
//       transform: translateX(3px);
//     }

//     .info-icon {
//       color: #667eea;
//       flex-shrink: 0;
//     }

//     .info-label {
//       font-weight: 600;
//       color: #475569;
//       min-width: 70px;
//       font-size: 0.85rem;
//     }

//     .info-value {
//       color: #1e293b;
//       font-weight: 500;
//       flex: 1;
//     }

//     .action-button {
//       margin-top: 1rem;
//       padding: 0.75rem 1.5rem;
//       background: linear-gradient(135deg, #667eea, #764ba2);
//       color: white;
//       border: none;
//       border-radius: 12px;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
//     }

//     .action-button:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
//     }

//     .empty-state {
//       text-align: center;
//       padding: 3rem 1rem;
//       color: #64748b;
//       background: linear-gradient(135deg, #f8fafc, #f1f5f9);
//       border-radius: 12px;
//       border: 2px dashed #cbd5e1;
//     }

//     .empty-icon {
//       font-size: 3rem;
//       margin-bottom: 1rem;
//       opacity: 0.7;
//     }

//     .empty-title {
//       font-size: 1.2rem;
//       font-weight: 600;
//       color: #475569;
//       margin-bottom: 0.5rem;
//     }

//     .stats-bar {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     .stat-card {
//       flex: 1;
//       background: linear-gradient(135deg, #ffffff, #f8fafc);
//       padding: 1.5rem;
//       border-radius: 12px;
//       text-align: center;
//       box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
//       border: 1px solid #e2e8f0;
//       transition: transform 0.2s ease;
//     }

//     .stat-card:hover {
//       transform: translateY(-3px);
//     }

//     .stat-number {
//       font-size: 2rem;
//       font-weight: 800;
//       margin-bottom: 0.5rem;
//     }

//     .stat-label {
//       font-size: 0.9rem;
//       color: #64748b;
//       font-weight: 600;
//     }

//     .loading-spinner {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       padding: 4rem;
//     }

//     .spinner {
//       width: 40px;
//       height: 40px;
//       border: 4px solid #e2e8f0;
//       border-top: 4px solid #667eea;
//       border-radius: 50%;
//       animation: spin 1s linear infinite;
//     }

//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }

//     @media (max-width: 1200px) {
//       .content-wrapper {
//         flex-direction: column;
//         gap: 2rem;
//       }
      
//       .schedules-section {
//         max-height: none;
//       }
//     }

//     @media (max-width: 768px) {
//       .consultation-container {
//         padding: 1rem 0.5rem;
//       }
      
//       .virtual-hall,
//       .schedules-section {
//         padding: 1.5rem;
//       }
      
//       .stats-bar {
//         flex-direction: column;
//         gap: 0.5rem;
//       }
//     }
//   `;

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [appointmentsRes, secondOpinionsRes] = await Promise.all([
//           axios.get("http://localhost:1600/api/doctor/accepted-appointments", {
//             withCredentials: true,
//           }),
//           axios.get("http://localhost:1600/api/doctor/get-second-opinion/accept", {
//             withCredentials: true,
//           }),
//         ]);

//         console.log("Getting Second Opinion Data:", secondOpinionsRes.data.data);
//         const appointments = appointmentsRes.data.data.map((item) => ({
//           ...item,
//           isSecondOpinion: false,
//         }));

//         const secondOpinions = secondOpinionsRes.data.data.map((item) => ({
//           ...item,
//           isSecondOpinion: true,
//         }));

//         const today = new Date().toISOString().split("T")[0];

//         const todayList = [...appointments, ...secondOpinions].filter(
//           (p) => (p.date ? p.date.split("T")[0] : p.date) === today
//         );
//         const futureList = [...appointments, ...secondOpinions].filter(
//           (p) => (p.date ? p.date.split("T")[0] : p.date) > today
//         );

//         setTodayAppointments(todayList);
//         setFutureAppointments(futureList);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleVirtualCardClick = (doctorId, patientId) => {
//     navigate(`/api/chat/${doctorId}-${patientId}`);
//   };

//   const handleScheduleCardClick = (patient) => {
//     const patientName =
//       typeof patient.patientId === "object" && patient.patientId !== null
//         ? patient.patientId.name
//         : `(Patient ID: ${patient.patientId})`;

//     alert(
//       `Appointment Details:\n\nName: ${patientName}\nDate: ${
//         patient.date ? patient.date.split("T")[0] : patient.date
//       }\nTime: ${patient.time}\nProblem: ${patient.problem}`
//     );
//   };

//   const renderCard = (patient, isVirtual = false) => {
//     if (!patient?.patientId) return null;

//     const patientName =
//       typeof patient.patientId === "object" && patient.patientId !== null
//         ? patient.patientId.name
//         : `(Patient ID: ${patient.patientId})`;

//     if (!patientName) return null;

//     const dateString = patient.date ? patient.date.split("T")[0] : patient.date;
//     const isConsulted = consultedIds.includes(patient._id);
//     const isSelected = selectedCard === patient._id;

//     return (
//       <div
//         key={patient._id}
//         className={`appointment-card ${
//           isVirtual
//             ? patient.isSecondOpinion
//               ? "second-opinion-card"
//               : "virtual-card"
//             : ""
//         } ${isConsulted ? "consulted-card" : ""} ${isSelected ? "selected" : ""}`}
//         onClick={() => {
//           setSelectedCard(isSelected ? null : patient._id);
//           if (isVirtual) {
//             setTimeout(() => {
//               handleVirtualCardClick(
//                 patient.doctorId,
//                 typeof patient.patientId === "object"
//                   ? patient.patientId._id
//                   : patient.patientId
//               );
//             }, 200);
//           } else {
//             setTimeout(() => handleScheduleCardClick(patient), 200);
//           }
//         }}
//       >
//         <div className="card-header">
//           <div>
//             <h3 className="patient-name">{patientName}</h3>
//           </div>
//           <div
//             className={`consultation-badge ${
//               isVirtual
//                 ? patient.isSecondOpinion
//                   ? "second-opinion-badge"
//                   : "virtual-badge"
//                 : "schedule-badge"
//             }`}
//           >
//             {isVirtual ? <VideoIcon /> : <EyeIcon />}
//             {isVirtual
//               ? patient.isSecondOpinion
//                 ? "Second Opinion"
//                 : "Live Consultation"
//               : "View Details"}
//           </div>
//         </div>

//         <div className="card-content">
//           <div className="info-row">
//             <CalendarIcon className="info-icon" />
//             <span className="info-label">Date:</span>
//             <span className="info-value">{dateString}</span>
//           </div>
          
//           <div className="info-row">
//             <ClockIcon className="info-icon" />
//             <span className="info-label">Time:</span>
//             <span className="info-value">{patient.time}</span>
//           </div>
          
//           <div className="info-row">
//             <StethoscopeIcon className="info-icon" />
//             <span className="info-label">Problem:</span>
//             <span className="info-value">{patient.problem}</span>
//           </div>
//         </div>

//         {isVirtual && (
//           <button className="action-button">
//             <VideoIcon />
//             Start Consultation
//           </button>
//         )}
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <>
//         <style>{styles}</style>
//         <div className="consultation-container">
//           <div className="loading-spinner">
//             <div className="spinner"></div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="consultation-container">
//         <div className="header-section">
//           <h1 className="main-title">Online Consultation Center</h1>
//           <p className="subtitle">Manage your virtual consultations and appointments</p>
//         </div>

//         <div className="content-wrapper">
//           <div className="virtual-hall">
//             <h2 className="section-title">
//               <VideoIcon />
//               Virtual Waiting Hall
//             </h2>
            
//             <div className="stats-bar">
//               <div className="stat-card">
//                 <div className="stat-number" style={{ color: "#10b981" }}>
//                   {todayAppointments.filter(a => !a.isSecondOpinion).length}
//                 </div>
//                 <div className="stat-label">Regular Consultations</div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-number" style={{ color: "#3b82f6" }}>
//                   {todayAppointments.filter(a => a.isSecondOpinion).length}
//                 </div>
//                 <div className="stat-label">Second Opinions</div>
//               </div>
//             </div>

//             <p className="section-subtitle">Ready for Consultation</p>
//             {todayAppointments.length > 0 ? (
//               todayAppointments.map((p) => renderCard(p, true))
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">👨‍⚕️</div>
//                 <h3 className="empty-title">No Patients Waiting</h3>
//                 <p>All consultations for today are complete</p>
//               </div>
//             )}
//           </div>

//           <div className="schedules-section">
//             <h2 className="section-title">
//               <CalendarIcon />
//               Appointment Schedule
//             </h2>

//             <p className="section-subtitle">Today's Appointments</p>
//             {todayAppointments.length > 0 ? (
//               todayAppointments.map((p) => renderCard(p, false))
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">📅</div>
//                 <h3 className="empty-title">No Appointments Today</h3>
//                 <p>Your schedule is clear for today</p>
//               </div>
//             )}

//             <p className="section-subtitle">Upcoming Appointments</p>
//             {futureAppointments.length > 0 ? (
//               futureAppointments.map((p) => renderCard(p, false))
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">🗓️</div>
//                 <h3 className="empty-title">No Future Appointments</h3>
//                 <p>No appointments scheduled</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DOnlineConsultation;
