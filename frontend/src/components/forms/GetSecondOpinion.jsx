// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";

// export default function SecondOpinionForm() {
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     problem: "",
//     treatment: "",
//     date: "",
//     time: "",
//     mode: "online",
//   });
//   const [files, setFiles] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const fileInputRef = useRef(null); // ref for file input reset

//   useEffect(() => {
//     async function fetchDoctors() {
//       try {
//         const res = await axios.get("http://localhost:1600/api/doctor");
//         const data = res.data;
//         console.log("Fetched doctors:", data);
//         setDoctors(data.data || []);
//       } catch (err) {
//         console.error("Failed to fetch doctors:", err);
//       }
//     }
//     fetchDoctors();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFiles(e.target.files);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.doctorId || !formData.problem || !formData.treatment || !formData.date || !formData.time) {
//       setMessage({ type: "error", text: "Please fill all required fields." });
//       return;
//     }
//     if (files.length === 0) {
//       setMessage({ type: "error", text: "Please upload at least one file." });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     const payload = new FormData();

//     for (const key in formData) {
//       payload.append(key, formData[key]);
//     }

//     for (let i = 0; i < files.length; i++) {
//       payload.append("files", files[i]);
//     }

//     try {
//       const res = await axios.post("http://localhost:1600/api/patient/get-second-opinion", payload, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setMessage({ type: "success", text: res.data.message || "Request submitted successfully!" });
//       setFormData({
//         doctorId: "",
//         problem: "",
//         treatment: "",
//         date: "",
//         time: "",
//         mode: "online",
//       });
//       setFiles([]);

