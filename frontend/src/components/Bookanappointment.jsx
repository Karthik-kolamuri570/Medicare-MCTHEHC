import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Bookanappointment.css";
import doc from "../assets/doctor1.png";
import toast from "react-hot-toast";
import Payment from "./forms/Payment"; // ✅ Import Payment component

function Bookanappointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorsList, setShowDoctorsList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");

  // Payment flow
  const [appointmentDetails, setAppointmentDetails] = useState(null); // 👈 store appointment data for payment

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:1600/api/doctor/");
        if (Array.isArray(response.data.data)) {
          setDoctors(response.data.data);
        } else {
          setError("Invalid response format.");
        }
      } catch (err) {
        setError("Failed to fetch doctor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorsList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !date || !time || !problem) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1600/api/patient/book-appointment",
        {
          doctorId: selectedDoctor._id,
          date,
          time,
          problem,
        }
      );

      if (response.status === 201 && response.data.data) {
        toast.success("Appointment booked! Proceed to payment.");
        setAppointmentDetails({
          _id: response.data.data._id,
          email: response.data.data.patientEmail,
          doctorName: selectedDoctor.name,
          date,
          price: selectedDoctor.fee || 500, // Default fee if not available
        });
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      toast.error("Error booking appointment.");
    }
  };

  return (
    <div className="appointment-container">
      <h1>Book an Appointment</h1>

      {/* Only show form if payment hasn't started */}
      {!appointmentDetails ? (
        <form className="appointment-form" onSubmit={handleSubmit}>
          {/* Doctor Selection */}
          <div className="form-group">
            <label>Select Doctor:</label>
            <button
              type="button"
              className="select-doctor-btn"
              onClick={() => setShowDoctorsList(!showDoctorsList)}
            >
              {selectedDoctor ? selectedDoctor.name : "Select Doctor"}
            </button>

            {showDoctorsList && (
              <div className="doctor-list">
                {loading ? (
                  <p>Loading doctors...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="doctor-item"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <img
                        src={doc}
                        alt={doctor.name}
                        className="doctor-thumbnail"
                      />
                      <div className="doctor-info">
                        <h3>{doctor.name}</h3>
                        <p><strong>Specialization:</strong> {doctor.specialization}</p>
                        <p><strong>Experience:</strong> {doctor.experience} years</p>
                        <p><strong>Hospital:</strong> {doctor.hospital}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Doctor Preview */}
          {selectedDoctor && (
            <div className="doctor-profile">
              <img
                src={selectedDoctor.image || doc}
                alt={selectedDoctor.name}
                className="doctor-image"
              />
              <div className="doctor-details">
                <h2>{selectedDoctor.name}</h2>
                <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
              </div>
            </div>
          )}

          {/* Date/Time/Problem */}
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Describe Your Problem:</label>
            <textarea
              rows="3"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Briefly describe your problem"
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Book Appointment
          </button>
        </form>
      ) : (
        // If appointmentDetails is set, show Payment component
        <Payment appointment={appointmentDetails} />
      )}
    </div>
  );
}

export default Bookanappointment;
