import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/TopDoctors.css";
import api from '../utils/api';
import defaultDoctorImage from "../assets/doctor1.png";
import Loader from './ui/Loader';
import { MapPin, Clock, Star, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

function TopDoctors() {
  const navigate = useNavigate();

  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/doctor/");
        if (response.data && Array.isArray(response.data.data)) {
          setAllDoctors(response.data.data);
        } else {
          setAllDoctors([]);
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

  // Filter Logic
  const filteredDoctors = allDoctors.filter((doc) => {
    const searchLower = searchInput.toLowerCase();

    // Schema field mapping
    const name = doc.name?.toLowerCase() || "";
    const spec = doc.specialization?.toLowerCase() || "";
    const loc = doc.location?.toLowerCase() || "";
    const hosp = doc.hospital?.toLowerCase() || "";

    return (
      name.includes(searchLower) ||
      spec.includes(searchLower) ||
      loc.includes(searchLower) ||
      hosp.includes(searchLower)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="doctors-page-wrapper">
      <div className="doctors-header-container">
        <div>
          <h1 className="page-title">Find Your Specialist</h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1.1rem' }}>
            Book appointments with top-rated doctors across the best hospitals.
          </p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Doctor Name, Speciality, or Hospital..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-container">
        {loading && <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '50px' }}><Loader /></div>}

        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="empty-state">
            <h3>No specialists found</h3>
            <p>Try searching for a different name, specialty, or hospital.</p>
          </div>
        )}

        {!loading && currentDoctors.map((doc, index) => (
          <div key={doc._id || index} className="simple-doctor-card">
            {/* LEFT: Image */}

            {/* LEFT: Image */}
            <div className="card-left">
              <img
                src={doc.image || defaultDoctorImage}
                alt={doc.name}
                onError={(e) => { e.target.src = defaultDoctorImage }}
              />
              {(() => {
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();

                const [startH, startM] = (doc.fromTime || "09:00").split(':').map(Number);
                const [endH, endM] = (doc.toTime || "17:00").split(':').map(Number);

                const startMinutes = startH * 60 + startM;
                const endMinutes = endH * 60 + endM;

                const isAvailable = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

                return (
                  <div className={`availability-tag ${isAvailable ? 'tag-available' : 'tag-unavailable'}`}
                    style={{
                      backgroundColor: isAvailable ? '#dcfce7' : '#f3f4f6',
                      color: isAvailable ? '#16a34a' : '#64748b'
                    }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isAvailable ? '#22c55e' : '#94a3b8',
                        display: 'inline-block',
                        marginRight: '6px'
                      }}
                    ></span>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                );
              })()}
            </div>

            {/* RIGHT: Content */}
            <div className="card-right">
              <div>
                <h3 className="doc-name">{doc.name}</h3>
                <p className="doc-spec">{doc.specialization}</p>

                <div className="doc-info-grid">
                  <div className="info-item rating">
                    <Star size={14} className="icon-star" fill="#f59e0b" />
                    <span>{doc.rating || "4.8"}</span>
                  </div>

                  <div className="info-item">
                    <MapPin size={14} className="icon-loc" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }}>
                      {doc.location || "New York"}
                    </span>
                  </div>
                </div>

                {/* Hospital Name if available */}
                {doc.hospital && (
                  <div className="info-item" style={{ marginBottom: '8px' }}>
                    <Building2 size={12} style={{ color: '#64748b' }} />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.hospital}</span>
                  </div>
                )}

                <div className="time-badge">
                  <Clock size={12} />
                  <span>{doc.fromTime || "09:00"} - {doc.toTime || "17:00"}</span>
                </div>
              </div>

              <button
                className="book-btn"
                onClick={() => navigate(`/book-appointment/${doc._id}`)}
              >
                <span>Book Visit • ₹{doc.feePerConsultation || 500}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="page-btn prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>

          <span className="page-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            className="page-btn next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TopDoctors;
