import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedDoctorRoute
 * Redirects unauthenticated users or non-doctor roles to the doctor login page.
 * Checks for a JWT token in localStorage AND verifies the stored user role.
 */
const ProtectedDoctorRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login?role=doctor" replace />;
  }

  // Extra check: make sure the stored user record is for a doctor
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      // Patients have an 'age' field; doctors have 'specialization'
      // This prevents a patient token from accessing doctor routes
      const isDoctor = user?.specialization !== undefined || user?.role === "doctor";
      if (!isDoctor) {
        return <Navigate to="/login?role=doctor" replace />;
      }
    } catch (_) {
      return <Navigate to="/login?role=doctor" replace />;
    }
  }

  return children;
};

export default ProtectedDoctorRoute;