//       // Clear file input visually
//       if (fileInputRef.current) {
//         fileInputRef.current.value = null;
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       setMessage({ type: "error", text: error.response?.data?.message || "Submission failed." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
//       <h2>Book Second Opinion</h2>

//       {message && (
//         <p style={{ color: message.type === "error" ? "red" : "green" }}>
//           {message.text}
//         </p>
//       )}

//       <label htmlFor="doctorId">Select Doctor:</label>
//       <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange} required>
//         <option value="">-- Select --</option>
//         {doctors.map((doc) => (
//           <option key={doc._id} value={doc._id}>
//             Dr. {doc.name}
//           </option>
//         ))}
//       </select>

//       <label htmlFor="problem">Problem Description:</label>
//       <textarea
//         id="problem"
//         name="problem"
//         value={formData.problem}
//         onChange={handleChange}
//         required
//         rows={4}
//         placeholder="Describe your problem"
//       />

//       <label htmlFor="treatment">Previous Treatment Details:</label>
//       <textarea
//         id="treatment"
//         name="treatment"
//         value={formData.treatment}
//         onChange={handleChange}
//         required
//         rows={3}
//         placeholder="Describe previous treatments"
//       />

//       <label htmlFor="mode">Mode:</label>
//       <select id="mode" name="mode" value={formData.mode} onChange={handleChange} required>
//         <option value="online">Online</option>
//         <option value="offline">Offline</option>
//       </select>

//       <label htmlFor="date">Date:</label>
//       <input
//         id="date"
//         type="date"
//         name="date"
//         value={formData.date}
//         onChange={handleChange}
//         required
//       />

//       <label htmlFor="time">Time:</label>
//       <input
//         id="time"
//         type="time"
//         name="time"
//         value={formData.time}
//         onChange={handleChange}
//         required
//       />

//       <label htmlFor="files">Upload Files (reports, images, etc.):</label>
//       <input
//         ref={fileInputRef}
//         id="files"
//         type="file"
//         name="files"
//         multiple
//         onChange={handleFileChange}
//         accept=".jpg,.jpeg,.png,.pdf"
//         required
//       />

//       <button type="submit" disabled={loading}>
//         {loading ? "Submitting..." : "Book Appointment"}
//       </button>
//     </form>
//   );
// }



// this is the functionaality for the second opinion form in the frontend - focusing on the functionality
// now i am using the second opinion form in the frontend with  better UI 













// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FiUpload,
//   FiLoader,
//   FiAlertTriangle,
//   FiCheckCircle,
//   FiCheck,
//   FiUser,
//   FiCalendar,
//   FiClock,
//   FiArrowRight,
//   FiArrowLeft,
//   FiTrash2
// } from "react-icons/fi";


// export default function SecondOpinionForm() {
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     problem: "",
//     treatment: "", 
//     date: "",
//     time: "",
//     mode: "online",
//   });
//   const [files, setFiles] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const fileInputRef = useRef(null);

//   const steps = ["Select Doctor", "Medical Details", "Schedule", "Upload Reports"];
//   const [step, setStep] = useState(0);
//   const isLastStep = step === steps.length - 1;

//   useEffect(() => {
//     async function fetchDoctors() {
//       try {
//         const res = await axios.get("http://localhost:1600/api/doctor");
//         setDoctors(res.data?.data || []);
//       } catch (err) {
//         setMessage({ type: "error", text: "Could not load doctor list. Please refresh." });
//       }
//     }
//     fetchDoctors();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selected = Array.from(e.target.files || []);
//     setFiles(prev => [...prev, ...selected]);
//   };

//   const removeFile = (index) => {
//     setFiles(prev => prev.filter((_, idx) => idx !== index));
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const dropped = Array.from(e.dataTransfer.files || []);
//     setFiles(prev => [...prev, ...dropped]);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.doctorId || !formData.problem || !formData.treatment || !formData.date || !formData.time) {
//       setMessage({ type: "error", text: "Please fill all required fields." });
//       return;
//     }
//     if (files.length === 0) {
//       setMessage({ type: "error", text: "Please upload at least one report or file." });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     const payload = new FormData();
//     Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
//     files.forEach(file => payload.append("files", file));

//     try {
//       const res = await axios.post("http://localhost:1600/api/patient/get-second-opinion", payload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage({ type: "success", text: res.data?.message || "Request submitted successfully!" });
//       setFormData({ doctorId: "", problem: "", treatment: "", date: "", time: "", mode: "online" });
//       setFiles([]);
//       if (fileInputRef.current) fileInputRef.current.value = null;
//       setStep(0);
//     } catch (error) {
//       setMessage({ type: "error", text: error.response?.data?.message || "Submission failed. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const Stepper = () => (
//     <div className="flex items-center justify-between mb-8">
//       {steps.map((label, idx) => (
//         <div key={label} className="flex-1 relative">
//           <div className={`
//             flex flex-col items-center
//             ${idx < step ? "text-emerald-600" : idx === step ? "text-blue-600" : "text-gray-400"}
//           `}>
//             <div className={`
//               w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
//               ${idx < step ? "bg-emerald-100 border-emerald-500" : 
//                 idx === step ? "bg-blue-100 border-blue-500 shadow-lg scale-110" : 
//                 "bg-gray-50 border-gray-300"}
//             `}>
//               {idx < step ? <FiCheck className="w-5 h-5" /> : idx + 1}
//             </div>
//             <span className="mt-2 text-xs font-medium hidden sm:block">{label}</span>
//           </div>
//           {idx !== steps.length - 1 && (
//             <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10
//               ${idx < step ? "bg-emerald-500" : "bg-gray-200"}`} 
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );

//   const Card = ({ children, onClick, selected, className = "" }) => (
//     <motion.button
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       type="button"
//       onClick={onClick}
//       className={`
//         w-full text-left rounded-2xl p-4 transition-all duration-200
//         ${selected ? 
//           "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg" : 
//           "bg-white border border-gray-200 hover:border-blue-300 hover:shadow"}
//         ${className}
//       `}
//     >
//       {children}
//     </motion.button>
//   );

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-12 px-4">
//       <motion.form
//         onSubmit={handleSubmit}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
//       >
//         <div className="text-center mb-8 ">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Request a Second Opinion
//           </h1>
//           <p className="text-gray-600 mt-2">Get expert medical advice from our specialists</p>
//         </div>

//         <Stepper />

//         {message && (
//           <motion.div 
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`
//               mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium
//               ${message.type === "error" ? 
//                 "bg-red-50 text-red-700 border border-red-200" : 
//                 "bg-emerald-50 text-emerald-700 border border-emerald-200"}
//             `}
//           >
//             {message.type === "error" ? <FiAlertTriangle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
//             <span>{message.text}</span>
//           </motion.div>
//         )}

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -10 }}
//             className="space-y-6"
//           >
//             {step === 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {doctors.map((doc) => (
//                   <Card
//                     key={doc._id}
//                     onClick={() => setFormData(p => ({ ...p, doctorId: doc._id }))}
//                     selected={formData.doctorId === doc._id}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
//                         <FiUser className="w-8 h-8" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-bold text-gray-900">Dr. {doc.name}</h3>
//                         <p className="text-sm text-gray-600">{doc.specialization || "General Practice"}</p>
//                         <div className="mt-2 flex items-center gap-2 text-xs">
//                           <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Available</span>
//                           <span className="text-gray-500">⭐ 4.8 (120 reviews)</span>
//                         </div>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             {step === 1 && (
//               <div className="space-y-6">
//                 <div className="relative">
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     Describe Your Medical Concern
//                   </label>
//                   <textarea
//                     name="problem"
//                     value={formData.problem}
//                     onChange={handleChange}
//                     rows={5}
//                     className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     placeholder="Please provide detailed information about your current medical condition..."
//                   />
//                 </div>
                
