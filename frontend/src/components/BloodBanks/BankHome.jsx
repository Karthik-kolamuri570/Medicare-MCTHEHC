import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Using a consistent icon set from react-icons
import {
  FaUniversity,
  FaKey,
  FaSyringe,
  FaHeartbeat,
  FaClipboardList,
  FaClipboardCheck, // Changed for "View Requests"
} from "react-icons/fa";

export default function BloodBankHome() {
  // This generic function handles all API calls, showing success/error notifications.
  // It is flexible enough to work with the updated routes (POST, PUT, GET).
  const handleAction = async (endpoint, method = "GET", payload = {}) => {
    try {
      const res = await axios({
        // Assuming a standard /api prefix for all backend routes
        url: `/api${endpoint}`,
        method,
        data: payload,
      });
      toast.success(`✅ ${res.data.message || "Action completed successfully!"}`);
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || "An error occurred."}`);
    }
  };

  // The features array is now updated to match your Express.js routes precisely.
  const features = [
    {
      icon: <FaUniversity className="text-purple-500" />,
      title: "Register Your Bank",
      desc: "Hospitals and blood banks can register and manage their details.",
      linkText: "Register Now",
      // ROUTE: POST /bank-register
      endpoint: "/blood-bank/bank-register",
      method: "POST",
      payload: { name: "Community Bank", email: "community@example.com", password: "password123" },
    },
    {
      icon: <FaKey className="text-yellow-500" />,
      title: "Bank Login",
      desc: "Authorized bank admins can log in to manage stock and view requests.",
      linkText: "Login",
      // ROUTE: POST /bank-login
      endpoint: "/blood-bank/bank-login",
      method: "POST",
      payload: { email: "admin@example.com", password: "password123" },
    },
    {
      icon: <FaSyringe className="text-sky-500" />,
      title: "Donate Blood",
      desc: "Donors can easily submit requests to donate blood and help save lives.",
      linkText: "Donate Now",
      // ROUTE: POST /donation-request
      endpoint: "/blood-bank-user/donation-request",
      method: "POST",
      payload: { donorName: "Jane Doe", bloodGroup: "A+" },
    },
    {
      icon: <FaHeartbeat className="text-rose-400" />,
      title: "Request Blood",
      desc: "Patients or their relatives can request blood in times of need.",
      linkText: "Request Now",
      // ROUTE: POST /request-donation
      endpoint: "/blood-bank-user/request-donation",
      method: "POST",
      payload: { patientName: "John Smith", bloodGroup: "O-", units: 2 },
    },
    {
      icon: <FaClipboardList className="text-indigo-500" />,
      title: "Manage Stock",
      desc: "Keep track of available blood types and quantities in real-time.",
      linkText: "Update Stock",
      // ROUTE: PUT /update-stock
      endpoint: "/blood-bank/update-stock",
      method: "PUT",
      payload: { O_neg: 10, AB_pos: 5 },
    },
    {
      icon: <FaClipboardCheck className="text-green-500" />,
      title: "View All Requests",
      desc: "Admins can view all pending blood donation and recipient requests.",
      linkText: "View Requests",
      // ROUTE: GET /blood-requests
      endpoint: "/blood-bank-user/blood-requests",
      method: "GET", // No payload needed for GET
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} />

      {/* Header & Hero Section */}
      <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navbar */}
          <nav className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold tracking-wide">Blood Bank Portal</h1>
            <ul className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              <li><a href="#banks" className="hover:opacity-80 transition-opacity">Banks</a></li>
              <li><a href="#donors" className="hover:opacity-80 transition-opacity">Donors</a></li>
              <li><a href="#requests" className="hover:opacity-80 transition-opacity">Requests</a></li>
            </ul>
          </nav>

          {/* Hero Content */}
          <div className="text-center py-20 lg:py-28">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Give Blood, Save Lives 💕
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
              A single drop of blood can make a huge difference. Join us in our mission.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button
                // Calls the bank registration endpoint
                onClick={() => handleAction("/blood-bank/bank-register", "POST", { name: "Hero Bank", email: "hero@example.com", password: "password123"})}
                className="px-8 py-3 bg-white text-red-600 rounded-lg font-semibold shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-red-600 transform hover:scale-105 transition-all duration-300"
              >
                Register Bank
              </button>
              <button
                // Updated to call the correct endpoint for viewing all donation requests
                // ROUTE: GET /donation-requests
                onClick={() => handleAction("/blood-bank-user/donation-requests", "GET")}
                className="px-8 py-3 bg-white/10 border-2 border-white rounded-lg font-semibold hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                View Donations
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">{feature.desc}</p>
              <button
                onClick={() => handleAction(feature.endpoint, feature.method, feature.payload)}
                className="text-red-500 font-semibold mt-auto self-start hover:text-red-700 transition-colors"
              >
                {feature.linkText} &rarr;
              </button>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Blood Bank Portal. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}