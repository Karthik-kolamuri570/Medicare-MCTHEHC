import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/TopDoctors.css";
import logo from "../assets/logo.png";
import axios from 'axios';

import doctor1 from "../assets/doctor1.png";
import doctor2 from "../assets/doctor2.png";
import Bookanappointment from './Bookanappointment';

function TopDoctors() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);  // Initial state is an empty array
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  
  // Fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);  // Set loading to true while fetching data
      console.log("Fetching data...");  // Log when fetch starts

      // Make the API request using Axios
      const response = await axios.get("http://localhost:1600/api/doctor/");
      
      console.log('Fetched Data:', response.data);  // Log the fetched data to check its structure

      // Access the array within response.data.data
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);  // Set state with the fetched data if it's an array
      } else {
        console.error("Data is not an array:", response.data);  // Log an error if data is not an array
      }
    } catch (error) {
      console.error("Error fetching data:", error);  // Log any error during fetch
      setError(error);  // Set error state
    } finally {
      setLoading(false);  // Set loading to false after the fetch is complete
    }
  };

  // Trigger fetchData when the component mounts
  useEffect(() => {
    console.log("Component mounted, fetching data...");  // Log when the component mounts
    fetchData();
  }, []);  // Empty dependency array ensures it runs only once on mount

  console.log('State data:', data);

  return (
    <div>
      {/* Header */}
      {/* <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="logo" className="mlogo" />
            <a href="#" className="alogo">
              Medicare
            </a>
          </div>
          <ul className="nav-links">
            <li><a href="#">Find a Doctor</a></li>
            <li><a href="#">Get Second Opinion</a></li>
            <li><a href="#">Blogs</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Sign Up</a></li>
          </ul>
          <div className="search-container">
            <input type="text" placeholder="Search Your Service" />
            <button>🔍</button>
          </div>
        </nav> */}

        {/* Secondary Yellow Navbar */}
        {/* <div className="secondary-navbar">
          <a href="#">Our Hospitals</a>
          <a href="#">Online Consultancy</a>
          <a href="#">Treatments</a>
          <a href="#">Blood Camps and Banks</a>
        </div>
      </header> */}
    
      {/* Our Top Doctors Section */}
      <section className="top-doctors-section">
        <div className="top-doctors-container">
          <h1 className="top-doctors-heading">Our Top Doctors</h1>
          <div className="doctors-grid">
            {loading && <p>Loading...</p>}

            {/* Error handling */}
            {error && <p>Error fetching data: {error.message}</p>}

            {/* Display data if available */}
            {data.length > 0 && !loading ? (
              data.map((doc, index) => (
                <div key={index} className="doctor-card">
                  <div>
                    <h3>Name:{doc.name}</h3>
                    <p>Specialization:<strong>{doc.specialization}</strong></p>
                    <p>Experience:<strong>{doc.experience} </strong>years</p>
                  </div>
                  <button 
                    className="appointment-btn" 
                    onClick={() => navigate("/book-appointment")}>
                    Book an Appointment
                  </button>
                </div>
              ))
            ) : (
              !loading && <p>No doctors available</p>  // Display if data is empty after loading
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="footer">
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
      </footer> */}
      {/* <Bookanappointment data/> */}
    </div>
    
  );
}

export default TopDoctors;