//                 <div className="relative">
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     Previous Treatments & Medications
//                   </label>
//                   <textarea
//                     name="treatment"
//                     value={formData.treatment}
//                     onChange={handleChange}
//                     rows={4}
//                     className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     placeholder="List any previous treatments, medications, or procedures..."
//                   />
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <Card className="!p-6">
//                   <label className="text-sm font-medium text-gray-700 mb-2 block">
//                     Consultation Mode
//                   </label>
//                   <select
//                     name="mode"
//                     value={formData.mode}
//                     onChange={handleChange}
//                     className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="online">Video Consultation</option>
//                     <option value="offline">In-Person Visit</option>
//                   </select>
//                 </Card>

//                 <Card className="!p-6">
//                   <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
//                     <FiCalendar className="w-4 h-4" /> Preferred Date
//                   </label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleChange}
//                     className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </Card>

//                 <Card className="!p-6">
//                   <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
//                     <FiClock className="w-4 h-4" /> Preferred Time
//                   </label>
//                   <input
//                     type="time"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleChange}
//                     className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </Card>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-6">
//                 <div
//                   onDragOver={handleDragOver}
//                   onDrop={handleDrop}
//                   onClick={() => fileInputRef.current?.click()}
//                   className="
//                     border-2 border-dashed border-gray-300 rounded-2xl p-8
//                     flex flex-col items-center justify-center gap-4
//                     bg-gray-50 cursor-pointer transition-all
//                     hover:border-blue-500 hover:bg-blue-50
//                   "
//                 >
//                   <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
//                     <FiUpload className="w-8 h-8 text-blue-600" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-sm font-medium text-gray-700">
//                       Drop your files here, or click to browse
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Supports: JPG, JPEG, PNG, PDF (Max 10MB each)
//                     </p>
//                   </div>
//                 </div>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   multiple
//                   accept=".jpg,.jpeg,.png,.pdf"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />

//                 {files.length > 0 && (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {files.map((file, idx) => (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         key={idx}
//                         className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200"
//                       >
//                         <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
//                           {file.type.includes("image") ? "IMG" : "PDF"}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
//                           <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeFile(idx)}
//                           className="p-2 text-gray-400 hover:text-red-500"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>

//         <div className="flex items-center justify-between mt-8 pt-6 border-t">
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="button"
//             onClick={() => setStep(s => Math.max(0, s - 1))}
//             disabled={step === 0 || loading}
//             className={`
//               px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium
//               ${step === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
//             `}
//           >
//             <FiArrowLeft /> Back
//           </motion.button>

//           {!isLastStep ? (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="button"
//               onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
//               className="
//                 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
//                 text-white font-medium flex items-center gap-2 hover:shadow-lg
//               "
//             >
//               Next <FiArrowRight />
//             </motion.button>
//           ) : (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={loading}
//               className="
//                 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500
//                 text-white font-medium flex items-center gap-2 hover:shadow-lg
//                 disabled:opacity-50 disabled:cursor-not-allowed
//               "
//             >
//               {loading ? (
//                 <>
//                   <FiLoader className="animate-spin" /> Processing...
//                 </>
//               ) : (
//                 <>
//                   Book Consultation <FiArrowRight />
//                 </>
//               )}
//             </motion.button>
//           )}
//         </div>
//       </motion.form>
//     </div>
//   );
// }

































import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiCheck,
  FiUser,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiArrowLeft,
  FiTrash2
} from "react-icons/fi";

