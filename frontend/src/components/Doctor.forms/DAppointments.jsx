// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Loader from '../ui/Loader';  // Assuming this is your loading spinner component

// function DAppointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false); // <-- Loading state

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);  // Start loading
//       try {
//         const response = await axios.get("http://localhost:1600/api/doctor/appointments/");
//         const data = response.data.data;
//         console.log("Fetched Appointments:", data);
//         toast.success("Appointments fetched successfully!");
//         setAppointments(data);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//         toast.error("Failed to fetch appointments");
//       } finally {
//         setLoading(false);  // Stop loading
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const acceptResponse = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:1600/api/doctor/accept-appointment/${id}`);

//       const result = response.data;
//       if (result.success) {
//         const updated = result.data;
//         setAppointments((prev) =>
//           prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
//         );
//         toast.success("Appointment accepted successfully!");
//         console.log("✅ Appointment accepted:", updated);
//       } else {
//         toast.error("Failed to accept appointment: " + result.message);
//         console.warn("⚠️ Could not accept appointment:", result.message);
//       }
//     } catch (error) {
//       console.error("Error accepting appointment:", error);
//       toast.error("Error accepting appointment");
//     }
//   };

//   const rejectResponse = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:1600/api/doctor/reject-appointment/${id}`);
//       const result = response.data;
//       if (result.success) {
//         const updated = result.data;
//         setAppointments((prev) =>
//           prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
//         );
//         toast.success("Appointment rejected successfully!");
//         console.log("❌ Appointment rejected", updated);
//       } else {
//         toast.error("Failed to reject appointment: " + result.message);
//         console.warn("⚠️ Could not reject appointment:", result.message);
//       }
//     } catch (error) {
//       console.error("Error rejecting appointment:", error);
//       toast.error("Error rejecting appointment");
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "600px",
//         backgroundColor: "#f8f9fa",
//       }}
//     >
//       <div style={{ padding: "6rem", width: "600px" }}>
//         <h2 style={{ marginBottom: "1.5rem" }}>Appointments</h2>
        
//         {loading ? (
//           <Loader />  // Renders your loading indicator while loading is true
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
//             {appointments.length > 0 ? (
//               appointments.map((appt) => (
//                 <div
//                   key={appt._id}
//                   style={{
//                     border: "1px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "1.5rem",
//                     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   <p>
//                     <strong>Patient Name:</strong> {appt.patientId?.name}
//                   </p>
//                   <p>
//                     <strong>Problem:</strong> {appt.problem}
//                   </p>
//                   <p>
//                     <strong>Availability:</strong> Date: {appt.date} - Time: {appt.time}
//                   </p>
//                   <p>
//                     <strong>Mode:</strong> Online
//                   </p>
//                   <p>
//                     <strong>Phone or Email:</strong> {appt.patientId?.email}
//                   </p>
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     <span
//                       style={{
//                         color: appt.status === "Accepted" ? "green" : "orange",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {appt.status}
//                     </span>
//                   </p>

//                   {appt.status === "Pending" && (
//                     <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
//                       <button
//                         style={{
//                           padding: "0.5rem 1rem",
//                           backgroundColor: "#28a745",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "5px",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => acceptResponse(appt._id)}
//                       >
//                         Accept
//                       </button>
//                       <button
//                         style={{
//                           padding: "0.5rem 1rem",
//                           backgroundColor: "#dc3545",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "5px",
//                           cursor: "pointer",
//                         }}
//                         onClick={() => rejectResponse(appt._id)}
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p style={{ color: "#666", textAlign: "center" }}>No appointments available.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DAppointments;










































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { formatDistanceToNow, format } from "date-fns";
// import Loader from '../ui/Loader';

// // Icons
// const CheckIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );

// const XMarkIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );

// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

// const EmailIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
//   </svg>
// );

// const HistoryIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const SearchIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 115.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//   </svg>
// );

// function DAppointments() {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCard, setSelectedCard] = useState(null);

//   // Helper function to check if appointment date is in present/future
//   const isPresentOrFuture = (dateString, timeString) => {
//     if (!dateString) return true;
//     try {
//       const appointmentDateTime = new Date(`${dateString}T${timeString || '00:00'}`);
//       const now = new Date();
//       return appointmentDateTime >= now;
//     } catch {
//       return true;
//     }
//   };

