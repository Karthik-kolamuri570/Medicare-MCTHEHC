import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Bookanappointment.css";
import doc from "../assets/doctor1.png";
import toast from "react-hot-toast";

import Payment from "../payments/Payment";// ✅ Import Payment component

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
    <div className="appointment-container">Microsoft.QuickAction.MobileHotspot
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







// // // Bookanappointment.jsx

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import doc from "../assets/doctor1.png";
// import toast from "react-hot-toast";
// import { FiSearch, FiX, FiLoader } from "react-icons/fi"; // Icons are still great!

// import Payment from "../payments/Payment";

// function Bookanappointment() {
//   // --- All of your existing state and logic remains untouched ---
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [problem, setProblem] = useState("");
//   const [appointmentDetails, setAppointmentDetails] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

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
//         setError("Failed to fetch doctor data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     setIsModalOpen(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDoctor || !date || !time || !problem) {
//       toast.error("Please fill in all the fields.");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:1600/api/patient/book-appointment",
//         { doctorId: selectedDoctor._id, date, time, problem }
//       );
//       if (response.status === 201 && response.data.data) {
//         toast.success("Appointment Confirmed! Please proceed to payment.");
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
//       toast.error(err.response?.data?.message || "Error booking appointment.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const filteredDoctors = doctors.filter(
//     (doctor) =>
//       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   // --- The UI (JSX) is completely overhauled with Tailwind CSS classes ---
//   return (
//     <div className="bg-slate-50 min-h-screen flex items-start justify-center p-4 sm:p-8">
//       {!appointmentDetails ? (
//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl">
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
//             Book an Appointment
//           </h1>
//           <p className="text-slate-500 text-center mt-2 mb-8">
//             Choose a specialist and schedule your consultation.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Doctor Selector */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Doctor</label>
//               <div className="flex justify-between items-center border border-slate-300 rounded-lg p-3">
//                 <span className={`font-semibold ${selectedDoctor ? 'text-slate-800' : 'text-slate-400'}`}>
//                   {selectedDoctor ? `Dr. ${selectedDoctor.name}` : "No doctor selected"}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(true)}
//                   className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
//                 >
//                   {selectedDoctor ? "Change" : "Select"}
//                 </button>
//               </div>
//             </div>

//             {/* Date and Time */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">Date</label>
//                 <input
//                   id="date"
//                   type="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   required
//                   className="block w-full px-3 py-2 text-slate-900 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">Time</label>
//                 <input
//                   id="time"
//                   type="time"
//                   value={time}
//                   onChange={(e) => setTime(e.target.value)}
//                   required
//                   className="block w-full px-3 py-2 text-slate-900 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Problem Description */}
//             <div>
//               <label htmlFor="problem" className="block text-sm font-medium text-slate-700 mb-2">Describe Your Problem</label>
//               <textarea
//                 id="problem"
//                 rows="4"
//                 value={problem}
//                 onChange={(e) => setProblem(e.target.value)}
//                 placeholder="Briefly describe your health concern..."
//                 required
//                 className="block w-full px-3 py-2 text-slate-900 bg-white border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
//               ></textarea>
//             </div>

//             {/* Submit Button */}
//             <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
//               {isSubmitting ? (
//                 <>
//                   <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                   Booking...
//                 </>
//               ) : (
//                 "Book & Proceed to Pay"
//               )}
//             </button>
//           </form>
//         </div>
//       ) : (
//         <Payment appointment={appointmentDetails} />
//       )}

//       {/* Doctor Selection Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50 transition-opacity">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
//             <div className="flex justify-between items-center p-4 border-b border-slate-200">
//               <h2 className="text-xl font-bold text-slate-800">Choose Your Specialist</h2>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
//                 <FiX className="h-6 w-6 text-slate-600" />
//               </button>
//             </div>
            
//             <div className="p-4 border-b border-slate-200">
//               <div className="relative">
//                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or specialization..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4">
//               {loading ? (
//                 <p className="text-center text-slate-500">Loading doctors...</p>
//               ) : error ? (
//                 <p className="text-center text-red-600">{error}</p>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {filteredDoctors.map((doctor) => (
//                     <div
//                       key={doctor._id}
//                       className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
//                       onClick={() => handleDoctorSelect(doctor)}
//                     >
//                       <img src={doc} alt={doctor.name} className="w-14 h-14 rounded-full object-cover mr-4 flex-shrink-0" />
//                       <div className="flex-grow">
//                         <h4 className="font-bold text-slate-800">Dr. {doctor.name}</h4>
//                         <p className="text-sm text-slate-600">{doctor.specialization}</p>
//                         <span className="text-xs text-slate-500">{doctor.experience} years experience</span>
//                       </div>
//                     </div>
//                   ))}
//                   {!loading && filteredDoctors.length === 0 && <p className="text-center text-slate-500 md:col-span-2">No doctors found.</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Bookanappointment;