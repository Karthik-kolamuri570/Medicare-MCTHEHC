import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/TopDoctors.css";
import api from '../utils/api';
import defaultDoctorImage from "../assets/doctor1.png";
import {
  MapPin, Clock, Star, Building2, ChevronLeft, ChevronRight,
  Navigation, SlidersHorizontal, X, Search, ChevronDown,
  Award, Stethoscope, UserCheck, BadgeCheck, ArrowRight
} from 'lucide-react';
import NearestHospitalPanel from './NearestHospitalPanel';

/* ── Constants ────────────────────────────────────── */
const FEE_RANGES = [
  { label: "Any Fee",       min: 0,    max: Infinity },
  { label: "Under ₹300",   min: 0,    max: 300 },
  { label: "₹300 – ₹600", min: 300,  max: 600 },
  { label: "₹600 – ₹1000",min: 600,  max: 1000 },
  { label: "₹1000+",       min: 1000, max: Infinity },
];

const RATING_OPTIONS = [
  { label: "Any", min: 0 },
  { label: "3★+", min: 3 },
  { label: "4★+", min: 4 },
  { label: "4.5★+", min: 4.5 },
];

const SPEC_ICONS = {
  "Cardiologist": "🫀", "Dermatologist": "🧴", "Neurologist": "🧠",
  "Orthopedic": "🦴", "Gynecologist": "🩺", "Pediatrician": "👶",
  "Psychiatrist": "💆", "ENT": "👂", "Ophthalmologist": "👁️",
  "General Physician": "💊", "Dentist": "🦷", "Radiologist": "🔬",
};

const isAvailable = (from, to) => {
  if (!from || !to) return false;
  const n = new Date();
  const cur = n.getHours() * 60 + n.getMinutes();
  const [sh, sm] = from.split(':').map(Number);
  const [eh, em] = to.split(':').map(Number);
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
};

/* ── Sub-component: Skeleton card ─────────────────── */
function SkeletonCard() {
  return (
    <div className="td-skeleton-card">
      <div className="td-sk td-sk-img" />
      <div className="td-sk-body">
        <div className="td-sk td-sk-line td-sk-short" />
        <div className="td-sk td-sk-line td-sk-med" />
        <div className="td-sk td-sk-line td-sk-long" />
        <div className="td-sk td-sk-btn" />
      </div>
    </div>
  );
}

/* ── Sub-component: Doctor card (vertical) ────────── */
function DoctorCard({ doc, onProfile, onBook }) {
  const avail = isAvailable(doc.fromTime, doc.toTime);
  const emoji = SPEC_ICONS[doc.specialization] || '🩺';
  const rating = doc.rating ? doc.rating.toFixed(1) : null;
  const starCount = Math.round(doc.rating || 0);

  return (
    <div className="td-card" role="listitem">
      {/* ── Image area ── */}
      <div className="td-card-img-wrap">
        <img
          src={doc.profileImage || defaultDoctorImage}
          alt={doc.name}
          className="td-card-img"
          onError={e => { e.target.src = defaultDoctorImage; }}
        />
        {/* Availability pill */}
        <span className={`td-avail-pill ${avail ? 'td-avail-on' : 'td-avail-off'}`}>
          <span className="td-avail-dot" />
          {avail ? 'Available' : 'Unavailable'}
        </span>
        {/* Verified badge */}
        <span className="td-verified-badge" title="Admin verified">
          <BadgeCheck size={14} />
        </span>
        {/* Specialty emoji overlay */}
        <span className="td-emoji-badge">{emoji}</span>
      </div>

      {/* ── Body ── */}
      <div className="td-card-body">
        {/* Rating row */}
        <div className="td-card-rating-row">
          <span className="td-stars">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                size={12}
                fill={i <= starCount ? '#f59e0b' : 'none'}
                color={i <= starCount ? '#f59e0b' : '#d1d5db'}
                strokeWidth={1.5}
              />
            ))}
          </span>
          <span className="td-rating-num">
            {rating || 'New'}
          </span>
          {doc.totalRatings > 0 && (
            <span className="td-rating-count">({doc.totalRatings})</span>
          )}
        </div>

        {/* Name + specialty */}
        <h3 className="td-card-name">{doc.name}</h3>
        <p className="td-card-spec">{doc.specialization}</p>

        {/* Info chips */}
        <div className="td-card-chips">
          {doc.experience && (
            <span className="td-chip td-chip-blue">
              <Award size={11} /> {doc.experience}yr exp
            </span>
          )}
          {doc.location && (
            <span className="td-chip td-chip-rose">
              <MapPin size={11} /> {doc.location}
            </span>
          )}
        </div>

        {/* Hospital */}
        {doc.hospital && (
          <div className="td-card-hospital">
            <Building2 size={12} />
            <span>{doc.hospital}</span>
          </div>
        )}

        {/* Hours */}
        <div className="td-card-hours">
          <Clock size={12} />
          <span>{doc.fromTime || '09:00'} – {doc.toTime || '17:00'}</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="td-card-footer">
        <div className="td-card-fee">
          <span className="td-fee-label">Consultation</span>
          <span className="td-fee-val">₹{doc.feePerConsultation || 500}</span>
        </div>
        <div className="td-card-actions-row">
          <button className="td-profile-btn" onClick={() => onProfile(doc._id)}>
            Profile
          </button>
          <button className="td-book-btn" onClick={() => onBook(doc._id)}>
            Book <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────── */
