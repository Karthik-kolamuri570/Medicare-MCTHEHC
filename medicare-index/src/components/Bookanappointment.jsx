import React from "react";
import "../styles/Bookanappointment.css";
import bookanappointment from "../assets/bookanappointment.png";

function Bookanappointment() {
  return (
    <div className="book-appointment-container">
      <div className="book-appointment-text">
        <h1>Booking an Appointment</h1>
        <p>
          Easily schedule an appointment with top healthcare professionals using
          our Medicare platform. Whether you need a routine check-up, specialist
          consultation, or second opinion, our seamless booking system ensures
          you get the medical care you need at your convenience.
        </p>
        <ul>
          <li>
            Find a Doctor - Search for experienced doctors across various
            specialties.
          </li>
          <li>
            Online & In-Person Consultations - Book virtual or physical
            appointments.
          </li>
          <li>Instant Confirmation - Receive real-time booking updates.</li>
          <li>
            Your health is our priority! Book your appointment today and take a
            step towards better healthcare.
          </li>
        </ul>
      </div>
      <div className="book-appointment-image">
        <img src={bookanappointment} alt="Booking an Appointment" />
      </div>
    </div>
  );
}

export default Bookanappointment;
