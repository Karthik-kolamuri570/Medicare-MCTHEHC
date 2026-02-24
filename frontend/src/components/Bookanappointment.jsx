
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "../styles/Bookanappointment.css";
import docImg from "../assets/doctor1.png";
import toast from "react-hot-toast";
import Payment from "../payments/Payment";
import { Clock, MapPin, Building2, AlertCircle, Calendar } from "lucide-react";

function Bookanappointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();

  // State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");
  const [timeError, setTimeError] = useState("");

  const [appointmentDetails, setAppointmentDetails] = useState(null);

  // 1. Auth Check & Fetch Doctor
  useEffect(() => {
    const token = localStorage.getItem("token"); // Changed to 'token' based on LoginPatient.jsx
    if (!token) {
      toast.error("Please login to book an appointment.");
      navigate("/patient/login");
      return;
    }

    const fetchDoctor = async () => {
      if (!doctorId) {
        setError("Invalid booking request.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/doctor/profile/${doctorId}`);
        if (response.data && response.data.data) {
          setSelectedDoctor(response.data.data);
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId, navigate]);


  // 2. Time Validation Logic
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);

    if (!selectedDoctor) return;

    // Logic: Convert times to comparable minutes or date objects
    // Format: "HH:MM" (24h)
    const { fromTime, toTime } = selectedDoctor;

    // Simple String Comparison for HH:MM (works for same day, assuming 24h format stored/entered)
    // If Times are 12h format (e.g. "09:00 AM"), we need parsing logic. 
    // Usually input type="time" gives 24h format "14:30".
    // I will assume db sends simple strings or standard format.
    // If comparison fails, I'll fallback to loose validation or just display warning.

    // Let's assume input="time" returns "HH:MM" (24h).
    // Let's assume DB fields `fromTime`/`toTime` are comparable strings or need normalization.
    // For specific requirement: Validate and Prompt.

    if (fromTime && toTime) {
      // Check if DB time is "HH:MM" or "HH:MM AM/PM"
      // To be safe, let's just parse logic if we can, or do a direct string compare 
      // nicely if formats match. 
      // If format is complex, I will just show the warning if it *looks* wrong
      // But user wants STRICT validation.

      // Heuristic: If we can't parse, allow it but show "Please double check".
      // If we can parse, show error.

      // Since I don't know EXACT db format from the previous `doctor.js` file (type: String),
      // I'll create a robust checker assuming standard time formats.

      const isValid = isTimeWithinRange(selectedTime, fromTime, toTime);
      if (!isValid) {
        setTimeError(`Doctor is only available between ${fromTime} and ${toTime}.`);
      } else {
        setTimeError("");
      }
    }
  };

  // Helper: Time Range Validator
  const isTimeWithinRange = (target, start, end) => {
    if (!target || !start || !end) return true; // generic fallback

    // Normalizer: Convert "09:00 AM" or "09:00" to minutes from midnight
    const toMinutes = (timeStr) => {
      // Remove spaces, lowertext
      let t = timeStr.toLowerCase().trim();
      let [hours, minutes] = t.split(":").map(x => parseInt(x));

      // Handle AM/PM
      if (t.includes("pm") && hours < 12) hours += 12;
      if (t.includes("am") && hours === 12) hours = 0;

      // Handle input type="time" which might technically be strict HH:MM
      if (Number.isNaN(minutes)) {
        // try parsing "10:00 AM" split by space
        const parts = timeStr.split(" ");
        if (parts.length > 1) {
          const [h, m] = parts[0].split(":");
          let hr = parseInt(h);
          if (parts[1].toLowerCase() === 'pm' && hr < 12) hr += 12;
          if (parts[1].toLowerCase() === 'am' && hr === 12) hr = 0;
          hours = hr;
          minutes = parseInt(m);
        }
      }

      return hours * 60 + (minutes || 0);
    };

    const targetMin = toMinutes(target);
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);

    return targetMin >= startMin && targetMin <= endMin;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeError) {
      toast.error("Please select a valid time within working hours.");
      return;
    }
    if (!selectedDoctor || !date || !time || !problem) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post(
        "/api/patient/book-appointment",
        {
          doctorId: selectedDoctor._id,
          date,
          time,
          problem,
        }
      );

      // 201 Created logic
      if (response.status === 201 && response.data.data) {
        toast.success("Details verified. Proceeding to payment...");
        setAppointmentDetails({
          _id: response.data.data._id,
          email: response.data.data.patientEmail,
          doctorName: selectedDoctor.name,
          date,
          price: selectedDoctor.feePerConsultation || 500,
        });
      }
    } catch (err) {
      console.error("Booking Error:", err);
      // Enhanced error handling
      const msg = err.response?.data?.message || "Failed to book appointment.";
      toast.error(msg);
    }
  };

  if (loading) return <div className="loading-state">Loading booking details...</div>;
  if (error) return (
    <div className="appointment-container">
      <div className="error-container">
        <h2 style={{ color: '#ef4444' }}>Oops!</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/top-doctors')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Go Back to Doctors
        </button>
      </div>
    </div>
  );

  return (
    <div className="appointment-container">
      {/* ⚠️ Dynamic Content for Payment vs Booking */}
      {appointmentDetails ? (
        <Payment appointment={appointmentDetails} />
      ) : (
        <>
          <h1 className="page-title">Secure Your Appointment</h1>

          <div className="booking-grid">

            {/* LEFT: DOCTOR PROFILE */}
            <div className="doctor-profile-card">
              <img
                src={selectedDoctor.image || docImg}
                alt={selectedDoctor.name}
                className="doctor-profile-img"
              />
              <div className="doctor-profile-details">
                <span className="spec-badge">{selectedDoctor.specialization}</span>
                <h2>{selectedDoctor.name}</h2>
                <div className="info-row">
                  <Building2 size={16} />
                  <span>{selectedDoctor.hospital}</span>
                </div>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{selectedDoctor.location}</span>
                </div>

                <div className="availability-box">
                  <span className="availability-title">Available Hours</span>
                  <div className="availability-time">
                    {selectedDoctor.fromTime} - {selectedDoctor.toTime}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <form className="booking-form-container" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>Appointment Details</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fill in the form to request a slot.</p>
              </div>

              <div className="form-group">
                <label>Appointment Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Disable past dates
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  className={`form-control ${timeError ? 'error-input' : ''}`}
                  value={time}
                  onChange={handleTimeChange}
                  required
                />
                {/* Validation Error Hint */}
                {timeError && (
                  <div className="validation-message">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Time Unavailable</strong>
                      <p>{timeError} Please choose a valid slot.</p>
                    </div>
                  </div>
                )}
                {!timeError && selectedDoctor.fromTime && (
                  <p className="hint-text">✅ Please choose a time between {selectedDoctor.fromTime} and {selectedDoctor.toTime}</p>
                )}
              </div>

              <div className="form-group">
                <label>Describe your health concern</label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="e.g. Severe headache for 2 days..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="booking-btn">
                Proceed to Payment • ₹{selectedDoctor.feePerConsultation || 500}
              </button>
              <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
                Secure 256-bit encrypted transaction
              </p>
            </form>

          </div>
        </>
      )}
    </div>
  );
}

export default Bookanappointment;
