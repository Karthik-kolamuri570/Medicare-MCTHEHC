import React from "react";
import "../styles/TopDoctors.css";

const doctorsData = [
  {
    img: "doctor1.jpg",
    name: "Dr. John Doe",
    description: "Expert in Cardiology with 10+ years of experience.",
  },
  {
    img: "doctor2.jpg",
    name: "Dr. Jane Smith",
    description: "Leading Dermatologist, specializes in skincare treatments.",
  },
  {
    img: "doctor3.jpg",
    name: "Dr. Alex Johnson",
    description: "Orthopedic surgeon, expert in joint replacement.",
  },
  {
    img: "doctor4.jpg",
    name: "Dr. Emily Brown",
    description: "Renowned Pediatrician, taking care of little ones.",
  },
];

function TopDoctors() {
  return (
    <section className="top-doctors-section">
      <div className="top-doctors-container">
        <h1 className="top-doctors-heading">Our Top Doctors</h1>
        <div className="doctors-grid">
          {doctorsData.map((doctor, index) => (
            <div key={index} className="doctor-card">
              <img src={doctor.img} alt={doctor.name} className="doctor-img" />
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-description">{doctor.description}</p>
              <button className="appointment-btn">Book an Appointment</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopDoctors;
