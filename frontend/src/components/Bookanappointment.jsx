
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "../styles/Bookanappointment.css";
import docImg from "../assets/doctor1.png";
import toast from "react-hot-toast";
import Payment from "../payments/Payment";
import { Clock, MapPin, Building2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

function Bookanappointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [problem, setProblem] = useState("");

  // Slot state
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // 1. Auth check + fetch doctor
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book an appointment.");
      navigate("/login?role=patient");
      return;
    }
    const fetchDoctor = async () => {
      if (!doctorId) { setError("Invalid booking request."); setLoading(false); return; }
      try {
        setLoading(true);
        const res = await api.get(`/api/doctor/profile/${doctorId}`);
        if (res.data?.data) setSelectedDoctor(res.data.data);
        else setError("Doctor not found.");
      } catch {
        setError("Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, navigate]);

  // 2. Fetch available slots when date changes
  useEffect(() => {
    if (!date || !doctorId) { setSlots([]); setSelectedSlot(null); return; }
    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        setSelectedSlot(null);
        const res = await api.get(`/api/doctor/slots/${doctorId}?date=${date}`);
        setSlots(res.data?.data?.slots || []);
      } catch {
        setSlotsError("Could not load available slots. Please try again.");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [date, doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !selectedSlot || !problem) {
      toast.error("Please select a date, a time slot, and describe your concern.");
      return;
    }
    try {
      const res = await api.post("/api/patient/book-appointment", {
        doctorId: selectedDoctor._id,
        date,
        time: selectedSlot.startTime,
        problem,
      });
      if (res.status === 201 && res.data.data) {
        toast.success("Slot reserved! Proceeding to payment...");
        setAppointmentDetails({
          _id: res.data.data._id,
          email: res.data.data.patientEmail,
          doctorName: selectedDoctor.name,
          date,
          price: selectedDoctor.feePerConsultation || 500,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment.");
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="ba-loader" />
      Loading booking details...
    </div>
  );

  if (error) return (
    <div className="appointment-container">
      <div className="error-container">
        <h2 style={{ color: '#ef4444' }}>Oops!</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/top-doctors')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Back to Doctors
        </button>
      </div>
    </div>
  );

  return (
    <div className="appointment-container">
      {appointmentDetails ? (
        <Payment appointment={appointmentDetails} />
      ) : (
        <>
          <h1 className="page-title">Secure Your Appointment</h1>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.95rem', marginTop: '-28px', marginBottom: '36px', fontWeight: 500 }}>
            Pick a date and choose your preferred 30-minute slot.
          </p>

          <div className="booking-grid">
            {/* LEFT: Doctor Card */}
            <div className="doctor-profile-card">
              <img
                src={selectedDoctor.profileImage || docImg}
                alt={selectedDoctor.name}
                className="doctor-profile-img"
              />
              <div className="doctor-profile-details">
                <span className="spec-badge">{selectedDoctor.specialization}</span>
                <h2>{selectedDoctor.name}</h2>
                <div className="info-row"><Building2 size={15} /><span>{selectedDoctor.hospital}</span></div>
                <div className="info-row"><MapPin size={15} /><span>{selectedDoctor.location}</span></div>
                <div className="availability-box">
                  <span className="availability-title">Working Hours</span>
                  <div className="availability-time">{selectedDoctor.fromTime} – {selectedDoctor.toTime}</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Form */}
            <form className="booking-form-container" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>Appointment Details</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Select a date, then pick an available 30-min slot.</p>
              </div>

              {/* Date picker */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>
                  <Calendar size={15} /> Appointment Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              {/* Slot Picker */}
              {date && (
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '10px' }}>
                    <Clock size={15} /> Select Time Slot
                    {selectedSlot && (
                      <span className="ba-selected-label">
                        <CheckCircle2 size={13} /> {selectedSlot.label}
                      </span>
                    )}
                  </label>

                  {slotsLoading && (
                    <div className="ba-slots-loading">
                      <div className="ba-loader" />
                      <span>Checking availability...</span>
                    </div>
                  )}

                  {slotsError && !slotsLoading && (
                    <div className="validation-message">
                      <AlertCircle size={18} />
                      <div><strong>Error</strong><p>{slotsError}</p></div>
                    </div>
                  )}

                  {!slotsLoading && !slotsError && slots.length === 0 && (
                    <div className="ba-no-slots">
                      No slots available for this date. Please try another day.
                    </div>
                  )}

                  {!slotsLoading && slots.length > 0 && (
                    <div className="ba-slot-grid">
                      {slots.map((slot) => (
                        <button
                          key={slot.startTime}
                          type="button"
                          className={[
                            'ba-slot-btn',
                            !slot.available ? 'ba-slot-booked' : '',
                            selectedSlot?.startTime === slot.startTime ? 'ba-slot-selected' : '',
                          ].join(' ').trim()}
                          onClick={() => slot.available && setSelectedSlot(slot)}
                          disabled={!slot.available}
                          title={slot.available ? `Book ${slot.label}` : 'Already booked'}
                        >
                          <span className="ba-slot-time">{slot.label}</span>
                          {!slot.available && <span className="ba-slot-booked-tag">Booked</span>}
                          {selectedSlot?.startTime === slot.startTime && (
                            <CheckCircle2 size={13} className="ba-slot-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Problem */}
              <div className="form-group">
                <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Describe your health concern
                </label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="e.g. Severe headache for 2 days, fever, cough..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="booking-btn" disabled={!selectedSlot}>
                {selectedSlot
                  ? `Proceed to Payment • ₹${selectedDoctor.feePerConsultation || 500}`
                  : "Please select a time slot"}
              </button>
              <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                🔒 Secure 256-bit encrypted transaction
              </p>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Bookanappointment;
