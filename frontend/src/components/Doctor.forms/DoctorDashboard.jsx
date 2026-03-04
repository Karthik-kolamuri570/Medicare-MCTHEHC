// import { useNavigate } from "react-router-dom";
// import doctorImage from "../../assets/doctor1.png";

// function DoctorDashboard() {
//   const navigate = useNavigate();

//   const services = [
//     { name: "Appointments", icon: "📅", path: "/api/doctor/my-appointments" },
//     { name: "Online Consultations", icon: "💬", path: "/api/doctor/my-consultations" },
//     { name: "Get Second Opinion", icon: "🩺", path: "/api/doctor/second-opinion" },
//     { name: "Blogs", icon: "📝", path: "/my-blogs" },
//   ];

//   return (
//     <section style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "600px",
//       backgroundColor: "#f8f9fa",
//     }}>
//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "3rem",
//         maxWidth: "1000px",
//         width: "100%",
//       }}>
//         <div style={{ flex: 1 }}>
//           <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>
//             Welcome, Dr. John Smith
//           </h2>
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "1rem",
//           }}>
//             {services.map((service) => (
//               <div
//                 key={service.name}
//                 onClick={() => navigate(service.path)}
//                 style={{
//                   backgroundColor: "#fff",
//                   border: "1px solid #ddd",
//                   borderRadius: "8px",
//                   padding: "1.2rem",
//                   cursor: "pointer",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                   textAlign: "center",
//                   transition: "transform 0.2s",
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
//               >
//                 <div style={{ fontSize: "2rem" }}>{service.icon}</div>
//                 <div style={{ marginTop: "0.5rem", fontWeight: "500" }}>
//                   {service.name}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={{ flexShrink: 0 }}>
//           <img
//             src={doctorImage}
//             alt="Doctor"
//             style={{
//               maxHeight: "300px",
//               borderRadius: "12px",
//               objectFit: "cover",
//               boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
//             }}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default DoctorDashboard;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaStethoscope,
  FaUserMd,
  FaBookMedical,
  FaHospitalAlt,
} from "react-icons/fa";
import { FiDroplet } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import doctorImage from "../../assets/doctor1.png";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("Doctor");
  const [profileImage, setProfileImage] = useState(null);
  
  // New States for Data
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayConsultations: 0,
    weeklyConsultations: 0,
    rating: 0,
    totalRatings: 0
  });
  const [chartData, setChartData] = useState([
    { name: "Mon", Appointments: 0 },
    { name: "Tue", Appointments: 0 },
    { name: "Wed", Appointments: 0 },
    { name: "Thu", Appointments: 0 },
    { name: "Fri", Appointments: 0 },
    { name: "Sat", Appointments: 0 },
    { name: "Sun", Appointments: 0 },
  ]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Fetch Doctor Profile
        const profileRes = await fetch("/api/doctor/me", { headers });
        const profileData = await profileRes.json();
        
        if (profileData.success && profileData.data) {
          setDoctorName(profileData.data.name || "Doctor");
          if (profileData.data.profileImage) {
            setProfileImage(profileData.data.profileImage);
          }
          setStats(prev => ({
            ...prev,
            rating: profileData.data.rating || 0,
            totalRatings: profileData.data.totalRatings || 0,
          }));
        }

        // 2. Fetch Doctor's Appointments
        const appointmentsRes = await fetch("/api/doctor/appointments", { headers });
        const appointmentsData = await appointmentsRes.json();
        const appointments = appointmentsData.success ? appointmentsData.data : [];

        // 3. Fetch Doctor's Consultations (Second Opinion)
        const consultsRes = await fetch("/api/doctor/get-second-opinion", { headers });
        const consultsData = await consultsRes.json();
        const consultations = consultsData.success ? consultsData.data : [];

        // --- Calculate Statistics ---
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        // Today's Appointments
        const todayAppointmentsCount = appointments.filter(app => {
          if (app.status === 'Rejected') return false;
          // Assumes app.date is stored as YYYY-MM-DD
          return app.date && app.date.startsWith(todayString);
        }).length;

        // Today's Consultations
        const todayConsultationsCount = consultations.filter(cons => {
          if (cons.status === 'rejected') return false;
          // Fallback to createdAt if there's no specific date for second opinions
          const consDate = new Date(cons.createdAt).toISOString().split('T')[0];
          return consDate === todayString;
        }).length;

        // Weekly Consultations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const weeklyConsultsCount = consultations.filter(cons => {
          if (cons.status === 'rejected') return false;
          const consDate = new Date(cons.createdAt);
          return consDate >= sevenDaysAgo && consDate <= today;
        }).length;

        setStats({
          todayAppointments: todayAppointmentsCount,
          todayConsultations: todayConsultationsCount,
          weeklyConsultations: weeklyConsultsCount,
        });

        // --- Calculate Chart Data (Combined Activity per Day of Week) ---
        // Initialize an array of 7 days (Sun - Sat) for stats
        const daysStats = [
          { appointments: 0, consultations: 0 }, // Sun
          { appointments: 0, consultations: 0 }, // Mon
          { appointments: 0, consultations: 0 }, // Tue
          { appointments: 0, consultations: 0 }, // Wed
          { appointments: 0, consultations: 0 }, // Thu
          { appointments: 0, consultations: 0 }, // Fri
          { appointments: 0, consultations: 0 }, // Sat
        ];

        // Process Appointments
        appointments.forEach(app => {
          if (app.status !== 'Rejected' && app.date) {
            // Robust parsing: split YYYY-MM-DD to avoid UTC shift
            const [year, month, day] = app.date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            const dayOfWeek = dateObj.getDay();
            if (!isNaN(dayOfWeek)) {
               daysStats[dayOfWeek].appointments++;
            }
          }
        });

        // Process Second Opinion Consultations
        consultations.forEach(cons => {
          if (cons.status !== 'rejected' && cons.createdAt) {
            const dateObj = new Date(cons.createdAt);
            const dayOfWeek = dateObj.getDay();
            if (!isNaN(dayOfWeek)) {
               daysStats[dayOfWeek].consultations++;
            }
          }
        });

        // Map to Recharts format (Mon to Sun)
        const mappedChartData = [
          { name: "Mon", Appointments: daysStats[1].appointments, Consultations: daysStats[1].consultations },
          { name: "Tue", Appointments: daysStats[2].appointments, Consultations: daysStats[2].consultations },
          { name: "Wed", Appointments: daysStats[3].appointments, Consultations: daysStats[3].consultations },
          { name: "Thu", Appointments: daysStats[4].appointments, Consultations: daysStats[4].consultations },
          { name: "Fri", Appointments: daysStats[5].appointments, Consultations: daysStats[5].consultations },
          { name: "Sat", Appointments: daysStats[6].appointments, Consultations: daysStats[6].consultations },
          { name: "Sun", Appointments: daysStats[0].appointments, Consultations: daysStats[0].consultations },
        ];
        
        setChartData(mappedChartData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const services = [
    { name: "Appointments", icon: <FaCalendarAlt />, path: "/doctor/my-appointments", color: "#3b82f6" },
    { name: "Online Consultations", icon: <FaStethoscope />, path: "/doctor/my-consultations", color: "#10b981" },
    { name: "Get Second Opinion", icon: <FaUserMd />, path: "/doctor/second-opinion", color: "#8b5cf6" },
    { name: "Blogs", icon: <FaBookMedical />, path: "/doctor/doc/blogs", color: "#f59e0b" },
    { name: "Blood Camps", icon: <FiDroplet />, path: "/doctor/blood-camp/admin", color: "#ef4444" },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", padding: "1rem 2rem 2rem", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "20px",
          padding: "3rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          position: "relative",
          overflow: "hidden",
          marginBottom: "2rem"
        }}>
          {/* Decorative Glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ flex: "1 1 min-content", zIndex: 1, minWidth: "300px" }}>
            <h1 style={{ color: "white", fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem", letterSpacing: "-0.5px" }}>
              Welcome back, <span style={{ color: "#60a5fa" }}>{doctorName}</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: "600px", lineHeight: "1.6" }}>
              Here is what's happening with your practice today. Check your upcoming appointments and manage your consultations.
            </p>
          </div>
          
          <div style={{ flexShrink: 0, zIndex: 1, display: "flex", justifyContent: "center", width: "100%", maxWidth: "200px" }}>
             <img
              src={profileImage || doctorImage}
              alt="Doctor Profile"
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
              }}
              onError={(e) => (e.currentTarget.src = doctorImage)}
            />
          </div>
        </div>

        {/* Quick Actions (Services) */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>Quick Hub</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem"
          }}>
            {services.map((service, idx) => (
              <div
                key={idx}
                onClick={() => navigate(service.path)}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #f1f5f9"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.borderColor = `${service.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.borderColor = "#f1f5f9";
                }}
              >
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: `${service.color}15`,
                  color: service.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem"
                }}>
                  {service.icon}
                </div>
                <div style={{ fontWeight: "600", color: "#334155", fontSize: "1.05rem" }}>
                  {service.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overview Stats & Chart Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem"
        }}>
          
          {/* Stats Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
             <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Overview</h2>
             
             {/* Stat Card 1 */}
             <div style={{
                 background: "white",
                 borderRadius: "16px",
                 padding: "1.5rem",
                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                 border: "1px solid #f8fafc",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center"
             }}>
                 <div>
                     <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Today's Appointments</p>
                     <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>{stats.todayAppointments}</p>
                 </div>
                 <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                     <FaCalendarAlt />
                 </div>
             </div>

             {/* Stat Card 2 */}
             <div style={{
                 background: "white",
                 borderRadius: "16px",
                 padding: "1.5rem",
                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                 border: "1px solid #f8fafc",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center"
             }}>
                 <div>
                     <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Today's Consultations</p>
                     <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>{stats.todayConsultations}</p>
                 </div>
                 <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                     <FaStethoscope />
                 </div>
             </div>

             {/* Stat Card 3 */}
             <div style={{
                 background: "white",
                 borderRadius: "16px",
                 padding: "1.5rem",
                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                 border: "1px solid #f8fafc",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center"
             }}>
                 <div>
                     <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Weekly Consultations</p>
                     <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>{stats.weeklyConsultations}</p>
                 </div>
                 <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f5f3ff", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                     <FaUserMd />
                 </div>
             </div>

             {/* Stat Card 4 - Rating */}
             <div style={{
                 background: "white",
                 borderRadius: "16px",
                 padding: "1.5rem",
                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                 border: "1px solid #f8fafc",
                 display: "flex",
                 justifyContent: "space-between",
                 alignItems: "center"
             }}>
                 <div>
                     <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Professional Rating</p>
                     <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: "800", color: "#0f172a" }}>
                       {stats.rating ? stats.rating.toFixed(1) : "N/A"}<span style={{ fontSize: '1rem', color: '#94a3b8', marginLeft: '4px' }}>/ 5.0</span>
                     </p>
                     <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>From {stats.totalRatings} patient reviews</p>
                 </div>
                 <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fef3c7", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                     <span style={{ fontSize: '1.2rem' }}>⭐</span>
                 </div>
             </div>
          </div>

          {/* Chart Column */}
          <div style={{ flex: "2 1 500px", minWidth: 0, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: "0 0 1.5rem" }}>Appointment Activity</h2>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f8fafc",
              flex: 1,
              display: "flex",
              alignItems: "center"
            }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, dy: 10 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar 
                    dataKey="Appointments" 
                    name="Appointments"
                    fill="#3b82f6" 
                    radius={[6, 6, 0, 0]} 
                    barSize={20}
                  />
                  <Bar 
                    dataKey="Consultations" 
                    name="Consultations"
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
