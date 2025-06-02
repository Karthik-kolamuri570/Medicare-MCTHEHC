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


import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaStethoscope,
  FaUserMd,
  FaBookMedical,
  FaHospitalAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import doctorImage from "../../assets/doctor1.png";

const chartData = [
  { name: "Mon", Appointments: 4 },
  { name: "Tue", Appointments: 6 },
  { name: "Wed", Appointments: 5 },
  { name: "Thu", Appointments: 7 },
  { name: "Fri", Appointments: 3 },
];

function DoctorDashboard() {
  const navigate = useNavigate();

  const services = [
    { name: "Appointments", icon: <FaCalendarAlt />, path: "/api/doctor/my-appointments" },
    { name: "Online Consultations", icon: <FaStethoscope />, path: "/api/doctor/my-consultations" },
    { name: "Get Second Opinion", icon: <FaUserMd />, path: "/api/doctor/second-opinion" },
    { name: "Blogs", icon: <FaBookMedical />, path: "/my-blogs" },
    // { name: "Our Hospitals", icon: <FaHospitalAlt />, path: "/hospitals" },
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa", padding: "2rem" }}>
      {/* Top Section: Welcome + Services + Doctor Photo */}
      {/* <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "3rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>
            Welcome, Dr. John Smith
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {services.map((service) => (
              <div
                key={service.name}
                onClick={() => navigate(service.path)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1.2rem",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={{ fontSize: "1.8rem", color: "#007bff" }}>
                  {service.icon}
                </div>
                <div style={{ marginTop: "0.5rem", fontWeight: "500" }}>
                  {service.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <img
            src={doctorImage}
            alt="Doctor"
            style={{
              maxHeight: "300px",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </section> */}
      <section style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "600px",
      backgroundColor: "#f8f9fa",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "3rem",
        maxWidth: "1000px",
        width: "100%",
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.8rem" }}>
            Welcome, Dr. John Smith
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}>
            {services.map((service) => (
              <div
                key={service.name}
                onClick={() => navigate(service.path)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1.2rem",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ fontSize: "2rem" }}>{service.icon}</div>
                <div style={{ marginTop: "0.5rem", fontWeight: "500" }}>
                  {service.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flexShrink: 0 }}>
          <img
            src={doctorImage}
            alt="Doctor"
            style={{
              maxHeight: "300px",
              borderRadius: "12px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>
    </section>

      {/* Bottom Section: Stats + Chart */}
      <section
        style={{
          marginTop: "3rem",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div className="stat-block">
            <h3>Today's Appointments</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>5</p>
          </div>
          <div className="stat-block">
            <h3>Today's Consultations</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3</p>
          </div>
          <div className="stat-block">
            <h3>Weekly Consultations</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>20</p>
          </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Weekly Appointments Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Appointments" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default DoctorDashboard;
