import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notifications from "./components/Notifications";
import "./App.css";

function App() {
  // Sample notifications data
  const [notifications, setNotifications] = useState([
    { name: "John Doe", date: "March 20, 2025", time: "10:30 AM" },
    { name: "Jane Smith", date: "March 21, 2025", time: "2:00 PM" }
  ]);

  return (
    <div className="app-container">
      <Header />
      <Notifications notifications={notifications} /> {/* Pass notifications properly */}
      <Footer />
    </div>
  );
}

export default App;
