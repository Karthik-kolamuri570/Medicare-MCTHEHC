// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../styles/Bookanappointment.css";
// import doc from "../assets/doctor1.png";
// import toast from "react-hot-toast";

// import Payment from "../payments/Payment";// ✅ Import Payment component

// function Bookanappointment() {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [showDoctorsList, setShowDoctorsList] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Form state
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [problem, setProblem] = useState("");

//   // Payment flow
//   const [appointmentDetails, setAppointmentDetails] = useState(null); // 👈 store appointment data for payment

//   // Fetch doctors
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get("http://localhost:1600/api/doctor/");
//         if (Array.isArray(response.data.data)) {
//           setDoctors(response.data.data);
//         } else {
//           setError("Invalid response format.");
//         }
//       } catch (err) {
//         setError("Failed to fetch doctor data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     setShowDoctorsList(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !date || !time || !problem) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:1600/api/patient/book-appointment",
//         {
//           doctorId: selectedDoctor._id,
//           date,
//           time,
//           problem,
//         }
//       );

//       if (response.status === 201 && response.data.data) {
//         toast.success("Appointment booked! Proceed to payment.");
//         setAppointmentDetails({
//           _id: response.data.data._id,
//           email: response.data.data.patientEmail,
//           doctorName: selectedDoctor.name,
//           date,
//           price: selectedDoctor.fee || 500, // Default fee if not available
//         });
//       }
//     } catch (err) {
//       console.error("Error booking appointment:", err);
//       toast.error("Error booking appointment.");
//     }
//   };

//   return (
//     <div className="appointment-container">
//       <h1>Book an Appointment</h1>

//       {/* Only show form if payment hasn't started */}
//       {!appointmentDetails ? (
//         <form className="appointment-form" onSubmit={handleSubmit}>
//           {/* Doctor Selection */}
//           <div className="form-group">
//             <label>Select Doctor:</label>
//             <button
//               type="button"
//               className="select-doctor-btn"
//               onClick={() => setShowDoctorsList(!showDoctorsList)}
//             >
//               {selectedDoctor ? selectedDoctor.name : "Select Doctor"}
//             </button>

//             {showDoctorsList && (
//               <div className="doctor-list">
//                 {loading ? (
//                   <p>Loading doctors...</p>
//                 ) : error ? (
//                   <p>{error}</p>
//                 ) : (
//                   doctors.map((doctor) => (
//                     <div
//                       key={doctor._id}
//                       className="doctor-item"
//                       onClick={() => handleDoctorSelect(doctor)}
//                     >
//                       <img
//                         src={doc}
//                         alt={doctor.name}
//                         className="doctor-thumbnail"
//                       />
//                       <div className="doctor-info">
//                         <h3>{doctor.name}</h3>
//                         <p><strong>Specialization:</strong> {doctor.specialization}</p>
//                         <p><strong>Experience:</strong> {doctor.experience} years</p>
//                         <p><strong>Hospital:</strong> {doctor.hospital}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Doctor Preview */}
//           {selectedDoctor && (
//             <div className="doctor-profile">
//               <img
//                 src={selectedDoctor.image || doc}
//                 alt={selectedDoctor.name}
//                 className="doctor-image"
//               />
//               <div className="doctor-details">
//                 <h2>{selectedDoctor.name}</h2>
//                 <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
//                 <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
//                 <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
//               </div>
//             </div>
//           )}

//           {/* Date/Time/Problem */}
//           <div className="form-group">
//             <label>Date:</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Time:</label>
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Describe Your Problem:</label>
//             <textarea
//               rows="3"
//               value={problem}
//               onChange={(e) => setProblem(e.target.value)}
//               placeholder="Briefly describe your problem"
//             ></textarea>
//           </div>

//           <button type="submit" className="submit-btn">
//             Book Appointment
//           </button>
//         </form>
//       ) : (
//         // If appointmentDetails is set, show Payment component
//         <Payment appointment={appointmentDetails} />
//       )}
//     </div>
//   );
// }

// export default Bookanappointment;




// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // Added useParams
// import axios from "axios";
// import "../styles/Bookanappointment.css";
// import doc from "../assets/doctor1.png";
// import toast from "react-hot-toast";

// import Payment from "../payments/Payment";

// function Bookanappointment() {
//   const navigate = useNavigate();
//   const { doctorId } = useParams(); // Get doctor ID from route
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Form state
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [problem, setProblem] = useState("");

//   // Payment flow
//   const [appointmentDetails, setAppointmentDetails] = useState(null);

