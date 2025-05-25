import { useNavigate } from "react-router-dom";
import doctorImage from "../../assets/doctor1.png";

function DoctorDashboard() {
  const navigate = useNavigate();

  const services = [
    { name: "Appointments", icon: "📅", path: "/api/doctor/my-appointments" },
    { name: "Online Consultations", icon: "💬", path: "/api/doctor/my-consultations" },
    { name: "Get Second Opinion", icon: "🩺", path: "/api/doctor/second-opinion" },
    { name: "Blogs", icon: "📝", path: "/my-blogs" },
  ];

  return (
    <section style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "600px",
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
  );
}

export default DoctorDashboard;
