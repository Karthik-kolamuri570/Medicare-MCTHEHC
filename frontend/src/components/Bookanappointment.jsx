import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios for fetching data
import "../styles/Bookanappointment.css";
import doc from "../assets/doctor1.png";

function Bookanappointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]); // State to store doctor data
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Selected doctor
  const [showDoctorsList, setShowDoctorsList] = useState(false); // Control visibility of the doctor list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  
  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [problem, setProblem] = useState('');

  // Function to fetch doctor data from the backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:1600/api/doctor/'); // Your API endpoint
      if (Array.isArray(response.data.data)) {
        setDoctors(response.data.data); // Store fetched doctors in the state
      } else {
        setError('The data returned from the server is in an incorrect format');
      }
    } catch (err) {
      setError('Failed to fetch doctor data');
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  // Fetch doctors when the component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle selecting a doctor
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor); // Set the selected doctor
    setShowDoctorsList(false); // Hide the doctor list after selection
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !date || !time || !problem) {
      alert("Please fill in all the fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:1600/api/patient/book-appointment', {
        doctorId: selectedDoctor._id,
        date,
        time,
        problem
      });
      
      if (response.status === 201) {
        alert("Appointment booked successfully!");
        navigate("/notifications");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("There was an error booking the appointment.");
    }
  };

  return (
    <div>
      {/* Book an Appointment Section */}
      <div className="appointment-container">
        <h1>Book an Appointment</h1>
        <form className="appointment-form" onSubmit={handleSubmit}>
          {/* Select Doctor Section */}
          <div className="form-group">
            <label>Select Doctor:</label>
            <button
              type="button"
              className="select-doctor-btn"
              onClick={() => setShowDoctorsList(!showDoctorsList)}
            >
              {selectedDoctor ? selectedDoctor.name : "Select Doctor"}
            </button>

            {/* Display the list of doctors when the button is clicked */}
            {showDoctorsList && (
              <div className="doctor-list">
                {loading ? (
                  <p>Loading doctors...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  doctors.map((doctor) => (
                    <div
                      key={doctor._id} // Ensure each doctor has a unique key
                      className="doctor-item"
                      onClick={() => handleDoctorSelect(doctor)} // Handle doctor selection
                    >
                      <img
                        src={doc || 'path/to/default-image.jpg'} // Use a default image if none provided
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

          {/* Display Selected Doctor's Profile */}
          {selectedDoctor && (
            <div className="doctor-profile">
              <img
                // src={selectedDoctor.image || 'path/to/default-image.jpg'}
                src={selectedDoctor.image ? selectedDoctor.image : doc}
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

          {/* Date & Time Fields */}
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="problem">Describe Your Problem:</label>
            <textarea
              id="problem"
              name="problem"
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
      </div>
    </div>
  );
}

export default Bookanappointment;