export default function SecondOpinionForm() {
  const [formData, setFormData] = useState({
    doctorId: "",
    problem: "",
    treatment: "",
    date: "",
    time: "",
    mode: "online",
  });
  const [files, setFiles] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const steps = ["Select Doctor", "Medical Details", "Schedule", "Upload Reports"];
  const [step, setStep] = useState(0);
  const isLastStep = step === steps.length - 1;

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await axios.get("http://localhost:1600/api/doctor");
        setDoctors(res.data?.data || []);
      } catch (err) {
        setMessage({ type: "error", text: "Could not load doctor list. Please refresh." });
      }
    }
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!formData.doctorId || !formData.problem || !formData.treatment || !formData.date || !formData.time) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }
    if (files.length === 0) {
      setMessage({ type: "error", text: "Please upload at least one report or file." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    files.forEach(file => payload.append("files", file));

    try {
      const res = await axios.post("http://localhost:1600/api/patient/get-second-opinion", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: res.data?.message || "Request submitted successfully!" });
      setFormData({ doctorId: "", problem: "", treatment: "", date: "", time: "", mode: "online" });
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
      setStep(0);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Submission failed. Try to Login First." });
    } finally {
      setLoading(false);
    }
  };

  const Stepper = () => (
    <div className="stepper">
      {steps.map((label, idx) => (
        <div key={label} className="step-container">
          <div className={`step ${idx < step ? "completed" : idx === step ? "current" : ""}`}>
            <div className="step-circle">
              {idx < step ? <FiCheck className="icon" /> : idx + 1}
            </div>
            <span className="step-label">{label}</span>
          </div>
          {idx !== steps.length - 1 && <div className={`step-line ${idx < step ? "completed" : ""}`}></div>}
        </div>
      ))}
    </div>
  );

  const Card = ({ children, onClick, selected, className = "" }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={`card ${selected ? "selected" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-header">
          <h1 className="form-title">Request a Second Opinion</h1>
          <p className="form-subtitle">Get expert medical advice from our specialists</p>
        </div>

        <Stepper />

        {message && (
          <div className={`message ${message.type}`}>
            {message.type === "error" ? <FiAlertTriangle className="icon" /> : <FiCheckCircle className="icon" />}
            <span>{message.text}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="step-content"
          >
            {step === 0 && (
              <div className="doctor-grid">
                {doctors.map((doc) => (
                  <Card
                    key={doc._id}
                    onClick={() => setFormData(p => ({ ...p, doctorId: doc._id }))}
                    selected={formData.doctorId === doc._id}
                  >
                    <div className="doctor-card">
                      <div className="doctor-icon"><FiUser className="icon" /></div>
                      <div className="doctor-info">
                        <h3 className="doctor-name">Dr. {doc.name}</h3>
                        <p className="doctor-specialization">{doc.specialization || "General Practice"}</p>
                        <div className="doctor-meta">
                          <span className="doctor-status">Available</span>
                          <span className="doctor-reviews">⭐ 4.8 (120 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="form-fields">
                <div>
                  <label className="form-label">Describe Your Medical Concern</label>
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={5}
                    className="form-textarea"
                    placeholder="Please provide detailed information about your current medical condition..."
                  />
                </div>
               
                <div>
                  <label className="form-label">Previous Treatments & Medications</label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={4}
                    className="form-textarea"
                    placeholder="List any previous treatments, medications, or procedures..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="schedule-grid">
                <Card className="padded">
                  <label className="form-label">Consultation Mode</label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="online">Video Consultation</option>
                    <option value="offline">In-Person Visit</option>
                  </select>
                </Card>

                <Card className="padded">
                  <label className="form-label"><FiCalendar className="icon-small" /> Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Card>

                <Card className="padded">
                  <label className="form-label"><FiClock className="icon-small" /> Preferred Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="upload-section">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-area"
                >
                  <div className="upload-icon"><FiUpload className="icon" /></div>
                  <div className="upload-text">
                    <p>Drop your files here, or click to browse</p>
                    <p className="upload-subtext">Supports: JPG, JPEG, PNG, PDF (Max 10MB each)</p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {files.length > 0 && (
                  <div className="file-grid">
                    {files.map((file, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className="file-item"
                      >
                        <div className="file-icon">{file.type.includes("image") ? "IMG" : "PDF"}</div>
                        <div className="file-info">
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => removeFile(idx)} className="file-remove">
                          <FiTrash2 />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="form-actions">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className={`back-button ${step === 0 ? "disabled" : ""}`}
          >
            <FiArrowLeft /> Back
          </motion.button>

          {!isLastStep ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
              className="next-button"
            >
              Next <FiArrowRight />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <FiLoader className="spin" /> Processing...
                </>
              ) : (
                <>
                  Book Consultation <FiArrowRight />
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>

      <style>{`
        /* General */
        .container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(to bottom right, #ebf8ff, #ede9fe, #e0f2fe);
          padding: 3rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .form {
          width: 100%;
          max-width: 64rem;
          background: #fff;
          border: 1px solid #f3f4f6;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        }
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-title {
          font-size: 2.25rem;
          font-weight: 700;
          background: linear-gradient(to right, #2563eb, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .form-subtitle {
          color: #4b5563;
          margin-top: 0.5rem;
        }
        /* Stepper */
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          position: relative;
        }
        .step-container {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #9ca3af;
        }
        .step.completed {
          color: #059669;
        }
        .step.current {
          color: #2563eb;
        }
        .step-circle {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.2s;
        }
        .step.completed .step-circle {
          background: #d1fae5;
          border-color: #059669;
        }
        .step.current .step-circle {
          background: #bfdbfe;
          border-color: #2563eb;
          transform: scale(1.1);
        }
        .step-label {
          margin-top: 0.5rem;
          font-size: 0.75rem;
        }
        .step-line {
          position: absolute;
          top: 1.25rem;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e5e7eb;
          z-index: -1;
        }
        .step-line.completed {
          background: #059669;
        }
        /* Message */
        .message {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        .message.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }
        .message.success {
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }
        .icon {
          width: 1.25rem;
          height: 1.25rem;
        }
        /* Cards */
        .card {
          width: 100%;
          text-align: left;
          border: 1px solid #e5e7eb;
          background: #fff;
          border-radius: 1rem;
          padding: 1rem;
          transition: all 0.2s;
        }
        .card:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 12px rgba(0,0,0,0.1);
        }
        .card.selected {
          background: linear-gradient(to bottom right, #eff6ff, #e0f2fe);
          border-color: #3b82f6;
          box-shadow: 0 8px 12px rgba(0,0,0,0.1);
        }
        .doctor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media(min-width:640px) {
          .doctor-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media(min-width:1024px) {
          .doctor-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .doctor-card {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .doctor-icon {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(to bottom right, #3b82f6, #4f46e5);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.5rem;
        }
        .doctor-name {
          font-weight: 700;
          color: #111827;
        }
        .doctor-specialization {
          font-size: 0.875rem;
          color: #4b5563;
        }
        .doctor-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }
        .doctor-status {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }
        .doctor-reviews {
          color: #6b7280;
        }
        /* Fields */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }
        .form-textarea {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem;
          resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
          outline: none;
        }
        /* Schedule */
        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media(min-width:768px) {
          .schedule-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .padded {
          padding: 1.5rem;
        }
        .form-select,
        .form-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-select:focus,
        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
          outline: none;
        }
        .icon-small {
          width: 1rem;
          height: 1rem;
          vertical-align: middle;
          margin-right: 0.25rem;
        }
        /* Upload */
        .upload-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .upload-area {
          border: 2px dashed #d1d5db;
          background: #f9fafb;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-area:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .upload-icon {
          width: 4rem;
          height: 4rem;
          background: #bfdbfe;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          font-size: 2rem;
          color: #2563eb;
        }
        .upload-text p {
          margin: 0.25rem 0;
        }
        .upload-subtext {
          font-size: 0.75rem;
          color: #6b7280;
        }
        .file-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media(min-width:640px) {
          .file-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .file-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
        }
        .file-icon {
          width: 3rem;
          height: 3rem;
          background: #e5e7eb;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .file-info {
          flex: 1;
          overflow: hidden;
        }
        .file-name {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file-size {
          font-size: 0.75rem;
          color: #6b7280;
        }
        .file-remove {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }
        .file-remove:hover {
          color: #ef4444;
        }
        /* Actions */
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        .back-button,
        .next-button,
        .submit-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.75rem;
          padding: 0.75rem 1.5rem;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .back-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .back-button:hover:not(.disabled) {
          background: #f3f4f6;
        }
        .next-button {
          background: linear-gradient(to right, #2563eb, #4f46e5);
          color: #fff;
        }
        .next-button:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .submit-button {
          background: linear-gradient(to right, #10b981, #3b82f6);
          color: #fff;
        }
        .submit-button:hover:not(:disabled) {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}
