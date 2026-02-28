
import React, { useState, useEffect, useRef } from "react";
import api from '../../utils/api';
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload, FiLoader, FiCheckCircle, FiArrowRight, FiArrowLeft,
  FiSearch, FiCalendar, FiVideo, FiClock, FiFileText, FiTrash2, FiUser, FiMapPin, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import Payment from "../../payments/Payment";
import "../../styles/GetSecondOpinion.css";

const ITEMS_PER_PAGE = 12;

const GetSecondOpinion = () => {
  // --- STATE ---
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Pagination State

  const [formData, setFormData] = useState({
    doctorId: "",
    problem: "",
    treatment: "",
    mode: "online",
    date: "",
    time: "",
    files: []
  });
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const fileInputRef = useRef(null);
  const topRef = useRef(null);

  // --- FETCH DOCTORS ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/");
        if (res.data && res.data.data) {
          setDoctors(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.files.length === 0) {
      alert('Please upload at least one report.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'files') {
          formData.files.forEach(file => data.append('files', file));
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await api.post(
        "/api/patient/get-second-opinion",
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const selectedDoctor = doctors.find(d => d._id === formData.doctorId);

      setAppointmentDetails({
        _id: response.data.data?._id,
        doctorName: selectedDoctor?.name || "Specialist",
        price: selectedDoctor?.feePerConsultation || 500,
        date: formData.date
      });

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTER & PAGINATION LOGIC ---

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredDoctors = doctors.filter(d => {
    const query = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(query) ||
      d.specialization?.toLowerCase().includes(query) ||
      d.hospital?.toLowerCase().includes(query) ||
      d.location?.toLowerCase().includes(query)
    );
  });

  // Pagination Math
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const selectedDoc = doctors.find(d => d._id === formData.doctorId);

  const steps = [
    { title: "Doctor", icon: <FiUser /> },
    { title: "Details", icon: <FiFileText /> },
    { title: "Schedule", icon: <FiCalendar /> },
    { title: "Uploads", icon: <FiUpload /> }
  ];

  if (appointmentDetails) return <Payment appointment={appointmentDetails} />;

  return (
    <div className="gso-container" ref={topRef}>
      <div className="gso-card">

        {/* HEADER */}
        <div className="gso-header">
          <div className="gso-title-block">
            <h1>Get Second Opinion</h1>
            <p>Consult with top specialists for a better diagnosis.</p>
          </div>
          {/* Horizontal Stepper (desktop) */}
          <div className="gso-h-stepper" role="navigation" aria-label="Form steps">
            {steps.map((s, i) => (
              <div key={i} className={`gso-step ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`} aria-current={step === i ? 'step' : undefined}>
                <div className="gso-step-icon">
                  {step > i ? <FiCheckCircle /> : (i + 1)}
                </div>
                <span>{s.title}</span>
                {i < steps.length - 1 && <div className="gso-step-line"></div>}
              </div>
            ))}
          </div>
          {/* Mobile Stepper (dots) */}
          <div className="gso-mobile-stepper" role="navigation" aria-label="Form steps">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`gso-mobile-dot ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={step === i ? 'step' : undefined}
              />
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="gso-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="gso-motion-wrapper"
            >
              {/* STEP 0: DOCTOR SELECTION */}
              {step === 0 && (
                <div className="gso-step-container">
                  <h2>Choose Your Specialist</h2>
                  <p className="gso-step-subtitle">Browse and select a doctor who matches your needs.</p>
                  <div className="gso-filters">
                    <div className="gso-search-wrap">
                      <FiSearch />
                      <input
                        type="text"
                        placeholder="Search doctor, specialty, hospital..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="gso-alert-box">
                      <FiClock />
                      <span>Please select a time within the doctor's <strong>Available Hours</strong>.</span>
                    </div>
                  </div>

                  {/* DOCTOR GRID */}
                  <div className="gso-grid-doctors">
                    {currentDoctors.map(doc => {
                      // Avaialbility Logic
                      const now = new Date();
                      const currentMinutes = now.getHours() * 60 + now.getMinutes();
                      const [startH, startM] = (doc.fromTime || "09:00").split(':').map(Number);
                      const [endH, endM] = (doc.toTime || "17:00").split(':').map(Number);
                      const startMinutes = startH * 60 + startM;
                      const endMinutes = endH * 60 + endM;
                      const isAvailable = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

                      return (
                        <div
                          key={doc._id}
                          className={`gso-doc-card ${formData.doctorId === doc._id ? 'selected' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, doctorId: doc._id }))}
                        >
                          <div className="gso-doc-header">
                            <div className="gso-avatar">
                              {doc.name?.[0] || "D"}
                              <div className={`gso-status ${isAvailable ? 'online' : 'offline'}`}></div>
                            </div>
                            <div className="gso-doc-meta">
                              <h3>{doc.name}</h3>
                              <span className="gso-spec">{doc.specialization}</span>
                            </div>
                          </div>
                          <div className="gso-doc-body">
                            <div className="gso-info-row">
                              <FiMapPin />
                              <span>
                                {doc.hospital || "Medicare Hospital"}
                                {doc.location ? <>, {doc.location}</> : ""}
                              </span>
                            </div>
                            <div className="gso-info-row">
                              <FiClock /> {doc.fromTime || "09:00"} - {doc.toTime || "17:00"}
                            </div>
                            {doc.feePerConsultation && (
                              <div className="gso-fee-badge">
                                ₹{doc.feePerConsultation}
                              </div>
                            )}
                            <div className={`gso-avail-tag ${isAvailable ? 'yes' : 'no'}`}>
                              {isAvailable ? "Available Now" : "Offline"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {filteredDoctors.length > 0 ? (
                    <div className="gso-pagination">
                      <button
                        className="gso-page-btn"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <FiChevronLeft /> Previous
                      </button>

                      <span className="gso-page-info">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                      </span>

                      <button
                        className="gso-page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next <FiChevronRight />
                      </button>
                    </div>
                  ) : (
                    <div className="gso-no-results">
                      No doctors found matching your search.
                    </div>
                  )}

                </div>
              )}

              {/* STEP 1: DETAILS */}
              {step === 1 && (
                <div className="gso-step-container xs-width">
                  <h2>Explain your Condition</h2>
                  <p className="gso-step-subtitle">Help the specialist understand your symptoms and history.</p>
                  <div className="gso-input-group">
                    <label>Chief Complaint / Symptoms</label>
                    <textarea
                      rows={5}
                      name="problem"
                      value={formData.problem}
                      onChange={handleInputChange}
                      placeholder="Describe what you are feeling..."
                    />
                  </div>
                  <div className="gso-input-group">
                    <label>Current Treatment / History</label>
                    <textarea
                      rows={4}
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      placeholder="Any medications or previous surgeries..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: SCHEDULE */}
              {step === 2 && (
                <div className="gso-step-container xs-width">
                  <h2>Schedule & Preferences</h2>
                  <p className="gso-step-subtitle">Choose how and when you'd like to consult.</p>
                  <div className="gso-mode-row">
                    <div
                      className={`gso-mode-box ${formData.mode === 'online' ? 'active' : ''}`}
                      onClick={() => setFormData(p => ({ ...p, mode: 'online' }))}
                    >
                      <FiVideo size={30} />
                      <span>Video Consultation</span>
                    </div>
                    <div
                      className={`gso-mode-box ${formData.mode === 'offline' ? 'active' : ''}`}
                      onClick={() => setFormData(p => ({ ...p, mode: 'offline' }))}
                    >
                      <FiUser size={30} />
                      <span>Physical Visit</span>
                    </div>
                  </div>

                  <div className="gso-row-inputs">
                    <div className="gso-input-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="gso-input-group">
                      <label>
                        Time
                        {selectedDoc && (
                          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginLeft: 8 }}>
                            (Hours: {selectedDoc.fromTime || "09:00"} - {selectedDoc.toTime || "17:00"})
                          </span>
                        )}
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOADS */}
              {step === 3 && (
                <div className="gso-step-container xs-width">
                  <h2>Upload Medical Reports</h2>
                  <p className="gso-step-subtitle">Attach relevant files so the doctor can review your case.</p>
                  <div
                    className="gso-upload-box"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiUpload size={40} />
                    <p>Click to upload relevant files (PDF, JPG)</p>
                  </div>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                  />
                  <div className="gso-files">
                    {formData.files.map((f, i) => (
                      <div key={i} className="gso-file-chip">
                        <FiFileText /> {f.name}
                        <button onClick={() => removeFile(i)}><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="gso-footer">
          <div className="gso-summary-simple">
            {selectedDoc && (
              <span>Selected: <strong>{selectedDoc.name}</strong> ({selectedDoc.specialization})</span>
            )}
          </div>

          <div className="gso-buttons">
            <button
              className="gso-btn-back"
              disabled={step === 0}
              onClick={() => setStep(s => s - 1)}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                className="gso-btn-next"
                onClick={() => {
                  // VALIDATION LOGIC
                  if (step === 0) {
                    if (!formData.doctorId) return alert("Please select a doctor to proceed.");
                  }

                  if (step === 1) {
                    if (!formData.problem.trim() || !formData.treatment.trim()) {
                      return alert("Please call out your symptoms and treatment history.");
                    }
                  }

                  if (step === 2) {
                    if (!formData.date || !formData.time) return alert("Please select both Date and Time.");

                    // TIME AVAILABILITY CHECK
                    if (selectedDoc) {
                      // 1. Working Hours Check
                      const [sh, sm] = (selectedDoc.fromTime || "09:00").split(':').map(Number);
                      const [eh, em] = (selectedDoc.toTime || "17:00").split(':').map(Number);
                      const [selH, selM] = formData.time.split(':').map(Number);

                      const startMins = sh * 60 + sm;
                      const endMins = eh * 60 + em;
                      const selMins = selH * 60 + selM;

                      if (selMins < startMins || selMins > endMins) {
                        return alert(`Note: Doctor is only available between ${selectedDoc.fromTime || "09:00"} and ${selectedDoc.toTime || "17:00"}. Please choose a valid time.`);
                      }

                      // 2. Past Date/Time Check
                      const selectedDate = new Date(formData.date);
                      selectedDate.setHours(0, 0, 0, 0);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      if (selectedDate.getTime() === today.getTime()) {
                        const now = new Date();
                        const currentMins = now.getHours() * 60 + now.getMinutes();
                        if (selMins <= currentMins) {
                          return alert("You cannot schedule a consultation in the past. Please select a future time.");
                        }
                      }
                    }
                  }

                  setStep(s => s + 1);
                }}
              >
                Next Step <FiArrowRight />
              </button>
            ) : (
              <button
                className="gso-btn-finish"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GetSecondOpinion;
