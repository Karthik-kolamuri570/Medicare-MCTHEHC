import React from "react";
import "../styles/FindaDoctor.css";
import searchdoctor from "../assets/searchdoctor.png";

function FindaDoctor() {
  return (
    <div className="find-a-doctor-container">
      <div className="find-a-doctor-image">
        <img src={searchdoctor} alt="" />
      </div>
      <div className="find-a-doctor-text">
        <h1>Find a Doctor</h1>
        <p>
          Our Medicare platform helps you connect with qualified doctors across
          multiple specialties. Search by name, specialty, or location to find
          the right expert for your health needs. View doctor profiles, check
          patient reviews, and book appointments with ease. Whether you need a
          general consultation or a specialist opinion, we make healthcare
          accessible and convenient for you.
        </p>
      </div>
    </div>
  );
}

export default FindaDoctor;
