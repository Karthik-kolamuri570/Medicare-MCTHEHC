import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Stethoscope, 
  Shield, 
  Droplets, 
  Activity, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle 
} from "lucide-react";
import adminService from "../../admin/services/adminService";
import heroImg from "../../assets/doctor1.png";
import "./UnifiedLogin.css";

const UnifiedLogin = ({ defaultTab = "patient" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from URL query parameter or defaultTab prop
  const getInitialTab = () => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role");
    if (role === "admin" || role === "doctor" || role === "bank" || role === "patient") {
      return role;
    }
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors and inputs when switching tabs
  useEffect(() => {
    setError(null);
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }, [activeTab]);

  const handlePatientLogin = async () => {
    const response = await axios.post('/api/patient/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.patient) {
        localStorage.setItem('user', JSON.stringify(response.data.patient));
      }
      navigate('/');
    } else {
      throw new Error("Invalid response from server.");
    }
  };

  const handleDoctorLogin = async () => {
    const response = await axios.post("/api/doctor/login", { email, password });
    if (response.data) {
      localStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      if (response.data.doctor) {
        localStorage.setItem("user", JSON.stringify(response.data.doctor));
      }
      navigate("/doctor");
    }
  };

  const handleAdminLogin = async () => {
    const response = await adminService.login(email, password);
    if (response.success) {
      navigate('/admin/dashboard');
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const handleBankLogin = async () => {
    const response = await axios.post("/api/blood-bank/bank-login", { email, password });
    if (response.data.success) {
      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) localStorage.setItem("refreshToken", response.data.refreshToken);
      if (response.data.bank) localStorage.setItem("user", JSON.stringify(response.data.bank));
      navigate("/blood-bank/bank");
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === "patient") await handlePatientLogin();
      else if (activeTab === "doctor") await handleDoctorLogin();
      else if (activeTab === "admin") await handleAdminLogin();
      else if (activeTab === "bank") await handleBankLogin();
    } catch (err) {
      console.error(`${activeTab} login error:`, err);
      setError(
        err.response?.data?.message || err.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPortalName = () => {
    switch(activeTab) {
      case "patient": return "Patient";
      case "doctor": return "Doctor";
      case "admin": return "Admin";
      case "bank": return "Blood Bank";
      default: return "";
    }
  };

  const getForgotPasswordLink = () => {
    if (activeTab === "admin" || activeTab === "bank") return null; 
    return `/forgot-password/${activeTab}`;
  };

  const getRegisterLink = () => {
    switch(activeTab) {
      case "patient": return "/SignUp";
      case "doctor": return "/SignUp";
      case "bank": return "/SignUp";
      case "admin": return null; // Admins usually don't self-register
      default: return null;
    }
  };

  // Hero Content variation based on active tab
  const getHeroContent = () => {
    switch(activeTab) {
      case "patient":
        return {
          badge: "Patient Portal",
          title: "Your Health Journey Starts Here",
          desc: "Access your medical records, book appointments, and connect with your healthcare providers securely.",
          stat1Val: "Seamless",
          stat1Lab: "Care Coordination",
          stat2Val: "24/7",
          stat2Lab: "Access to Records"
        };
      case "doctor":
        return {
          badge: "Provider Portal",
          title: "Empowering Your Practice",
          desc: "Manage your schedule, connect with patients, and review records efficiently through a centralized hub.",
          stat1Val: "10k+",
          stat1Lab: "Appointments Managed",
          stat2Val: "Secure",
          stat2Lab: "Patient Communications"
        };
      case "admin":
        return {
          badge: "Admin Dashboard",
          title: "System Control Center",
          desc: "Oversee operations, manage staff access, and monitor platform health through comprehensive analytics.",
          stat1Val: "Unified",
          stat1Lab: "Platform Management",
          stat2Val: "Real-time",
          stat2Lab: "System Insights"
        };
      case "bank":
        return {
          badge: "Blood Bank Portal",
          title: "Managing Life-Saving Resources",
          desc: "Track inventory, coordinate donation camps, and manage requests efficiently.",
          stat1Val: "Critical",
          stat1Lab: "Inventory Tracking",
          stat2Val: "Live",
          stat2Lab: "Donation Updates"
        };
      default:
        return {
          badge: "Portal",
          title: "Welcome Back",
          desc: "Securely sign in to continue managing your healthcare experience.",
          stat1Val: "Fast",
          stat1Lab: "Secure Access",
          stat2Val: "24/7",
          stat2Lab: "Availability"
        };
    }
  };

  const heroContent = getHeroContent();

  return (
    <div className="unified-login-page">
      <div className="unified-login-container">
        
        {/* --- Left Side: Premium Hero Panel --- */}
        <div className="unified-login-hero">
          <img 
            src={heroImg} 
            alt="Healthcare professionals" 
            className="unified-hero-bg-image" 
          />
          <div className="unified-hero-gradient"></div>
          <div className="unified-pulse-rings"></div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="unified-hero-content"
            >
              <div className="unified-brand-badge">
                <Activity size={18} className="text-sky-300" />
                <span>Medicare {heroContent.badge}</span>
              </div>
              
              <h1 className="unified-hero-title">
                {heroContent.title}
              </h1>
              
              <p className="unified-hero-desc">
                {heroContent.desc}
              </p>

              <div className="unified-stats-grid">
                <div className="unified-stat-card">
                  <div className="unified-stat-value">{heroContent.stat1Val}</div>
                  <div className="unified-stat-label">{heroContent.stat1Lab}</div>
                </div>
                <div className="unified-stat-card">
                  <div className="unified-stat-value">{heroContent.stat2Val}</div>
                  <div className="unified-stat-label">{heroContent.stat2Lab}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>


        {/* --- Right Side: Centralized Login Form --- */}
        <div className="unified-login-form-wrapper">
          
          <div className="unified-login-header">
            <div className="unified-login-logo">
              <Activity size={28} />
            </div>
            <h1 className="unified-login-title">Welcome back</h1>
            <p className="unified-login-subtitle">Select your portal and sign in to continue</p>
          </div>

          {/* Segmented Control (Tabs) */}
          <div className="unified-login-tabs">
            <button 
              type="button" 
              className={`unified-login-tab ${activeTab === "patient" ? "active" : ""}`}
              onClick={() => setActiveTab("patient")}
            >
              <User />
              Patient
            </button>
            <button 
              type="button" 
              className={`unified-login-tab ${activeTab === "doctor" ? "active" : ""}`}
              onClick={() => setActiveTab("doctor")}
            >
              <Stethoscope />
              Doctor
            </button>
            <button 
              type="button" 
              className={`unified-login-tab ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              <Shield />
              Admin
            </button>
            <button 
              type="button" 
              className={`unified-login-tab ${activeTab === "bank" ? "active" : ""}`}
              onClick={() => setActiveTab("bank")}
            >
              <Droplets />
              Bank
            </button>
          </div>

          {/* Form */}
          <form className="unified-login-form" onSubmit={handleSubmit}>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="unified-error"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="unified-form-group">
              <label className="unified-form-label">Email address</label>
              <div className="unified-input-wrapper">
                <Mail className="unified-input-icon" />
                <input 
                  type="email" 
                  className="unified-form-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>

            <div className="unified-form-group">
              <div className="unified-form-label-row">
                <label className="unified-form-label">Password</label>
                {getForgotPasswordLink() && (
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigate(getForgotPasswordLink()); }} 
                    className="unified-form-forgot"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="unified-input-wrapper">
                <Lock className="unified-input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="unified-form-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required 
                />
                <button
                  type="button"
                  className="unified-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="unified-submit-btn" disabled={loading}>
              {loading ? (
                <div className="unified-spinner"></div>
              ) : (
                `Sign In to ${getPortalName()}`
              )}
            </button>

          </form>

          {/* Footer */}
          {getRegisterLink() && (
            <div className="unified-login-footer">
              Don't have an account? 
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigate(getRegisterLink()); }}
              >
                Create an account
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