//   // Fetch single doctor details by id on mount or doctorId change
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       console.log("Fetching doctor with ID:", doctorId); // Debugging
//       if (!doctorId) {
//         setError("No doctor selected");
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:1600/api/doctor/profile/${doctorId}`);
//         if (response.data) {
//           console.log("Doctor data:", response.data); // Debugging
//           setSelectedDoctor(response.data.data);
//           setError(null);
//         } else {
//           setError("Doctor not found.");
//         }
//       } catch (err) {
//         setError("Failed to fetch doctor details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctor();
//   }, [doctorId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !date || !time || !problem) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:1600/api/patient/book-appointment",
//         {
//           doctorId: selectedDoctor._id,
//           date,
//           time,
//           problem,
//         }
//       );

//       if (response.status === 201 && response.data.data) {
//         toast.success("Appointment booked! Proceed to payment.");
//         setAppointmentDetails({
//           _id: response.data.data._id,
//           email: response.data.data.patientEmail,
//           doctorName: selectedDoctor.name,
//           date,
//           price: selectedDoctor.fee || 500,
//         });
//       }
//     } catch (err) {
//       console.error("Error booking appointment:", err);
//       toast.error("Error booking appointment.");
//     }
//   };

//   if (loading) return <p>Loading doctor details...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   return (
//     <div className="appointment-container">
//       <h1>Book an Appointment</h1>

//       {!appointmentDetails ? (
//         <>
//           {/* Show selected doctor details */}
//           {selectedDoctor && (
//             <div className="doctor-profile">
//               <img
//                 src={selectedDoctor.image || doc}
//                 alt={selectedDoctor.name}
//                 className="doctor-image"
//               />
//               <div className="doctor-details">
//                 <h2>{selectedDoctor.name}</h2>
//                 <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
//                 <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
//                 <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
//                 {/* You may add more details here */}
//               </div>
//             </div>
//           )}

//           {/* Appointment form */}
//           <form className="appointment-form" onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Date:</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>

//             <div className="form-group">
//               <label>Time:</label>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />
//             </div>

//             <div className="form-group">
//               <label>Describe Your Problem:</label>
//               <textarea
//                 rows="3"
//                 value={problem}
//                 onChange={(e) => setProblem(e.target.value)}
//                 placeholder="Briefly describe your problem"
//               ></textarea>
//             </div>

//             <button type="submit" className="submit-btn">
//               Book Appointment
//             </button>
//           </form>
//         </>
//       ) : (
//         <Payment appointment={appointmentDetails} />
//       )}
//     </div>
//   );
// }

// export default Bookanappointment;































// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // Added useParams

// import axios from "axios";
// import "../styles/Bookanappointment.css";
// import doc from "../assets/doctor1.png";
// import toast from "react-hot-toast";

// import Payment from "../payments/Payment";

// function Bookanappointment() {
//   const navigate = useNavigate();

//   const { doc_id } = useParams();
//   const [doctors, setDoctors] = useState([]);

//   const { doctorId } = useParams(); // Get doctor ID from route

//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Form state
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [problem, setProblem] = useState("");

//   // Payment flow
//   const [appointmentDetails, setAppointmentDetails] = useState(null);

//   // Fetch single doctor details by id on mount or doctorId change
//   useEffect(() => {
//     const fetchDoctor = async () => {
//       console.log("Fetching doctor with ID:", doctorId); // Debugging
//       if (!doctorId) {
//         setError("No doctor selected");
//         setLoading(false);
//         return;
//       }
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:1600/api/doctor/profile/${doctorId}`);
//         if (response.data) {
//           console.log("Doctor data:", response.data); // Debugging
//           setSelectedDoctor(response.data.data);
//           setError(null);

//         } else {
//           setError("Doctor not found.");
//         }
//       } catch (err) {
//         setError("Failed to fetch doctor details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctor();
//   }, [doctorId]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedDoctor || !date || !time || !problem) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:1600/api/patient/book-appointment",
//         {
//           doctorId: selectedDoctor._id,
//           date,
//           time,
//           problem,
//         }
//       );

//       if (response.status === 201 && response.data.data) {
//         toast.success("Appointment booked! Proceed to payment.");
//         setAppointmentDetails({
//           _id: response.data.data._id,
//           email: response.data.data.patientEmail,
//           doctorName: selectedDoctor.name,
//           date,
//           price: selectedDoctor.fee || 500,
//         });
//       }
//     } catch (err) {
//       console.error("Error booking appointment:", err);
//       toast.error("Error booking appointment.");
//     }
//   };

