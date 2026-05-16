import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import defaultDocImg from "../assets/doctor1.png";
import {
  MapPin, Clock, Building2, Star, Award, Phone,
  ChevronRight, Calendar, CheckCircle2, ArrowLeft,
  Stethoscope, UserCheck, BadgeDollarSign, MessageCircle
} from "lucide-react";
import "./DoctorProfile.css";

const SPECIALIZATION_EMOJI = {
  "Cardiologist": "🫀", "Dermatologist": "🧴", "Neurologist": "🧠",
  "Orthopedic": "🦴", "Gynecologist": "🩺", "Pediatrician": "👶",
  "Psychiatrist": "🧠", "ENT": "👂", "Ophthalmologist": "👁️",
  "General Physician": "💊", "Dentist": "🦷", "Radiologist": "🔬",
};

const HIGHLIGHTS = [
  { icon: <UserCheck size={20} />, label: "Admin Verified" },
  { icon: <Award size={20} />, label: "Certified Professional" },
  { icon: <MessageCircle size={20} />, label: "Online Consultations" },
  { icon: <CheckCircle2 size={20} />, label: "Secure Payments" },
];

function StarRating({ rating }) {
  const filled = Math.round(rating || 0);
  return (
    <span className="dp-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          fill={i <= filled ? "#f59e0b" : "none"}
          color={i <= filled ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </span>
  );
}

function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) { setError("Invalid doctor ID."); setLoading(false); return; }
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/doctor/profile/${doctorId}`);
        if (res.data?.data) {
          setDoctor(res.data.data);
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        setError("Failed to load doctor profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Live availability check
  const isAvailableNow = (fromTime, toTime) => {
    if (!fromTime || !toTime) return false;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = fromTime.split(":").map(Number);
    const [eh, em] = toTime.split(":").map(Number);
    return cur >= sh * 60 + sm && cur <= eh * 60 + em;
  };

  if (loading) return (
    <div className="dp-page">
      <div className="dp-skeleton-wrap">
        <div className="dp-skeleton dp-sk-hero" />
        <div className="dp-skeleton dp-sk-card" />
        <div className="dp-skeleton dp-sk-card" />
      </div>
    </div>
  );

  if (error) return (
    <div className="dp-page dp-error-page">
      <div className="dp-error-box">
        <div className="dp-error-icon">😕</div>
        <h2>Oops!</h2>
        <p>{error}</p>
        <button className="dp-back-btn" onClick={() => navigate("/top-doctors")}>
          <ArrowLeft size={18} /> Back to Doctors
        </button>
      </div>
    </div>
  );

  const available = isAvailableNow(doctor.fromTime, doctor.toTime);
  const emoji = SPECIALIZATION_EMOJI[doctor.specialization] || "🩺";

  return (
    <div className="dp-page">
      {/* Back button */}
      <button className="dp-back-chip" onClick={() => navigate("/top-doctors")}>
        <ArrowLeft size={16} /> All Doctors
      </button>

      <div className="dp-layout">
        {/* ── LEFT COLUMN ── */}
        <aside className="dp-aside">
          {/* Profile card */}
          <div className="dp-profile-card">
            <div className="dp-card-banner" />
            <div className="dp-card-content">
              <div className="dp-avatar-wrap">
                <img
                  src={doctor.profileImage || defaultDocImg}
                  alt={doctor.name}
                  className="dp-avatar"
                  onError={e => { e.target.src = defaultDocImg; }}
                />
                <span className={`dp-live-dot ${available ? "dp-dot-on" : "dp-dot-off"}`} />
              </div>

              <div className="dp-spec-pill">
                <span className="dp-spec-emoji">{emoji}</span>
                {doctor.specialization}
              </div>

              <h1 className="dp-name">{doctor.name}</h1>

              {/* Rating */}
              <div className="dp-rating-row">
                <StarRating rating={doctor.rating} />
                <span className="dp-rating-num">
                  {doctor.rating ? doctor.rating.toFixed(1) : "New"}
                </span>
                {doctor.totalRatings > 0 && (
                  <span className="dp-rating-count">({doctor.totalRatings} reviews)</span>
                )}
              </div>

              {/* Status badge */}
              <div className={`dp-status-badge ${available ? "dp-status-on" : "dp-status-off"}`}>
                <span className="dp-status-dot" />
                {available ? "Available Now" : "Currently Unavailable"}
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="dp-info-card">
            <h3 className="dp-info-title">Practice Details</h3>
            <ul className="dp-info-list">
              <li>
                <Building2 size={18} className="dp-info-icon dp-icon-blue" />
                <div>
                  <span className="dp-info-label">Hospital / Clinic</span>
                  <span className="dp-info-val">{doctor.hospital || "—"}</span>
                </div>
              </li>
              <li>
                <MapPin size={18} className="dp-info-icon dp-icon-rose" />
                <div>
                  <span className="dp-info-label">Location</span>
                  <span className="dp-info-val">{doctor.location || "—"}</span>
                </div>
              </li>
              <li>
                <Clock size={18} className="dp-info-icon dp-icon-green" />
                <div>
                  <span className="dp-info-label">Working Hours</span>
                  <span className="dp-info-val">{doctor.fromTime} – {doctor.toTime}</span>
                </div>
              </li>
              <li>
                <Award size={18} className="dp-info-icon dp-icon-amber" />
                <div>
                  <span className="dp-info-label">Experience</span>
                  <span className="dp-info-val">{doctor.experience} years</span>
                </div>
              </li>
              {doctor.contact && (
                <li>
                  <Phone size={18} className="dp-info-icon dp-icon-purple" />
                  <div>
                    <span className="dp-info-label">Contact</span>
                    <span className="dp-info-val">{doctor.contact}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Fee + CTA */}
          <div className="dp-book-card">
            <div className="dp-fee-row">
              <BadgeDollarSign size={20} className="dp-fee-icon" />
              <div>
                <span className="dp-fee-label">Consultation Fee</span>
                <span className="dp-fee-val">₹{doctor.feePerConsultation || 500}</span>
              </div>
            </div>
            <button
              className="dp-book-btn"
              id={`book-doctor-${doctorId}`}
              onClick={() => navigate(`/book-appointment/${doctorId}`)}
            >
              <Calendar size={18} />
              Book Appointment
              <ChevronRight size={18} />
            </button>
            <p className="dp-book-note">🔒 Secure encrypted payment</p>
          </div>
        </aside>

        {/* ── RIGHT COLUMN ── */}
        <main className="dp-main">
          {/* About */}
          <section className="dp-section">
            <div className="dp-section-header">
              <Stethoscope size={20} className="dp-section-icon" />
              <h2>About Dr. {doctor.name.split(" ")[0]}</h2>
            </div>
            <p className="dp-about-text">
              Dr. {doctor.name} is a highly experienced {doctor.specialization} with over{" "}
              {doctor.experience} years of practice at {doctor.hospital || "a leading medical facility"}
              {doctor.location ? ` in ${doctor.location}` : ""}. They are dedicated to providing
              compassionate, evidence-based care and are fully verified by the Medicare platform.
            </p>

            {/* Highlights grid */}
            <div className="dp-highlights-grid">
              {HIGHLIGHTS.map((h, i) => (
                <div key={i} className="dp-highlight-chip">
                  <span className="dp-highlight-icon">{h.icon}</span>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Stats row */}
          <section className="dp-stats-row">
            <div className="dp-stat-box dp-stat-blue">
              <span className="dp-stat-val">{doctor.experience}+</span>
              <span className="dp-stat-lbl">Years Exp.</span>
            </div>
            <div className="dp-stat-box dp-stat-green">
              <span className="dp-stat-val">{doctor.rating ? doctor.rating.toFixed(1) : "New"}</span>
              <span className="dp-stat-lbl">Rating</span>
            </div>
            <div className="dp-stat-box dp-stat-amber">
              <span className="dp-stat-val">{doctor.totalRatings || 0}</span>
              <span className="dp-stat-lbl">Reviews</span>
            </div>
            <div className="dp-stat-box dp-stat-purple">
              <span className="dp-stat-val">₹{doctor.feePerConsultation || 500}</span>
              <span className="dp-stat-lbl">Per Visit</span>
            </div>
          </section>

          {/* Availability Section */}
          <section className="dp-section">
            <div className="dp-section-header">
              <Clock size={20} className="dp-section-icon" />
              <h2>Availability Schedule</h2>
            </div>
            <div className="dp-avail-card">
              <div className="dp-avail-row">
                <span className="dp-avail-label">Regular Hours</span>
                <span className="dp-avail-time">{doctor.fromTime} – {doctor.toTime}</span>
              </div>
              <div className="dp-avail-row">
                <span className="dp-avail-label">Status</span>
                <span className={`dp-avail-status ${available ? "dp-avail-on" : "dp-avail-off"}`}>
                  {available ? "✅ Seeing patients now" : "🕐 Not available at this time"}
                </span>
              </div>
              <div className="dp-avail-note">
                Slot-based appointments — choose your preferred 30-minute window during booking.
              </div>
            </div>
          </section>

          {/* Specialization Info */}
          <section className="dp-section">
            <div className="dp-section-header">
              <Award size={20} className="dp-section-icon" />
              <h2>Specialization</h2>
            </div>
            <div className="dp-spec-detail-card">
              <span className="dp-spec-detail-emoji">{emoji}</span>
              <div>
                <h3 className="dp-spec-detail-name">{doctor.specialization}</h3>
                <p className="dp-spec-detail-desc">
                  Specialized in diagnosing and treating conditions related to {doctor.specialization.toLowerCase()}.
                  {doctor.experience} years of hands-on clinical experience.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="dp-bottom-cta">
            <div>
              <h3>Ready to consult Dr. {doctor.name.split(" ")[0]}?</h3>
              <p>Book a slot — pick your date &amp; preferred time window instantly.</p>
            </div>
            <button
              className="dp-book-btn dp-book-btn-lg"
              onClick={() => navigate(`/book-appointment/${doctorId}`)}
            >
              <Calendar size={18} />
              Book Appointment
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DoctorProfile;
