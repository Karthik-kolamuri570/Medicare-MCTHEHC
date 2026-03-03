import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Stethoscope, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  UploadCloud,
  MapPin,
  FileText,
  Phone,
  Calendar,
  Clock,
  Briefcase
} from "lucide-react";
import heroImg from "../../assets/medicare_login_bg.png";
import "./UnifiedRegister.css";

const UnifiedRegister = ({ defaultTab = "patient" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role");
    if (role === "doctor" || role === "patient") {
      return role;
    }
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Common State ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // --- Patient State ---
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  // --- Doctor State ---
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [hospital, setHospital] = useState("");
  const [feePerConsultation, setFeePerConsultation] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [certification, setCertification] = useState(null);
  const [certificationName, setCertificationName] = useState("");

  // Clear fields when switching tabs
  useEffect(() => {
    setError(null);
    setSuccess(null);
    setName("");
    setEmail("");
    setContact("");
    setPassword("");
    setConfirmPassword("");
    setProfileImage(null);
    setProfilePreview(null);
    
    setAge("");
    setGender("");
    setAddress("");

    setSpecialization("");
    setExperience("");
    setLocationStr("");
    setHospital("");
    setFeePerConsultation("");
    setFromTime("");
    setToTime("");
    setCertification(null);
    setCertificationName("");
    
  }, [activeTab]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificationChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertification(file);
      setCertificationName(file.name);
    }
  };

  const validateCommon = () => {
    if (!name || !email || !contact || !password || !confirmPassword) return "All core fields are required.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (contact.length !== 10 || !/^\d{10}$/.test(contact)) return "Contact must be a 10-digit number.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handlePatientSubmit = async () => {
    const commonError = validateCommon();
    if (commonError) throw new Error(commonError);
    if (!age || age <= 0) throw new Error("Please enter a valid age.");
    if (!gender) throw new Error("Please select gender.");
    if (!address) throw new Error("Please enter your address.");

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("contact", contact);
    data.append("password", password);
    data.append("confirmPassword", confirmPassword);
    data.append("age", age);
    data.append("gender", gender);
    data.append("address", address);
    if (profileImage) data.append("profileImage", profileImage);

    const response = await axios.post("/api/patient/register", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
  };

  const handleDoctorSubmit = async () => {
    const commonError = validateCommon();
    if (commonError) throw new Error(commonError);
    if (!specialization) throw new Error("Specialization is required.");
    if (!experience || experience <= 0) throw new Error("Valid experience is required.");
    if (!locationStr) throw new Error("Location is required.");
    if (!hospital) throw new Error("Hospital name is required.");
    if (!feePerConsultation || feePerConsultation <= 0) throw new Error("Valid consultation fee is required.");
    if (!fromTime || !toTime) throw new Error("Availability times are required.");

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("contact", contact);
    data.append("password", password);
    data.append("confirmPassword", confirmPassword);
    data.append("specialization", specialization);
    data.append("experience", experience);
    data.append("location", locationStr);
    data.append("hospital", hospital);
    data.append("feePerConsultation", feePerConsultation);
    data.append("fromTime", fromTime);
    data.append("toTime", toTime);
    
    if (profileImage) data.append("profileImage", profileImage);
    if (certification) data.append("certification", certification);

    const response = await axios.post("/api/doctor/register", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (activeTab === "patient") {
        await handlePatientSubmit();
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login?role=patient"), 2000);
      } else {
        await handleDoctorSubmit();
        setSuccess("Registration successful! Your profile is pending Admin approval. Redirecting...");
        setTimeout(() => navigate("/login?role=doctor"), 3000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const getHeroContent = () => {
    if (activeTab === "patient") {
      return {
        badge: "Patient Registration",
        title: "Join Our Medicare Network",
        desc: "Create your patient account to access top-tier medical professionals, manage your health records, and easily schedule appointments.",
        stat1Val: "Secure",
        stat1Lab: "Health Data",
        stat2Val: "Instant",
        stat2Lab: "Appointments"
      };
    } else {
      return {
        badge: "Doctor Registration",
        title: "Partner With Us",
        desc: "Join our network of elite healthcare providers. Upon admin verification, you'll be able to manage your practice digitally and connect with patients seamlessly.",
        stat1Val: "Verified",
        stat1Lab: "Network",
        stat2Val: "Flexible",
        stat2Lab: "Scheduling"
      };
    }
  };
  const heroContent = getHeroContent();

  return (
    <div className="unified-register-page">
      <div className="unified-register-container">
        
        {/* --- Left Side: Hero --- */}
        <div className="unified-register-hero">
          <img src={heroImg} alt="Healthcare professionals" className="unified-register-hero-bg" />
          <div className="unified-register-hero-gradient"></div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="unified-register-hero-content"
            >
              <div className="unified-register-brand-badge">
                <Stethoscope size={18} />
                <span>Medicare {heroContent.badge}</span>
              </div>
              
              <h1 className="unified-register-hero-title">{heroContent.title}</h1>
              <p className="unified-register-hero-desc">{heroContent.desc}</p>

              <div className="unified-register-stats-grid">
                <div className="unified-register-stat-card">
                  <div className="unified-register-stat-value">{heroContent.stat1Val}</div>
                  <div className="unified-register-stat-label">{heroContent.stat1Lab}</div>
                </div>
                <div className="unified-register-stat-card">
                  <div className="unified-register-stat-value">{heroContent.stat2Val}</div>
                  <div className="unified-register-stat-label">{heroContent.stat2Lab}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- Right Side: Form (Scrollable body) --- */}
        <div className="unified-register-form-wrapper">
          
          <div className="unified-register-header">
            <h1 className="unified-register-title">Create an Account</h1>
            <p className="unified-register-subtitle">Sign up to get started as a {activeTab}</p>
          </div>

          <div className="unified-register-tabs">
            <button 
              type="button" 
              className={`unified-register-tab ${activeTab === "patient" ? "active" : ""}`}
              onClick={() => setActiveTab("patient")}
            >
              <User /> Patient
            </button>
            <button 
              type="button" 
              className={`unified-register-tab ${activeTab === "doctor" ? "active" : ""}`}
              onClick={() => setActiveTab("doctor")}
            >
              <Stethoscope /> Doctor
            </button>
          </div>

          <div className="unified-register-scrollable-form">
            <form className="unified-register-form" onSubmit={handleSubmit}>
              
              {error && (
                <div className="unified-error-toast">
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="unified-error-toast" style={{borderColor: '#10b981', background: '#ecfdf5', color: '#065f46'}}>
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Profile Picture Upload - Shared */}
              <div className="unified-form-group" style={{ marginBottom: '1rem' }}>
                <label className="unified-form-label">Profile Picture (Optional)</label>
                <label className={`unified-file-dropzone ${profileImage ? 'has-file' : ''}`}>
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <UploadCloud />
                  )}
                  <div className="unified-file-drop-text">
                    {profileImage ? profileImage.name : "Click or drag profile image to upload"}
                  </div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfileImageChange} disabled={loading}/>
                </label>
              </div>

              {/* Name & Email */}
              <div className="unified-form-group">
                <label className="unified-form-label">Full Name</label>
                <div className="unified-input-wrapper">
                  <User className="unified-input-icon" />
                  <input type="text" className="unified-form-input" placeholder="John Doe" value={name} onChange={e=>setName(e.target.value)} required disabled={loading}/>
                </div>
              </div>
              <div className="unified-form-group">
                <label className="unified-form-label">Email Address</label>
                <div className="unified-input-wrapper">
                  <Mail className="unified-input-icon" />
                  <input type="email" className="unified-form-input" placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} required disabled={loading}/>
                </div>
              </div>

              {/* Contact */}
              <div className="unified-form-group">
                <label className="unified-form-label">Contact Number</label>
                <div className="unified-input-wrapper">
                  <Phone className="unified-input-icon" />
                  <input type="tel" className="unified-form-input" placeholder="10-digit number" value={contact} onChange={e=>setContact(e.target.value)} required disabled={loading}/>
                </div>
              </div>

              {/* Passwords */}
              <div className="unified-grid-2">
                <div className="unified-form-group">
                  <label className="unified-form-label">Password</label>
                  <div className="unified-input-wrapper">
                    <Lock className="unified-input-icon" />
                    <input type={showPassword ? "text" : "password"} className="unified-form-input" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required disabled={loading}/>
                    <button type="button" className="unified-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="unified-form-group">
                  <label className="unified-form-label">Confirm Password</label>
                  <div className="unified-input-wrapper">
                    <Lock className="unified-input-icon" />
                    <input type={showConfirmPassword ? "text" : "password"} className="unified-form-input" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required disabled={loading}/>
                    <button type="button" className="unified-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* PATIENT ONLY FIELDS */}
              {activeTab === "patient" && (
                <AnimatePresence mode="wait">
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    
                    <div className="unified-grid-2" style={{marginTop:'1.25rem'}}>
                      <div className="unified-form-group">
                        <label className="unified-form-label">Age</label>
                        <div className="unified-input-wrapper">
                          <input type="number" className="unified-form-input" style={{paddingLeft: '1rem'}} placeholder="Years" value={age} onChange={e=>setAge(e.target.value)} required disabled={loading}/>
                        </div>
                      </div>
                      <div className="unified-form-group">
                        <label className="unified-form-label">Gender</label>
                        <div className="unified-radio-group">
                          <label className="unified-radio-label">
                            <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={e=>setGender(e.target.value)} required disabled={loading}/> Male
                          </label>
                          <label className="unified-radio-label">
                            <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={e=>setGender(e.target.value)} required disabled={loading}/> Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="unified-form-group" style={{marginTop:'1.25rem'}}>
                      <label className="unified-form-label">Address</label>
                      <textarea className="unified-form-textarea" placeholder="Enter your full address" value={address} onChange={e=>setAddress(e.target.value)} required disabled={loading}/>
                    </div>

                  </motion.div>
                </AnimatePresence>
              )}


              {/* DOCTOR ONLY FIELDS */}
              {activeTab === "doctor" && (
                 <AnimatePresence mode="wait">
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                   
                   <div className="unified-grid-2" style={{marginTop:'1.25rem'}}>
                     <div className="unified-form-group">
                       <label className="unified-form-label">Specialization</label>
                       <div className="unified-input-wrapper">
                         <Briefcase className="unified-input-icon" />
                         <input type="text" className="unified-form-input" placeholder="e.g. Cardiologist" value={specialization} onChange={e=>setSpecialization(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                     <div className="unified-form-group">
                       <label className="unified-form-label">Experience (Years)</label>
                       <div className="unified-input-wrapper">
                         <Clock className="unified-input-icon" />
                         <input type="number" className="unified-form-input" placeholder="Years" value={experience} onChange={e=>setExperience(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                   </div>

                   <div className="unified-grid-2" style={{marginTop:'1.25rem'}}>
                     <div className="unified-form-group">
                       <label className="unified-form-label">Location</label>
                       <div className="unified-input-wrapper">
                         <MapPin className="unified-input-icon" />
                         <input type="text" className="unified-form-input" placeholder="City/State" value={locationStr} onChange={e=>setLocationStr(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                     <div className="unified-form-group">
                       <label className="unified-form-label">Hospital / Clinic</label>
                       <div className="unified-input-wrapper">
                         <MapPin className="unified-input-icon" />
                         <input type="text" className="unified-form-input" placeholder="Facility Name" value={hospital} onChange={e=>setHospital(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                   </div>

                   <div className="unified-grid-2" style={{marginTop:'1.25rem'}}>
                     <div className="unified-form-group">
                       <label className="unified-form-label">Consultation Fee (₹)</label>
                       <div className="unified-input-wrapper">
                         <input type="number" className="unified-form-input" style={{paddingLeft: '1rem'}} placeholder="Amount" value={feePerConsultation} onChange={e=>setFeePerConsultation(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                   </div>

                   <div className="unified-grid-2" style={{marginTop:'1.25rem'}}>
                     <div className="unified-form-group">
                       <label className="unified-form-label">From Time</label>
                       <div className="unified-input-wrapper">
                         <input type="time" className="unified-form-input" style={{paddingLeft: '1rem'}} value={fromTime} onChange={e=>setFromTime(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                     <div className="unified-form-group">
                       <label className="unified-form-label">To Time</label>
                       <div className="unified-input-wrapper">
                         <input type="time" className="unified-form-input" style={{paddingLeft: '1rem'}} value={toTime} onChange={e=>setToTime(e.target.value)} required disabled={loading}/>
                       </div>
                     </div>
                   </div>

                   {/* Certification Document Upload - DOCTOR ONLY */}
                   <div className="unified-form-group" style={{ marginTop: '1.25rem' }}>
                    <label className="unified-form-label">Medical Certification Document</label>
                    <label className={`unified-file-dropzone ${certification ? 'has-file' : ''}`} style={{ borderColor: certification ? '#10b981' : '#cbd5e1' }}>
                      <FileText />
                      <div className="unified-file-drop-text">
                        {certificationName ? certificationName : "Upload certification document to verify your profile"}
                      </div>
                      <div className="unified-file-drop-subtext">PDF, DOC, DOCX, or Image. Required for admin approval.</div>
                      <input type="file" style={{ display: "none" }} onChange={handleCertificationChange} required={!certification} disabled={loading}/>
                    </label>
                  </div>

                 </motion.div>
               </AnimatePresence>
              )}

              <button type="submit" className="unified-submit-btn" disabled={loading}>
                {loading ? (
                  <div className="unified-spinner"></div>
                ) : (
                  `Register as ${activeTab === 'patient' ? 'Patient' : 'Doctor'}`
                )}
              </button>

            </form>
          </div>

          <div className="unified-register-footer">
            Already registered? 
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/login?role=${activeTab}`); }}>
              Login via your portal
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnifiedRegister;
