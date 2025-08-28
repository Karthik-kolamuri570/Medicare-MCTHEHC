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
      setMessage({ type: "error", text: error.response?.data?.message || "Submission failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const Stepper = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 relative">
          <div className={`
            flex flex-col items-center
            ${idx < step ? "text-emerald-600" : idx === step ? "text-blue-600" : "text-gray-400"}
          `}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${idx < step ? "bg-emerald-100 border-emerald-500" : 
                idx === step ? "bg-blue-100 border-blue-500 shadow-lg scale-110" : 
                "bg-gray-50 border-gray-300"}
            `}>
              {idx < step ? <FiCheck className="w-5 h-5" /> : idx + 1}
            </div>
            <span className="mt-2 text-xs font-medium hidden sm:block">{label}</span>
          </div>
          {idx !== steps.length - 1 && (
            <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10
              ${idx < step ? "bg-emerald-500" : "bg-gray-200"}`} 
            />
          )}
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
      className={`
        w-full text-left rounded-2xl p-4 transition-all duration-200
        ${selected ? 
          "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg" : 
          "bg-white border border-gray-200 hover:border-blue-300 hover:shadow"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
      >
        <div className="text-center mb-8 ">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Request a Second Opinion
          </h1>
          <p className="text-gray-600 mt-2">Get expert medical advice from our specialists</p>
        </div>

        <Stepper />

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium
              ${message.type === "error" ? 
                "bg-red-50 text-red-700 border border-red-200" : 
                "bg-emerald-50 text-emerald-700 border border-emerald-200"}
            `}
          >
            {message.type === "error" ? <FiAlertTriangle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doc) => (
                  <Card
                    key={doc._id}
                    onClick={() => setFormData(p => ({ ...p, doctorId: doc._id }))}
                    selected={formData.doctorId === doc._id}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                        <FiUser className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Dr. {doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.specialization || "General Practice"}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">Available</span>
                          <span className="text-gray-500">⭐ 4.8 (120 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Describe Your Medical Concern
                  </label>
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Please provide detailed information about your current medical condition..."
                  />
                </div>
                
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Previous Treatments & Medications
                  </label>
                  <textarea
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List any previous treatments, medications, or procedures..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="!p-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Consultation Mode
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="online">Video Consultation</option>
                    <option value="offline">In-Person Visit</option>
                  </select>
                </Card>

                <Card className="!p-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Card>

                <Card className="!p-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                    <FiClock className="w-4 h-4" /> Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="
                    border-2 border-dashed border-gray-300 rounded-2xl p-8
                    flex flex-col items-center justify-center gap-4
                    bg-gray-50 cursor-pointer transition-all
                    hover:border-blue-500 hover:bg-blue-50
                  "
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUpload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Drop your files here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports: JPG, JPEG, PNG, PDF (Max 10MB each)
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((file, idx) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          {file.type.includes("image") ? "IMG" : "PDF"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
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

        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className={`
              px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium
              ${step === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
            `}
          >
            <FiArrowLeft /> Back
          </motion.button>

          {!isLastStep ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
              className="
                px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600
                text-white font-medium flex items-center gap-2 hover:shadow-lg
              "
            >
              Next <FiArrowRight />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="
                px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500
                text-white font-medium flex items-center gap-2 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Book Consultation <FiArrowRight />
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.form>
    </div>
  );
}