//   if (loading) return <p>Loading doctor details...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   return (
//     <div className="appointment-container">
//       <h1>Book an Appointment</h1>

//       {!appointmentDetails ? (
//         <>
//           {/* Show selected doctor details */}
//           {selectedDoctor && (
//             <div className="doctor-profile">
//               <img
//                 src={selectedDoctor.image || doc}
//                 alt={selectedDoctor.name}
//                 className="doctor-image"
//               />
//               <div className="doctor-details">
//                 <h2>{selectedDoctor.name}</h2>
//                 <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
//                 <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
//                 <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
//                 {/* You may add more details here */}
//               </div>
//             </div>
//           )}

//           {/* Appointment form */}
//           <form className="appointment-form" onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Date:</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>

//             <div className="form-group">
//               <label>Time:</label>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />
//             </div>

//             <div className="form-group">
//               <label>Describe Your Problem:</label>
//               <textarea
//                 rows="3"
//                 value={problem}
//                 onChange={(e) => setProblem(e.target.value)}
//                 placeholder="Briefly describe your problem"
//               ></textarea>
//             </div>

//             <button type="submit" className="submit-btn">
//               Book Appointment
//             </button>
//           </form>
//         </>
//       ) : (
//         <Payment appointment={appointmentDetails} />
//       )}
//     </div>
//   );
// }

// export default Bookanappointment;






















































































































































import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Bookanappointment.css";
import doc from "../assets/doctor1.png";
import toast from "react-hot-toast";
import Payment from "../payments/Payment";

