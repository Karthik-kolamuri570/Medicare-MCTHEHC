

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/TopDoctors.css";
import axios from 'axios';
import defaultDoctorImage from "../assets/doctor1.png"; // fallback image
import Loader from './ui/Loader';

function TopDoctors() {
  const navigate = useNavigate();

  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:1600/api/doctor/");
        if (Array.isArray(response.data.data)) {
          setAllDoctors(response.data.data);
        } else {
          throw new Error("Data format invalid");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = allDoctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <section className="top-doctors-section">
        <div className="top-doctors-container">
          <div className="top-doctors-heading-bar">
            <h1 className="top-doctors-heading">Our Top Doctors</h1>
            <div className="search-container">
              <input
                type="text"
                className="search-bar"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Doctors"
              />
              <button>🔍</button>
            </div>
          </div>

          <div className="doctors-grid">
            {loading && <Loader />}
            {error && <p>Error: {error.message}</p>}

            {!loading && filteredDoctors.length === 0 && (
              <p>No doctors found matching your search.</p>
            )}

            {!loading &&
              filteredDoctors.map((doc, index) => (
                <div key={index} className="doctor-card">
                  <div className="doctor-card-left">
                    <img
                      src={doc.image || defaultDoctorImage}
                      alt={doc.name}
                      className="doctor-image"
                    />
                  </div>
                  <div className="doctor-card-right">
                    <p>Name: {doc.name}</p>
                    <p>
                      Specialization: <strong>{doc.specialization}</strong>
                    </p>
                    <p>
                      Experience: <strong>{doc.experience}</strong> years
                    </p>
                    <button
                      className="appointment-btn"
                      onClick={() => navigate(`/book-appointment/${doc._id}`)}
                    >
                      Book an Appointment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TopDoctors;