function TopDoctors() {
  const navigate = useNavigate();

  const [allDoctors, setAllDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterFeeIdx, setFilterFeeIdx] = useState(0);
  const [filterRatingIdx, setFilterRatingIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Nearest hospital
  const [showHospitalPanel, setShowHospitalPanel] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const handleFindHospital = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setShowHospitalPanel(true); setLocationLoading(false); },
      () => { setLocationLoading(false); alert('Please enable location access.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docRes, specRes] = await Promise.all([
          api.get("/api/doctor/"),
          api.get("/api/doctor/all-specializations"),
        ]);
        if (docRes.data?.data) setAllDoctors(docRes.data.data);
        if (specRes.data?.data) setSpecializations(specRes.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeFilterCount = [filterSpec, filterLocation, filterFeeIdx !== 0, filterRatingIdx !== 0].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchInput(""); setFilterSpec(""); setFilterLocation("");
    setFilterFeeIdx(0); setFilterRatingIdx(0); setCurrentPage(1);
  };

  const filteredDoctors = allDoctors.filter(doc => {
    const q = searchInput.toLowerCase();
    const matchQ = !q || [doc.name, doc.specialization, doc.location, doc.hospital].some(f => (f || '').toLowerCase().includes(q));
    const matchSpec = !filterSpec || doc.specialization === filterSpec;
    const matchLoc = !filterLocation || (doc.location || '').toLowerCase().includes(filterLocation.toLowerCase());
    const fr = FEE_RANGES[filterFeeIdx];
    const fee = doc.feePerConsultation || 0;
    const matchFee = fee >= fr.min && fee <= fr.max;
    const minR = RATING_OPTIONS[filterRatingIdx].min;
    const matchRating = !minR || (doc.rating || 0) >= minR;
    return matchQ && matchSpec && matchLoc && matchFee && matchRating;
  });

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const currentDoctors = filteredDoctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchInput, filterSpec, filterLocation, filterFeeIdx, filterRatingIdx]);

  const handlePageChange = p => {
    if (p >= 1 && p <= totalPages) { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  // Quick-spec chips (top 6 most common)
  const quickSpecs = specializations.slice(0, 8);

  return (
    <div className="td-page">

      {/* ── HERO BANNER ── */}
      <section className="td-hero">
        <div className="td-hero-bg" />
        <div className="td-hero-content">
          <div className="td-hero-text">
            <div className="td-hero-badge">
              <Stethoscope size={14} /> Find a Doctor
            </div>
            <h1 className="td-hero-title">
              Find Your <span className="td-hero-grad">Perfect Specialist</span>
            </h1>
            <p className="td-hero-sub">
              Book appointments with {allDoctors.length > 0 ? `${allDoctors.length}+` : 'top-rated'} verified doctors across India's best hospitals.
            </p>
          </div>

          {/* Search bar inside hero */}
          <div className="td-hero-search">
            <Search size={18} className="td-hero-search-icon" />
            <input
              id="doctor-search-input"
              type="text"
              placeholder="Search by doctor name, specialty, hospital, location..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="td-hero-search-input"
            />
            {searchInput && (
              <button className="td-hero-search-clear" onClick={() => setSearchInput("")}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Hero stat pills */}
          <div className="td-hero-stats">
            <div className="td-hero-stat">
              <UserCheck size={16} /> <strong>{allDoctors.length || '—'}</strong> Verified Doctors
            </div>
            <div className="td-hero-stat-divider" />
            <div className="td-hero-stat">
              <Award size={16} /> <strong>{specializations.length || '—'}</strong> Specializations
            </div>
            <div className="td-hero-stat-divider" />
            <div className="td-hero-stat">
              <Star size={16} fill="#f59e0b" color="#f59e0b" /> Top-rated Care
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK SPECIALTY CHIPS ── */}
      {quickSpecs.length > 0 && (
        <section className="td-quick-specs">
          <div className="td-quick-specs-inner">
            {quickSpecs.map(s => (
              <button
                key={s}
                className={`td-quick-chip ${filterSpec === s ? 'td-quick-chip-active' : ''}`}
                onClick={() => setFilterSpec(filterSpec === s ? '' : s)}
              >
                <span className="td-quick-emoji">{SPEC_ICONS[s] || '🩺'}</span>
                {s}
              </button>
            ))}
            {filterSpec && (
              <button className="td-quick-chip-clear" onClick={() => setFilterSpec('')}>
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── FILTER / ACTIONS BAR ── */}
      <div className="td-controls-bar">
        <div className="td-controls-left">
          {/* Filter toggle */}
          <button
            id="toggle-filters-btn"
            className={`td-filter-toggle ${filtersOpen ? 'active' : ''}`}
            onClick={() => setFiltersOpen(v => !v)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && <span className="td-filter-badge">{activeFilterCount}</span>}
            <ChevronDown size={13} className={`td-chevron ${filtersOpen ? 'rotated' : ''}`} />
          </button>

          {/* Active chips */}
          {filterSpec && (
            <span className="td-active-chip">
              {SPEC_ICONS[filterSpec] || '🩺'} {filterSpec}
              <button className="td-chip-close" onClick={() => setFilterSpec("")}><X size={11} /></button>
            </span>
          )}
          {filterLocation && (
            <span className="td-active-chip">
              📍 {filterLocation}
              <button className="td-chip-close" onClick={() => setFilterLocation("")}><X size={11} /></button>
            </span>
          )}
          {filterFeeIdx !== 0 && (
            <span className="td-active-chip">
              {FEE_RANGES[filterFeeIdx].label}
              <button className="td-chip-close" onClick={() => setFilterFeeIdx(0)}><X size={11} /></button>
            </span>
          )}
          {filterRatingIdx !== 0 && (
            <span className="td-active-chip">
              {RATING_OPTIONS[filterRatingIdx].label}
              <button className="td-chip-close" onClick={() => setFilterRatingIdx(0)}><X size={11} /></button>
            </span>
          )}
          {activeFilterCount > 0 && (
            <button id="clear-all-filters-btn" className="td-clear-all-btn" onClick={clearAllFilters}>
              <X size={13} /> Clear All
            </button>
          )}
        </div>

        <div className="td-controls-right">
          {!loading && filteredDoctors.length > 0 && (
            <span className="td-results-count">
              <strong>{filteredDoctors.length}</strong> specialist{filteredDoctors.length !== 1 ? 's' : ''} found
            </span>
          )}
          <button
            className="td-hospital-btn"
            onClick={handleFindHospital}
            disabled={locationLoading}
            id="find-nearest-hospital-btn"
          >
            {locationLoading ? <span className="td-btn-spinner" /> : <Navigation size={15} />}
            {locationLoading ? 'Locating...' : 'Nearest Hospital'}
          </button>
        </div>
      </div>

      {/* ── EXPANDED FILTER PANEL ── */}
      {filtersOpen && (
        <div className="td-filter-panel">
          <div className="td-filter-grid">
            {/* Specialization */}
            <div className="td-filter-group">
              <label className="td-filter-label">Specialization</label>
              <select
                id="filter-specialization"
                className="td-filter-select"
                value={filterSpec}
                onChange={e => setFilterSpec(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{SPEC_ICONS[s] || '🩺'} {s}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="td-filter-group">
              <label className="td-filter-label">Location</label>
              <div className="td-filter-input-wrap">
                <MapPin size={14} className="td-filter-input-icon" />
                <input
                  id="filter-location"
                  type="text"
                  className="td-filter-input"
                  placeholder="City, area or state..."
                  value={filterLocation}
                  onChange={e => setFilterLocation(e.target.value)}
                />
                {filterLocation && (
                  <button className="td-filter-input-clear" onClick={() => setFilterLocation("")}><X size={12} /></button>
                )}
              </div>
            </div>

            {/* Fee */}
            <div className="td-filter-group">
              <label className="td-filter-label">Consultation Fee</label>
              <div className="td-pill-group">
                {FEE_RANGES.map((r, i) => (
                  <button key={i} className={`td-pill ${filterFeeIdx === i ? 'td-pill-active' : ''}`} onClick={() => setFilterFeeIdx(i)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="td-filter-group">
              <label className="td-filter-label">Minimum Rating</label>
              <div className="td-pill-group">
                {RATING_OPTIONS.map((r, i) => (
                  <button key={i} className={`td-pill ${filterRatingIdx === i ? 'td-pill-active' : ''}`} onClick={() => setFilterRatingIdx(i)}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="td-filter-footer">
            <button className="td-clear-all-btn td-clear-lg" onClick={clearAllFilters}>
              <X size={13} /> Clear All
            </button>
            <button className="td-apply-btn" onClick={() => setFiltersOpen(false)}>
              Show {filteredDoctors.length} Results
            </button>
          </div>
        </div>
      )}

      {/* ── DOCTOR GRID ── */}
      <div className="td-grid" role="list">
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="td-empty">
            <div className="td-empty-icon">🔍</div>
            <h3>No specialists found</h3>
            <p>Try adjusting your search terms or clearing some filters.</p>
            {(searchInput || activeFilterCount > 0) && (
              <button className="td-clear-all-btn td-clear-lg" onClick={clearAllFilters}>
                <X size={13} /> Clear All Filters
              </button>
            )}
          </div>
        )}

        {!loading && currentDoctors.map((doc, i) => (
          <DoctorCard
            key={doc._id || i}
            doc={doc}
            onProfile={id => navigate(`/top-doctors/${id}`)}
            onBook={id => navigate(`/book-appointment/${id}`)}
          />
        ))}
      </div>

      {/* ── PAGINATION ── */}
      {!loading && totalPages > 1 && (
        <div className="td-pagination">
          <button
            className="td-pg-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="td-pg-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} className="td-pg-ellipsis">…</span>
                  : <button
                      key={p}
                      className={`td-pg-num ${p === currentPage ? 'td-pg-active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >{p}</button>
              )}
          </div>

          <button
            className="td-pg-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── HOSPITAL PANEL ── */}
      {showHospitalPanel && userLocation && (
        <NearestHospitalPanel userLocation={userLocation} onClose={() => setShowHospitalPanel(false)} />
      )}
    </div>
  );
}

export default TopDoctors;