//   const styles = `
//     .appointments-container {
//       background: #ffffff;
//       min-height: 100vh;
//       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//       margin-top: 70px;
//       padding: 1rem;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     .header-section {
//       background: #ffffff;
//       border-bottom: 1px solid #e5e7eb;
//       padding: 1.5rem;
//       margin-bottom: 1.5rem;
//       text-align: center;
//       width: 100%;
//       max-width: 1200px;
//     }

//     .title-modern {
//       font-size: 2rem;
//       font-weight: 700;
//       color: #111827;
//       margin-bottom: 0.5rem;
//     }

//     .subtitle-modern {
//       font-size: 1rem;
//       color: #6b7280;
//       font-weight: 500;
//     }

//     .controls-wrapper {
//       width: 100%;
//       max-width: 1200px;
//       margin-bottom: 2rem;
//     }

//     .controls-bar {
//       display: flex;
//       gap: 1rem;
//       align-items: center;
//       margin-bottom: 1.5rem;
//       flex-wrap: wrap;
//       justify-content: center;
//     }

//     .search-container {
//       position: relative;
//       flex: 1;
//       min-width: 280px;
//       max-width: 420px;
//     }

//     .search-input {
//       width: 100%;
//       padding: 0.875rem 1.25rem 0.875rem 3.25rem;
//       border: 2px solid #e2e8f0;
//       border-radius: 50px;
//       font-size: 0.95rem;
//       background: #ffffff;
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
//       font-weight: 500;
//       color: #374151;
//       outline: none;
//     }

//     .search-input:hover {
//       border-color: #cbd5e1;
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//       transform: translateY(-1px);
//     }

//     .search-input:focus {
//       border-color: #3b82f6;
//       box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 6px 20px rgba(59, 130, 246, 0.08);
//       transform: translateY(-2px);
//       background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
//     }

//     .search-input::placeholder {
//       color: #9ca3af;
//       font-weight: 400;
//     }

//     .search-icon {
//       position: absolute;
//       left: 1rem;
//       top: 50%;
//       transform: translateY(-50%);
//       color: #9ca3af;
//       pointer-events: none;
//       width: 1.25rem;
//       height: 1.25rem;
//       transition: all 0.3s ease;
//     }

//     .search-container:hover .search-icon {
//       color: #6b7280;
//     }

//     .search-input:focus ~ .search-icon {
//       color: #3b82f6;
//     }

//     .filter-buttons {
//       display: flex;
//       gap: 0.5rem;
//       background: #f9fafb;
//       padding: 0.5rem;
//       border-radius: 8px;
//       border: 1px solid #e5e7eb;
//     }

//     .filter-btn {
//       font-weight: 600;
//       padding: 0.5rem 1rem;
//       border-radius: 6px;
//       color: #6b7280;
//       cursor: pointer;
//       border: none;
//       background: transparent;
//       transition: all 0.2s ease;
//       font-size: 0.9rem;
//       display: flex;
//       align-items: center;
//       gap: 0.3rem;
//     }

//     .filter-btn.active {
//       background: #3b82f6;
//       color: white;
//     }

//     .filter-btn:hover:not(.active) {
//       background: #e5e7eb;
//       color: #374151;
//     }

//     .stats-bar {
//       display: flex;
//       gap: 1rem;
//       margin-bottom: 1.5rem;
//       flex-wrap: wrap;
//       justify-content: center;
//       width: 100%;
//       max-width: 1200px;
//     }

//     .stat-card {
//       background: white;
//       padding: 1.5rem;
//       border-radius: 8px;
//       border: 1px solid #e5e7eb;
//       flex: 1;
//       min-width: 150px;
//       max-width: 200px;
//       text-align: center;
//       box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//       transition: transform 0.2s ease;
//     }

//     .stat-card:hover {
//       transform: translateY(-2px);
//     }

//     .stat-number {
//       font-size: 1.8rem;
//       font-weight: 700;
//       margin-bottom: 0.5rem;
//     }

//     .stat-label {
//       font-weight: 600;
//       color: #6b7280;
//       font-size: 0.9rem;
//     }

