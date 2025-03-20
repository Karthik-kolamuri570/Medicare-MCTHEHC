import React from 'react'
import {useNavigate} from "react-router-dom"
import "../styles/TopDoctors.css";
import logo from "../assets/logo.png";
import doctor1 from "../assets/doctor1.png";
import doctor2 from "../assets/doctor2.png";

const doctorsData = [
          { img: doctor1, name: "Dr. John Doe", description: "Expert in Cardiology with 10+ years of experience." },
          { img: doctor2, name: "Dr. Jane Smith", description: "Leading Dermatologist, specializes in skincare treatments." },
          { img: doctor1, name: "Dr. Alex Johnson", description: "Orthopedic surgeon, expert in joint replacement." },
          { img: doctor2, name: "Dr. Emily Brown", description: "Renowned Pediatrician, taking care of little ones." },
        ]; 


function TopDoctors() {
          const navigate = useNavigate();
          
  return (
    <div>
      {/* header */}
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
            <a href="#">Find a Doctor</a>
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
      <div className="secondary-navbar">
        <a href="#">Our Hospitals</a>
        <a href="#">Online Consultancy</a>
        <a href="#">Treatments</a>
        <a href="#">Blood Camps and Banks</a>
      </div>
    </header>

    {/* Our Top Doctors */}
    <section className="top-doctors-section">
      <div className="top-doctors-container">
        <h1 className="top-doctors-heading">Our Top Doctors</h1>
        <div className="doctors-grid">
          {doctorsData.map((doctor, index) => (
            <div key={index} className="doctor-card">
              <img src={doctor.img} alt={doctor.name} className="doctor-img" />
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-description">{doctor.description}</p>
              <button className="appointment-btn" onClick={() => navigate("/book-appointment")}>Book an Appointment</button>
            </div>
          ))}
        </div>
      </div>
    </section>

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
  )
}

export default TopDoctors
