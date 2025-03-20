import React from "react";
import "../styles/Findahospital.css";
import Hospital from "../assets/Hospital.png";

function Findahospital() {
  return (
    <div className="find-hospital-container">
      <div className="find-hospital-image">
        <img src={Hospital} alt="Find a Hospital" />
      </div>
      <div className="find-hospital-text">
        <h1>Find a Hospital</h1>
        <p>
          Easily locate the nearest hospitals with our Medicare platform. Search
          by location and specialty, access emergency services, and check
          hospital details and ratings. Find the right hospital for your needs
          quickly and efficiently!
        </p>
      </div>
    </div>
  );
}

export default Findahospital;