//     .appointments-grid {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 1.5rem;
//       width: 100%;
//       max-width: 1200px;
//       justify-content: center;
//     }

//     .appointment-card {
//       flex: 0 0 calc(33.333% - 1rem);
//       min-width: 320px;
//       max-width: 400px;
//       background: white;
//       border: 1px solid #e5e7eb;
//       border-radius: 12px;
//       padding: 1.5rem;
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
//       transition: all 0.3s ease;
//       cursor: pointer;
//       position: relative;
//       overflow: hidden;
//     }

//     .appointment-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//       border-color: #3b82f6;
//     }

//     .appointment-card.selected {
//       border-color: #3b82f6;
//       box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//     }

//     .appointment-card.past-appointment {
//       opacity: 0.8;
//       border-left: 4px solid #6b7280;
//     }

//     .card-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-start;
//       margin-bottom: 1rem;
//     }

//     .patient-info h3 {
//       font-size: 1.2rem;
//       font-weight: 700;
//       color: #111827;
//       margin: 0 0 0.5rem 0;
//     }

//     .created-time {
//       font-size: 0.75rem;
//       color: #6b7280;
//       display: flex;
//       align-items: center;
//       gap: 0.3rem;
//       background: #f3f4f6;
//       padding: 0.25rem 0.5rem;
//       border-radius: 12px;
//     }

//     .status-badge {
//       padding: 0.4rem 0.8rem;
//       font-size: 0.75rem;
//       font-weight: 600;
//       border-radius: 20px;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//       color: white;
//     }

//     .status-pending {
//       background: linear-gradient(135deg, #f59e0b, #eab308);
//     }

//     .status-accepted {
//       background: linear-gradient(135deg, #10b981, #059669);
//     }

//     .status-rejected {
//       background: linear-gradient(135deg, #ef4444, #dc2626);
//     }

//     .card-content {
//       display: flex;
//       flex-direction: column;
//       gap: 0.75rem;
//       margin-bottom: 1rem;
//     }

//     .info-row {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//       padding: 0.6rem 0.8rem;
//       background: #f8fafc;
//       border-radius: 8px;
//       transition: background-color 0.2s ease;
//     }

//     .info-row:hover {
//       background: #f1f5f9;
//     }

//     .info-icon {
//       color: #3b82f6;
//       flex-shrink: 0;
//     }

//     .info-content {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//     }

//     .info-label {
//       font-weight: 600;
//       color: #4b5563;
//       font-size: 0.8rem;
//       margin-bottom: 0.2rem;
//     }

//     .info-value {
//       color: #111827;
//       font-size: 0.9rem;
//       word-break: break-word;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 0.75rem;
//       justify-content: flex-end;
//     }

//     .btn-accept, .btn-reject {
//       padding: 0.6rem 1.2rem;
//       border: none;
//       border-radius: 8px;
//       font-weight: 600;
//       font-size: 0.85rem;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       gap: 0.4rem;
//       transition: all 0.3s ease;
//       flex: 1;
//       justify-content: center;
//     }

//     .btn-accept {
//       background: linear-gradient(135deg, #10b981, #059669);
//       color: white;
//       box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
//     }

//     .btn-accept:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
//     }

//     .btn-reject {
//       background: linear-gradient(135deg, #ef4444, #dc2626);
//       color: white;
//       box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
//     }

//     .btn-reject:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
//     }

//     .empty-state {
//       text-align: center;
//       padding: 4rem 2rem;
//       background: white;
//       border-radius: 12px;
//       border: 2px dashed #d1d5db;
//       color: #6b7280;
//       width: 100%;
//       max-width: 600px;
//     }

//     .empty-icon {
//       font-size: 4rem;
//       margin-bottom: 1rem;
//       opacity: 0.7;
//     }

//     .empty-title {
//       font-size: 1.5rem;
//       font-weight: 600;
//       color: #374151;
//       margin-bottom: 0.5rem;
//     }

//     @media (max-width: 1200px) {
//       .appointment-card {
//         flex: 0 0 calc(50% - 0.75rem);
//       }
//     }

