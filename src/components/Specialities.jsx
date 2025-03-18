import React from "react";
import "../styles/Specialities.css";
import specialities from "../assets/specialities.png";

function Specialities() {
  return (
    <div className="specialities-container">
      <div className="specialities-text">
        <h1>Specialities We Offer</h1>
        <p>
          Our Medicare platform connects you with top specialists in cardiology
          for heart health, neurology for brain and nerve care, orthopedics for
          bones and joints, and pediatrics for child healthcare. We also provide
          expert consultations in dermatology for skin and hair care, gynecology
          for women's health, oncology for cancer treatment, psychiatry for
          mental health support, gastroenterology for digestive issues, and
          endocrinology for hormonal disorders. Find the right specialist with
          ease and get the care you need.
        </p>
      </div>
      <div className="specialities-image">
        <img src={specialities} alt="Specialities" />
      </div>
    </div>
  );
}

export default Specialities;
