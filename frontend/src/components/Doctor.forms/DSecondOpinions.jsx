import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { formatDistanceToNow } from "date-fns";
import { 
  FiSearch, FiFilter, FiUser, FiCalendar, 
  FiClock, FiLink, FiAlertCircle, FiCheck, 
  FiX, FiChevronRight, FiFileText, FiMessageSquare,
  FiVideo, FiCalendar as FiCalendarIcon, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../ui/Loader";
import "../../styles/DSecondOpinions.css";

const formatSlotDate = (dateStr) => {
  if (!dateStr) return "TBD";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (e) {
    return dateStr;
  }
};

const formatSlotTime = (timeStr) => {
  if (!timeStr) return "TBD";
  try {
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
};

const DSecondOpinions = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/doctor/get-second-opinion");
      const data = res.data?.data || [];
      // Sort by pending first, then by date
      const sortedData = data.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRequests(sortedData);
    } catch (err) {
      console.error("Error fetching second opinions:", err);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, action) => {
    setUpdatingId(id);
    try {
      await api.put(
        `/api/doctor/get-second-opinion/${id}`,
        { status: action }
      );
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: action } : req))
      );
    } catch (err) {
      console.error("Error updating second opinion:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status.toLowerCase() === filter;
    const matchesSearch = 
      req.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.problem?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader />;

  return (
    <div className="dso-container">
      <div className="dso-max-width">
        <header className="dso-header">
          <h1 className="dso-title">Second Opinions</h1>
          <p className="dso-subtitle">Review and manage expert second opinion requests</p>
        </header>

        <section className="dso-controls">
          <div className="dso-search-wrapper">
            <FiSearch className="dso-search-icon" />
            <input
              type="text"
              placeholder="Search by patient or problem..."
              className="dso-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dso-filters">
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                className={`dso-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {filteredRequests.length > 0 ? (
          <motion.div 
            layout 
            className="dso-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => (
                <RequestCard
                  key={req._id}
                  request={req}
                  isUpdating={updatingId === req._id}
                  onRespond={handleResponse}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="dso-empty">
            <FiMessageSquare className="dso-empty-icon" />
            <p className="dso-empty-text">No requests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const RequestCard = ({ request, isUpdating, onRespond }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = request.status.toLowerCase();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`dso-card ${isExpanded ? 'expanded' : ''}`}
    >
      <div className={`dso-card-status-bar status-${status}`}></div>
      
      <div className="dso-card-header">
        <div className="dso-patient-info">
          <div className="dso-name-row">
            <h3>{request.patientId?.name || "Unknown Patient"}</h3>
            {(request.patientId?.age || request.patientId?.gender) && (
              <div className="dso-patient-badges">
                {request.patientId?.age && <span className="dso-p-badge">{request.patientId.age}Y</span>}
                {request.patientId?.gender && <span className="dso-p-badge">{request.patientId.gender[0]}</span>}
              </div>
            )}
          </div>
          <div className="dso-time-ago">
            <FiClock size={12} />
            <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
        <div className={`dso-status-badge badge-${status}`}>
          {status}
        </div>
      </div>

      <div className="dso-slot-info">
        <div className="dso-slot-item">
          <FiCalendarIcon size={14} className="dso-slot-icon" />
          <span>{formatSlotDate(request.date)}</span>
        </div>
        <div className="dso-slot-item">
          <FiClock size={14} className="dso-slot-icon" />
          <span>{formatSlotTime(request.time)}</span>
        </div>
        <div className="dso-slot-item dso-mode-badge">
          {request.mode === 'online' ? <FiVideo size={14} /> : <FiUser size={14} />}
          <span>{request.mode || 'Online'}</span>
        </div>
      </div>

      <div className="dso-info-grid">
        <div className="dso-info-item">
          <FiAlertCircle className="dso-info-icon" />
          <div className="dso-info-content">
            <span className="dso-info-label">Current Problem</span>
            <p className={`dso-info-value ${!isExpanded ? 'dso-truncate' : ''}`}>
              {request.problem}
            </p>
          </div>
        </div>

        <div className="dso-info-item">
          <FiFileText className="dso-info-icon" />
          <div className="dso-info-content">
            <span className="dso-info-label">Past Treatment</span>
            <p className={`dso-info-value ${!isExpanded ? 'dso-truncate' : ''}`}>
              {request.treatment || "No details provided"}
            </p>
          </div>
        </div>
      </div>

      {(request.problem?.length > 100 || (request.treatment?.length > 100)) && (
        <button 
          className="dso-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <><FiChevronUp /> Show Less</>
          ) : (
            <><FiChevronDown /> Read Full History</>
          )}
        </button>
      )}

      {request.files && request.files.length > 0 && (
        <div className="dso-attachments">
          <span className="dso-attachment-title">Medical Attachments ({request.files.length})</span>
          <div className="dso-file-list">
            {request.files.map((file, idx) => (
              <a 
                key={idx} 
                href={file} 
                target="_blank" 
                rel="noreferrer" 
                className="dso-file-link"
              >
                <FiLink /> Doc {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {status === "pending" && (
        <div className="dso-actions">
          <button
            className="dso-btn dso-btn-reject"
            onClick={(e) => { e.stopPropagation(); onRespond(request._id, "rejected"); }}
            disabled={isUpdating}
          >
            <FiX /> Reject
          </button>
          <button
            className="dso-btn dso-btn-accept"
            onClick={(e) => { e.stopPropagation(); onRespond(request._id, "accepted"); }}
            disabled={isUpdating}
          >
            <FiCheck /> Accept
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default DSecondOpinions;