//     @media (max-width: 768px) {
//       .appointment-card {
//         flex: 0 0 100%;
//       }
//       .controls-bar {
//         flex-direction: column;
//         align-items: stretch;
//       }
//       .search-container {
//         max-width: none;
//       }
//       .stats-bar {
//         flex-direction: column;
//       }
//       .stat-card {
//         max-width: none;
//       }
//     }
//   `;

//   const formatDateTime = (date, time) => {
//     if (!date) return "N/A";
//     try {
//       const dateTime = new Date(`${date}T${time || '00:00'}`);
//       return format(dateTime, "dd MMM yyyy, HH:mm") + " IST";
//     } catch {
//       return `${date} ${time || ''}`;
//     }
//   };

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:1600/api/doctor/appointments/");
//         const data = response.data.data;
//         console.log("Fetched Appointments:", data);
//         toast.success("Appointments fetched successfully!");
//         setAppointments(data);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//         toast.error("Failed to fetch appointments");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const acceptResponse = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:1600/api/doctor/accept-appointment/${id}`);
//       const result = response.data;
//       if (result.success) {
//         const updated = result.data;
//         setAppointments((prev) =>
//           prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
//         );
//         toast.success("Appointment accepted successfully!");
//       } else {
//         toast.error("Failed to accept appointment: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error accepting appointment:", error);
//       toast.error("Error accepting appointment");
//     }
//   };

//   const rejectResponse = async (id) => {
//     try {
//       const response = await axios.put(`http://localhost:1600/api/doctor/reject-appointment/${id}`);
//       const result = response.data;
//       if (result.success) {
//         const updated = result.data;
//         setAppointments((prev) =>
//           prev.map((appt) => (appt._id === updated._id ? { ...appt, status: updated.status } : appt))
//         );
//         toast.success("Appointment rejected successfully!");
//       } else {
//         toast.error("Failed to reject appointment: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error rejecting appointment:", error);
//       toast.error("Error rejecting appointment");
//     }
//   };

//   // Filter appointments based on current filter and search term
//   const filteredAppointments = appointments.filter((appt) => {
//     const filMatch = (() => {
//       if (filter === "all") {
//         return isPresentOrFuture(appt.date, appt.time);
//       } else if (filter === "history") {
//         return true;
//       } else {
//         return appt.status.toLowerCase() === filter.toLowerCase() && isPresentOrFuture(appt.date, appt.time);
//       }
//     })();
    
//     const searchMatch = !searchTerm || (
//       appt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       appt.problem?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    
//     return filMatch && searchMatch;
//   });

//   // Calculate stats
//   const stats = {
//     total: filter === "history" ? appointments.length : appointments.filter(a => isPresentOrFuture(a.date, a.time)).length,
//     pending: appointments.filter((a) => a.status.toLowerCase() === "pending" && isPresentOrFuture(a.date, a.time)).length,
//     accepted: appointments.filter((a) => a.status.toLowerCase() === "accepted" && isPresentOrFuture(a.date, a.time)).length,
//     rejected: appointments.filter((a) => a.status.toLowerCase() === "rejected" && isPresentOrFuture(a.date, a.time)).length,
//   };

//   if (loading) return <Loader />;

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="appointments-container">
//         <div className="header-section">
//           <h1 className="title-modern">Appointments</h1>
//           <p className="subtitle-modern">Manage your patient appointments efficiently</p>
//         </div>

//         <div className="controls-wrapper">
//           <div className="controls-bar">
//             <div className="search-container">
//               <SearchIcon className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search patients or problems..."
//                 className="search-input"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="filter-buttons">
//               {[
//                 { key: "all", label: "All", icon: null },
//                 { key: "pending", label: "Pending", icon: null },
//                 { key: "accepted", label: "Accepted", icon: null },
//                 { key: "rejected", label: "Rejected", icon: null },
//                 { key: "history", label: "History", icon: <HistoryIcon /> }
//               ].map((f) => (
//                 <button 
//                   key={f.key} 
//                   className={`filter-btn ${filter === f.key ? "active" : ""}`} 
//                   onClick={() => setFilter(f.key)}
//                 >
//                   {f.icon}
//                   {f.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="stats-bar">
//             <div className="stat-card">
//               <div className="stat-number" style={{ color: "#3b82f6" }}>
//                 {stats.total}
//               </div>
//               <div className="stat-label">{filter === "history" ? "Total Records" : "Current Appointments"}</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-number" style={{ color: "#f59e0b" }}>
//                 {stats.pending}
//               </div>
//               <div className="stat-label">Pending Review</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-number" style={{ color: "#10b981" }}>
//                 {stats.accepted}
//               </div>
//               <div className="stat-label">Accepted</div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-number" style={{ color: "#ef4444" }}>
//                 {stats.rejected}
//               </div>
//               <div className="stat-label">Rejected</div>
//             </div>
//           </div>
//         </div>

