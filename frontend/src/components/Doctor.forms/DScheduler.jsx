import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Calendar, Clock, Lock, Unlock, Settings, EyeOff, CheckCircle2 } from "lucide-react";

function DScheduler() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("17:00");

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/doctor/calendar/config");
      if (res.data.success) {
        setConfig(res.data.data);
        setFromTime(res.data.data.fromTime || "09:00");
        setToTime(res.data.data.toTime || "17:00");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load scheduler configuration");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const generateSlots = () => {
    if (!config) return [];
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const fromMinutes = parseTime(config.fromTime || '09:00');
    const toMinutes = parseTime(config.toTime || '17:00');
    if (fromMinutes === null || toMinutes === null) return [];

    const SLOT_DURATION = 30;
    const allSlots = [];
    for (let m = fromMinutes; m + SLOT_DURATION <= toMinutes; m += SLOT_DURATION) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      const endH = String(Math.floor((m + SLOT_DURATION) / 60)).padStart(2, '0');
      const endM = String((m + SLOT_DURATION) % 60).padStart(2, '0');
      
      const timeStr = `${hh}:${mm}`;
      const isBlocked = (config.blockedSlots || []).some(s => s.date === selectedDate && s.startTime === timeStr);
      
      allSlots.push({
        startTime: timeStr,
        endTime: `${endH}:${endM}`,
        label: `${hh}:${mm} – ${endH}:${endM}`,
        isBlocked
      });
    }
    return allSlots;
  };

  useEffect(() => {
    if (config) {
      setSlots(generateSlots());
    }
  }, [config, selectedDate]);

  const handleUpdateHours = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/doctor/calendar/working-hours", { fromTime, toTime });
      if (res.data.success) {
        toast.success("Working hours updated successfully!");
        fetchConfig();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update working hours");
    }
  };

  const handleToggleBlockDate = async () => {
    try {
      const res = await api.post("/api/doctor/calendar/toggle-date", { date: selectedDate });
      if (res.data.success) {
        toast.success(
          config.blockedDates.includes(selectedDate)
            ? "Date unblocked successfully!"
            : "Date blocked successfully!"
        );
        fetchConfig();
      }
    } catch (err) {
      toast.error("Failed to update date blocking");
    }
  };

  const handleToggleBlockSlot = async (slot) => {
    try {
      const res = await api.post("/api/doctor/calendar/toggle-slot", { date: selectedDate, startTime: slot.startTime });
      if (res.data.success) {
        toast.success(
          slot.isBlocked
            ? "Time slot unblocked successfully!"
            : "Time slot blocked successfully!"
        );
        fetchConfig();
      }
    } catch (err) {
      toast.error("Failed to update slot blocking");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f8fafc' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isDayBlocked = config?.blockedDates?.includes(selectedDate);

  return (
    <div style={{ backgroundColor: "#f8fafc", padding: "2rem", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Availability Scheduler</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
            Set your working hours, block off leaves, or customize individual appointment slots.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          
          {/* LEFT: Config Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Working Hours */}
            <div style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Settings size={20} color="#3b82f6" /> Default Working Hours
              </h2>
              <form onSubmit={handleUpdateHours} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Start Time</label>
                    <input 
                      type="time" 
                      value={fromTime} 
                      onChange={(e) => setFromTime(e.target.value)} 
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.95rem" }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>End Time</label>
                    <input 
                      type="time" 
                      value={toTime} 
                      onChange={(e) => setToTime(e.target.value)} 
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.95rem" }}
                      required
                    />
                  </div>
                </div>
                <button type="submit" style={{ width: "100%", padding: "11px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                  Save Default Hours
                </button>
              </form>
            </div>

            {/* Date Select & Leave Manager */}
            <div style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={20} color="#8b5cf6" /> Select Target Date
              </h2>
              
              <input 
                type="date" 
                value={selectedDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)} 
                style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.95rem", marginBottom: "16px" }}
              />

              <div style={{ padding: "16px", borderRadius: "14px", backgroundColor: isDayBlocked ? "#fef2f2" : "#f0fdf4", border: `1px solid ${isDayBlocked ? "#fee2e2" : "#bbf7d0"}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700", color: isDayBlocked ? "#991b1b" : "#166534" }}>
                      {isDayBlocked ? "🔴 Date Fully Blocked" : "🟢 Taking Appointments"}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: isDayBlocked ? "#b91c1c" : "#15803d" }}>
                      {isDayBlocked ? "Patients cannot book any slots on this day." : "Patients can book available 30-min slots."}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleToggleBlockDate}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: isDayBlocked ? "#dc2626" : "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "750",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  {isDayBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                  {isDayBlocked ? "Unblock Entire Day" : "Block Entire Day"}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: Slot Toggle Grid */}
          <div style={{ background: "white", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)", display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={20} color="#10b981" /> Time Slots configuration
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: "0.82rem", color: "#64748b" }}>
              For {new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}. Toggle individual slots to block/unblock.
            </p>

            {isDayBlocked ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 10px", textAlign: "center", color: "#94a3b8" }}>
                <EyeOff size={48} style={{ marginBottom: "12px" }} />
                <h3 style={{ fontSize: "1rem", color: "#64748b", margin: 0 }}>This date is blocked</h3>
                <p style={{ fontSize: "0.8rem", margin: "4px 0 0 0" }}>Unblock the full day on the left to edit individual slots.</p>
              </div>
            ) : slots.length === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 10px", color: "#64748b" }}>
                No slots generated. Check working hours configuration.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                {slots.map((slot) => (
                  <button 
                    key={slot.startTime}
                    onClick={() => handleToggleBlockSlot(slot)}
                    style={{
                      border: "1px solid",
                      borderColor: slot.isBlocked ? "#fca5a5" : "#e2e8f0",
                      backgroundColor: slot.isBlocked ? "#fff5f5" : "#fff",
                      borderRadius: "10px",
                      padding: "12px 10px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                      position: "relative"
                    }}
                    title={slot.isBlocked ? "Blocked. Click to unblock." : "Active. Click to block."}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: slot.isBlocked ? "#dc2626" : "#334155" }}>
                      {slot.startTime}
                    </span>
                    <span style={{ fontSize: "0.7rem", fontWeight: "500", color: slot.isBlocked ? "#b91c1c" : "#10b981" }}>
                      {slot.isBlocked ? "🚫 Blocked" : "✅ Available"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default DScheduler;