function Bookanappointment() {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");

  // UI state
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
      console.log("Fetching doctor with ID:", doctorId);
      if (!doctorId) {
        setError("No doctor selected");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:1600/api/doctor/profile/${doctorId}`);
        if (response.data) {
          console.log("Doctor data:", response.data);
          setSelectedDoctor(response.data.data);
          setError(null);
          setTimeout(() => setShowAnimation(true), 200);
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        setError("Failed to fetch doctor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const validateForm = () => {
    const errors = {};
    if (!date) errors.date = "Please select a date";
    if (!time) errors.time = "Please select a time";
    if (!problem.trim()) errors.problem = "Please describe your problem";
    
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate <= today) {
      errors.date = "Please select a future date";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);

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
          price: selectedDoctor.feePerConsultation || 500,
        });
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      toast.error("Error booking appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (formStep === 1 && date && time) {
      setFormStep(2);
    } else if (formStep === 1) {
      toast.error("Please select date and time");
    }
  };

  const prevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  // Enhanced inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },

    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },

    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
      transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
      opacity: showAnimation ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    },

    subtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
      transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
      opacity: showAnimation ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: '0.2s',
    },

    mainContent: {
      maxWidth: '800px',
      margin: '0 auto',
      transform: showAnimation ? 'translateY(0)' : 'translateY(30px)',
      opacity: showAnimation ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: '0.4s',
    },

    doctorCard: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      transition: 'all 0.3s ease',
    },

    doctorImage: {
      width: '120px',
      height: '120px',
      borderRadius: '1rem',
      objectFit: 'cover',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    },

    doctorInfo: {
      flex: 1,
    },

    doctorName: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },

    doctorDetail: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    formCard: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      position: 'relative',
      overflow: 'hidden',
    },

    progressBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '4px',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      borderRadius: '0 0 2px 2px',
      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      width: formStep === 1 ? '50%' : '100%',
    },

    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      gap: '1rem',
    },

    step: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },

    stepActive: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    },

    stepInactive: {
      background: '#f1f5f9',
      color: '#64748b',
    },

    formGroup: {
      marginBottom: '1.5rem',
    },

    label: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },

    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
    },

    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },

    inputError: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },

    errorMessage: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    },

    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid #e5e7eb',
      fontSize: '1rem',
      resize: 'vertical',
      minHeight: '100px',
      transition: 'all 0.3s ease',
      outline: 'none',
    },

    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: formStep === 1 ? 'flex-end' : 'space-between',
      marginTop: '2rem',
    },

    button: {
      padding: '0.875rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    primaryButton: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
    },

    secondaryButton: {
      background: '#f8fafc',
      color: '#64748b',
      border: '2px solid #e2e8f0',
    },

    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },

    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: '1rem',
    },

    loadingText: {
      color: '#64748b',
      fontSize: '1.1rem',
    },
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  const handleButtonHover = (e) => {
    if (!e.target.disabled) {
      e.target.style.transform = 'translateY(-2px) scale(1.02)';
      e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
    }
  };

  const handleButtonLeave = (e) => {
    if (!e.target.disabled) {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
    }
  };

  if (loading) {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.container}>
          <div style={styles.loader}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading doctor details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.formCard, textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#64748b' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Book an Appointment</h1>
          <p style={styles.subtitle}>Schedule your consultation with our expert doctors</p>
        </div>

        <div style={styles.mainContent}>
          {!appointmentDetails ? (
            <>
              {/* Doctor Profile Card */}
              {selectedDoctor && (
                <div 
                  style={styles.doctorCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <img
                    src={selectedDoctor.image || doc}
                    alt={selectedDoctor.name}
                    style={styles.doctorImage}
                  />
                  <div style={styles.doctorInfo}>
                    <h2 style={styles.doctorName}>{selectedDoctor.name}</h2>
                    <div style={styles.doctorDetail}>
                      <span>🩺</span>
                      <strong>Specialization:</strong> {selectedDoctor.specialization}
                    </div>
                    <div style={styles.doctorDetail}>
                      <span>📅</span>
                      <strong>Experience:</strong> {selectedDoctor.experience} years
                    </div>
                    <div style={styles.doctorDetail}>
                      <span>🏥</span>
                      <strong>Hospital:</strong> {selectedDoctor.hospital}
                    </div>
                    <div style={styles.doctorDetail}>
                      <span>💰</span>
                      <strong>Consultation Fee:</strong> ₹{selectedDoctor.feePerConsultation || 500}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Form */}
              <div style={styles.formCard}>
                <div style={styles.progressBar}></div>
                
                {/* Step Indicator */}
                <div style={styles.stepIndicator}>
                  <div style={{
                    ...styles.step,
                    ...(formStep === 1 ? styles.stepActive : styles.stepInactive)
                  }}>
                    <span>📅</span>
                    Schedule
                  </div>
                  <div style={{
                    ...styles.step,
                    ...(formStep === 2 ? styles.stepActive : styles.stepInactive)
                  }}>
                    <span>📝</span>
                    Details
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {formStep === 1 && (
                    <>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Select Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{
                            ...styles.input,
                            ...(formErrors.date ? styles.inputError : {})
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                          onBlur={(e) => e.target.style.borderColor = formErrors.date ? '#ef4444' : '#e5e7eb'}
                        />
                        {formErrors.date && <p style={styles.errorMessage}>{formErrors.date}</p>}
                      </div>

                      <div style={styles.formGroup}>
                        <label style={styles.label}>Select Time</label>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          style={{
                            ...styles.input,
                            ...(formErrors.time ? styles.inputError : {})
                          }}
                          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                          onBlur={(e) => e.target.style.borderColor = formErrors.time ? '#ef4444' : '#e5e7eb'}
                        />
                        {formErrors.time && <p style={styles.errorMessage}>{formErrors.time}</p>}
                      </div>
                    </>
                  )}

                  {formStep === 2 && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Describe Your Problem</label>
                      <textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Please describe your symptoms or health concerns in detail..."
                        style={{
                          ...styles.textarea,
                          ...(formErrors.problem ? styles.inputError : {})
                        }}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => e.target.style.borderColor = formErrors.problem ? '#ef4444' : '#e5e7eb'}
                      />
                      {formErrors.problem && <p style={styles.errorMessage}>{formErrors.problem}</p>}
                    </div>
                  )}

                  <div style={styles.buttonGroup}>
                    {formStep === 2 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        style={{...styles.button, ...styles.secondaryButton}}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.borderColor = '#e2e8f0';
                        }}
                      >
                        ← Previous
                      </button>
                    )}
                    
                    {formStep === 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        style={{...styles.button, ...styles.primaryButton}}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          ...styles.button, 
                          ...styles.primaryButton,
                          opacity: isSubmitting ? 0.7 : 1,
                          cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={!isSubmitting ? handleButtonHover : null}
                        onMouseLeave={!isSubmitting ? handleButtonLeave : null}
                      >
                        {isSubmitting ? (
                          <>
                            <div style={styles.loadingSpinner}></div>
                            Booking...
                          </>
                        ) : (
                          <>
                            📅 Book Appointment
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : (
            <Payment appointment={appointmentDetails} />
          )}
        </div>
      </div>
    </>
  );
}

export default Bookanappointment;
