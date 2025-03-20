import { useNavigate } from "react-router-dom";
import React,{useState} from "react";
import doctor1 from "../assets/doctor1.png";
import doctor2 from "../assets/doctor2.png";
import doctor3 from "../assets/doctor2.png";
import "../styles/Bookanappointment.css";
import logo from "../assets/logo.png";
const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    experience: "10+ years",
    hospital: "City Hospital",
    image: doctor1,
  },
  {
    id: 2,
    name: "Dr. Sarah Lee",
    specialization: "Dermatologist",
    experience: "5-10 years",
    hospital: "MediCare Center",
    image: doctor2,
  },
  {
    id: 3,
    name: "Dr. Michael Smith",
    specialization: "Neurologist",
    experience: "15+ years",
    hospital: "General Hospital",
    image: doctor3,
  },
];
function Bookanappointment() {
          const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorsList, setShowDoctorsList] = useState(false);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorsList(false); // Hide list after selection
  };
  return (
          <div>

                    {/* Header */}
                    <header>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" className="mlogo" />
          <a href="#" className="alogo">
            Medicare
          </a>
        </div>
        <ul className="nav-links">
          <li>
            <a href="/api/patient/find-doctor">Find a Doctor</a>
          </li>
          <li>
            <a href="#">Get Second Opinion</a>
          </li>
          <li>
            <a href="#">Blogs</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="#">Sign Up</a>
          </li>
        </ul>
        <div className="search-container">
          <input type="text" placeholder="Search Your Service" />
          <button>🔍</button>
        </div>
      </nav>

      {/* Secondary Yellow Navbar */}
      <div class="secondary-navbar">
        <a href="#">Our Hospitals</a>
        <a href="#">Online Consultancy</a>
        <a href="#">Treatments</a>
        <a href="#">Blood Camps and Banks</a>
      </div>
    </header>
    {/* Bookinganappointment */}
    <div className="appointment-container">
      <h1>Book an Appointment</h1>
      <form className="appointment-form">
        {/* Select Doctor Section */}
        <div className="form-group">
          <label>Select Doctor:</label>
          <button
            type="button"
            className="select-doctor-btn"
            onClick={() => setShowDoctorsList(!showDoctorsList)}
          >
            {selectedDoctor ? selectedDoctor.name : "Select Doctor"}
          </button>
          {showDoctorsList && (
            <div className="doctor-list">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="doctor-item"
                  onClick={() => handleDoctorSelect(doc)}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="doctor-thumbnail"
                  />
                  <div className="doctor-info">
                    <h3>{doc.name}</h3>
                    <p>
                      <strong>Specialization:</strong> {doc.specialization}
                    </p>
                    <p>
                      <strong>Experience:</strong> {doc.experience}
                    </p>
                    <p>
                      <strong>Hospital:</strong> {doc.hospital}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Selected Doctor's Profile */}
        {selectedDoctor && (
          <div className="doctor-profile">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="doctor-image"
            />
            <div className="doctor-details">
              <h2>{selectedDoctor.name}</h2>
              <p>
                <strong>Specialization:</strong> {selectedDoctor.specialization}
              </p>
              <p>
                <strong>Experience:</strong> {selectedDoctor.experience}
              </p>
              <p>
                <strong>Hospital:</strong> {selectedDoctor.hospital}
              </p>
            </div>
          </div>
        )}

        {/* Date & Time Fields */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <input type="time" id="time" name="time" />
        </div>

        <div className="form-group">
          <label htmlFor="problem">Describe Your Problem:</label>
          <textarea
            id="problem"
            name="problem"
            rows="3"
            placeholder="Briefly describe your problem"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" onClick={() => navigate("/notifications")}>
          Book Appointment
        </button>
      </form>
    </div>

    {/* Footer */}
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Medicare</h2>
        </div>
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/" target="_blank">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.twitter.com/" target="_blank">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/" target="_blank">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Medicare. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
}

export default Bookanappointment;