//         {filteredAppointments.length > 0 ? (
//           <div className="appointments-grid">
//             {filteredAppointments.map((appt) => {
//               const isPast = !isPresentOrFuture(appt.date, appt.time);
//               return (
//                 <div
//                   key={appt._id}
//                   className={`appointment-card ${selectedCard === appt._id ? "selected" : ""} ${isPast ? "past-appointment" : ""}`}
//                   onClick={() => setSelectedCard(selectedCard === appt._id ? null : appt._id)}
//                 >
//                   <div className="card-header">
//                     <div className="patient-info">
//                       <h3>{appt.patientId?.name || "N/A"}</h3>
//                       <div className="created-time">
//                         <ClockIcon />
//                         {formatDistanceToNow(new Date(appt.createdAt || Date.now()), { addSuffix: true })}
//                       </div>
//                     </div>
//                     <div className={`status-badge status-${appt.status.toLowerCase()}`}>
//                       {appt.status}
//                     </div>
//                   </div>

//                   <div className="card-content">
//                     <div className="info-row">
//                       <UserIcon className="info-icon" />
//                       <div className="info-content">
//                         <div className="info-label">Medical Problem</div>
//                         <div className="info-value">{appt.problem || "N/A"}</div>
//                       </div>
//                     </div>

//                     <div className="info-row">
//                       <CalendarIcon className="info-icon" />
//                       <div className="info-content">
//                         <div className="info-label">Appointment Schedule</div>
//                         <div className="info-value">{formatDateTime(appt.date, appt.time)}</div>
//                       </div>
//                     </div>

//                     <div className="info-row">
//                       <EmailIcon className="info-icon" />
//                       <div className="info-content">
//                         <div className="info-label">Patient Contact</div>
//                         <div className="info-value">{appt.patientId?.email || "N/A"}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {appt.status === "Pending" && !isPast && (
//                     <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
//                       <button
//                         className="btn-reject"
//                         onClick={() => rejectResponse(appt._id)}
//                       >
//                         <XMarkIcon />
//                         Reject
//                       </button>
//                       <button
//                         className="btn-accept"
//                         onClick={() => acceptResponse(appt._id)}
//                       >
//                         <CheckIcon />
//                         Accept
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="empty-state">
//             <div className="empty-icon">📅</div>
//             <h3 className="empty-title">No appointments found</h3>
//             <p>
//               {searchTerm || filter !== "all" 
//                 ? "Try adjusting your search or filter criteria" 
//                 : filter === "history" 
//                   ? "You have no historical appointments"
//                   : "You have no current appointments"
//               }
//             </p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default DAppointments;





















































import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { formatDistanceToNow, format } from "date-fns";
import Loader from '../ui/Loader';

// Icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 115.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

function DAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  // Helper function to check if appointment date is in present/future
  const isPresentOrFuture = (dateString, timeString) => {
    if (!dateString) return true;
    try {
      const appointmentDateTime = new Date(`${dateString}T${timeString || '00:00'}`);
      const now = new Date();
      return appointmentDateTime >= now;
    } catch {
      return true;
    }
  };

  // Helper function to normalize status for comparison
  const normalizeStatus = (status) => {
    if (!status) return '';
    const normalized = status.toString().toLowerCase().trim();
    // Handle common status variations
    if (normalized === 'accepted' || normalized === 'accept') return 'accepted';
    if (normalized === 'rejected' || normalized === 'reject') return 'rejected';
    if (normalized === 'pending') return 'pending';
    return normalized;
  };

  const styles = `
    .appointments-container {
      background: #ffffff;
      min-height: 100vh;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin-top: 70px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .header-section {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      width: 100%;
      max-width: 1200px;
    }

    .title-modern {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
    }

    .subtitle-modern {
      font-size: 1rem;
      color: #6b7280;
      font-weight: 500;
    }

    .controls-wrapper {
      width: 100%;
      max-width: 1200px;
      margin-bottom: 2rem;
    }

    .controls-bar {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .search-container {
      position: relative;
      // flex: 1;
      min-width: 280px;
      max-width: 420px;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1.25rem 0.875rem 3.25rem;
      border: 2px solid #e2e8f0;
      border-radius: 50px;
      font-size: 0.95rem;
      background: #ffffff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      font-weight: 500;
      color: #374151;
      outline: none;
    }

    .search-input:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 6px 20px rgba(59, 130, 246, 0.08);
      transform: translateY(-2px);
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    }

    .search-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      pointer-events: none;
      width: 1.25rem;
      height: 1.25rem;
      transition: all 0.3s ease;
    }

    .search-container:hover .search-icon {
      color: #6b7280;
    }

    .search-input:focus ~ .search-icon {
      color: #3b82f6;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      background: #f9fafb;
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .filter-btn {
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      border: none;
      background: transparent;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .filter-btn.active {
      background: #3b82f6;
      color: white;
    }

    .filter-btn:hover:not(.active) {
      background: #e5e7eb;
      color: #374151;
    }

    .stats-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
      max-width: 1200px;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      flex: 1;
      min-width: 150px;
      max-width: 200px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .appointments-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      width: 100%;
      max-width: 1200px;
      justify-content: center;
    }

    .appointment-card {
      flex: 0 0 calc(33.333% - 1rem);
      min-width: 320px;
      max-width: 400px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .appointment-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      border-color: #3b82f6;
    }

    .appointment-card.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .appointment-card.past-appointment {
      opacity: 0.8;
      border-left: 4px solid #6b7280;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .patient-info h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .created-time {
      font-size: 0.75rem;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .status-badge {
      padding: 0.4rem 0.8rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
    }

    .status-pending {
      background: linear-gradient(135deg, #f59e0b, #eab308);
    }

    .status-accepted {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .status-rejected {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.8rem;
      background: #f8fafc;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .info-row:hover {
      background: #f1f5f9;
    }

    .info-icon {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .info-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-weight: 600;
      color: #4b5563;
      font-size: 0.8rem;
      margin-bottom: 0.2rem;
    }

    .info-value {
      color: #111827;
      font-size: 0.9rem;
      word-break: break-word;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn-accept, .btn-reject {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.3s ease;
      flex: 1;
      justify-content: center;
    }

    .btn-accept {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-accept:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }

    .btn-reject {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .btn-reject:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      border: 2px dashed #d1d5db;
      color: #6b7280;
      width: 100%;
      max-width: 600px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 1200px) {
      .appointment-card {
        flex: 0 0 calc(50% - 0.75rem);
      }
    }

    @media (max-width: 768px) {
      .appointment-card {
        flex: 0 0 100%;
      }
      .controls-bar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-container {
        max-width: none;
      }
      .stats-bar {
        flex-direction: column;
      }
      .stat-card {
        max-width: none;
      }
    }
  `;

  const formatDateTime = (date, time) => {
    if (!date) return "N/A";
    try {
      const dateTime = new Date(`${date}T${time || '00:00'}`);
      return format(dateTime, "dd MMM yyyy, HH:mm") + " IST";
    } catch {
      return `${date} ${time || ''}`;
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:1600/api/doctor/appointments/");
        const data = response.data.data;
        console.log("Fetched Appointments:", data);
        
        // Debug: Log all unique status values
        const statuses = [...new Set(data.map(appt => appt.status))];
        console.log("Unique status values:", statuses);
        
        toast.success("Appointments fetched successfully!");
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
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
      } else {
        toast.error("Failed to accept appointment: " + result.message);
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
      } else {
        toast.error("Failed to reject appointment: " + result.message);
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast.error("Error rejecting appointment");
    }
  };

  // Filter appointments based on current filter and search term
  const filteredAppointments = appointments.filter((appt) => {
    const normalizedApptStatus = normalizeStatus(appt.status);
    
    const filMatch = (() => {
      if (filter === "all") {
        return isPresentOrFuture(appt.date, appt.time);
      } else if (filter === "history") {
        return true;
      } else {
        // For status filtering, check both present/future AND status match
        return normalizedApptStatus === filter && isPresentOrFuture(appt.date, appt.time);
      }
    })();
    
    const searchMatch = !searchTerm || (
      appt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appt.problem?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filMatch && searchMatch;
  });

  // Calculate stats - fixed to use normalized status
  const stats = {
    total: filter === "history" ? appointments.length : appointments.filter(a => isPresentOrFuture(a.date, a.time)).length,
    pending: appointments.filter((a) => normalizeStatus(a.status) === "pending" && isPresentOrFuture(a.date, a.time)).length,
    accepted: appointments.filter((a) => normalizeStatus(a.status) === "accepted" && isPresentOrFuture(a.date, a.time)).length,
    rejected: appointments.filter((a) => normalizeStatus(a.status) === "rejected" && isPresentOrFuture(a.date, a.time)).length,
  };

  if (loading) return <Loader />;

  return (
    <>
      <style>{styles}</style>
      <div className="appointments-container">
        <div className="header-section">
          <h1 className="title-modern">Appointments</h1>
          <p className="subtitle-modern">Manage your patient appointments efficiently</p>
        </div>

        <div className="controls-wrapper">
          <div className="controls-bar">
            <div className="search-container">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search patients or problems..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              {[
                { key: "all", label: "All", icon: null },
                { key: "pending", label: "Pending", icon: null },
                { key: "accepted", label: "Accepted", icon: null },
                { key: "rejected", label: "Rejected", icon: null },
                { key: "history", label: "History", icon: <HistoryIcon /> }
              ].map((f) => (
                <button 
                  key={f.key} 
                  className={`filter-btn ${filter === f.key ? "active" : ""}`} 
                  onClick={() => setFilter(f.key)}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#3b82f6" }}>
                {stats.total}
              </div>
              <div className="stat-label">{filter === "history" ? "Total Records" : "Current Appointments"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#f59e0b" }}>
                {stats.pending}
              </div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#10b981" }}>
                {stats.accepted}
              </div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#ef4444" }}>
                {stats.rejected}
              </div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="appointments-grid">
            {filteredAppointments.map((appt) => {
              const isPast = !isPresentOrFuture(appt.date, appt.time);
              const normalizedStatus = normalizeStatus(appt.status);
              
              return (
                <div
                  key={appt._id}
                  className={`appointment-card ${selectedCard === appt._id ? "selected" : ""} ${isPast ? "past-appointment" : ""}`}
                  onClick={() => setSelectedCard(selectedCard === appt._id ? null : appt._id)}
                >
                  <div className="card-header">
                    <div className="patient-info">
                      <h3>{appt.patientId?.name || "N/A"}</h3>
                      <div className="created-time">
                        <ClockIcon />
                        {formatDistanceToNow(new Date(appt.createdAt || Date.now()), { addSuffix: true })}
                      </div>
                    </div>
                    <div className={`status-badge status-${normalizedStatus}`}>
                      {appt.status}
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <UserIcon className="info-icon" />
                      <div className="info-content">
                        <div className="info-label">Medical Problem</div>
                        <div className="info-value">{appt.problem || "N/A"}</div>
                      </div>
                    </div>

                    <div className="info-row">
                      <CalendarIcon className="info-icon" />
                      <div className="info-content">
                        <div className="info-label">Appointment Schedule</div>
                        <div className="info-value">{formatDateTime(appt.date, appt.time)}</div>
                      </div>
                    </div>

                    <div className="info-row">
                      <EmailIcon className="info-icon" />
                      <div className="info-content">
                        <div className="info-label">Patient Contact</div>
                        <div className="info-value">{appt.patientId?.email || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {normalizedStatus === "pending" && !isPast && (
                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn-reject"
                        onClick={() => rejectResponse(appt._id)}
                      >
                        <XMarkIcon />
                        Reject
                      </button>
                      <button
                        className="btn-accept"
                        onClick={() => acceptResponse(appt._id)}
                      >
                        <CheckIcon />
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3 className="empty-title">No appointments found</h3>
            <p>
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : filter === "history" 
                  ? "You have no historical appointments"
                  : "You have no current appointments"
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default DAppointments;
