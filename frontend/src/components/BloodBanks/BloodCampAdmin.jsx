

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:1600/api/blood-camp";

// export default function DoctorAdminCampPortal() {
//   const [camps, setCamps] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editCamp, setEditCamp] = useState(null);
//   const [form, setForm] = useState({
//     name: "",
//     start_date: "",
//     end_date: "",
//     location: {
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       pincode: "",
//       geo: { lat: "", lng: "" }
//     },
//     timings: [],
//     description: "",
//     contact_phone: "",
//     contact_email: "",
//   });
//   const [alert, setAlert] = useState({ type: "", msg: "" });

//   // Donor related states
//   const [donorModalOpen, setDonorModalOpen] = useState(false);
//   const [selectedCamp, setSelectedCamp] = useState(null);
//   const [donors, setDonors] = useState([]);
//   const [donorForm, setDonorForm] = useState({
//     donorId: "",
//     blood_group: "",
//     units: "",
//     donation_time: "",
//     verified: false,
//   });
//   const [donorAlert, setDonorAlert] = useState({ type: "", msg: "" });

//   useEffect(() => {
//     fetchCamps();
//   }, []);

//   async function fetchCamps() {
//     try {
//       const res = await axios.get(`${API_BASE}/camps`, { withCredentials: true });
//       setCamps(res.data);
//     } catch {
//       setAlert({ type: "error", msg: "Failed to fetch camps." });
//     }
//   }

//   async function handleCreateOrEdit(e) {
//     e.preventDefault();
//     setAlert({ type: "", msg: "" });

//     if (!form.name.trim()) {
//       setAlert({ type: "error", msg: "Camp name is required." });
//       return;
//     }
//     if (form.timings.length === 0) {
//       setAlert({ type: "error", msg: "Please add at least one timing." });
//       return;
//     }

//     try {
//       if (editCamp) {
//         await axios.put(`${API_BASE}/update-camps/${editCamp._id}`, form, { withCredentials: true });
//         setAlert({ type: "success", msg: "Camp updated!" });
//       } else {
//         await axios.post(`${API_BASE}/create-camps`, form, { withCredentials: true });
//         setAlert({ type: "success", msg: "Camp created!" });
//       }
//       setShowModal(false);
//       resetForm();
//       setEditCamp(null);
//       fetchCamps();
//     } catch (err) {
//       setAlert({ type: "error", msg: err?.response?.data?.message || "Operation failed." });
//     }
//   }

//   async function handleDeleteCamp(id) {
//     if (!window.confirm("Delete this camp?")) return;
//     try {
//       await axios.delete(`${API_BASE}/delete-camp/${id}`, { withCredentials: true });
//       setAlert({ type: "success", msg: "Camp deleted." });
//       fetchCamps();
//     } catch {
//       setAlert({ type: "error", msg: "Delete failed." });
//     }
//   }

//   function resetForm() {
//     setForm({
//       name: "",
//       start_date: "",
//       end_date: "",
//       location: { address: "", city: "", state: "", country: "", pincode: "", geo: { lat: "", lng: "" } },
//       timings: [],
//       description: "",
//       contact_phone: "",
//       contact_email: "",
//     });
//   }

//   function startEditCamp(camp) {
//     setEditCamp(camp);
//     setForm({
//       name: camp.name,
//       start_date: camp.start_date?.slice(0, 10) || "",
//       end_date: camp.end_date?.slice(0, 10) || "",
//       location: {
//         address: camp.location?.address || "",
//         city: camp.location?.city || "",
//         state: camp.location?.state || "",
//         country: camp.location?.country || "",
//         pincode: camp.location?.pincode || "",
//         geo: camp.location?.geo || { lat: "", lng: "" }
//       },
//       timings: camp.timings?.map(t => ({
//         date: t.date?.slice(0, 10) || "",
//         start_time: t.start_time || "",
//         end_time: t.end_time || ""
//       })) || [],
//       description: camp.description || "",
//       contact_phone: camp.contact_phone || "",
//       contact_email: camp.contact_email || ""
//     });
//     setShowModal(true);
//     setAlert({ type: "", msg: "" });
//   }

//   function handleFormChange(e, path) {
//     const value = e.target.value;
//     if (path.startsWith("location.geo.")) {
//       const [, , key] = path.split(".");
//       setForm(f => ({
//         ...f,
//         location: {
//           ...f.location,
//           geo: { ...f.location.geo, [key]: value }
//         }
//       }));
//     } else if (path.startsWith("location.")) {
//       const [, key] = path.split(".");
//       setForm(f => ({
//         ...f,
//         location: { ...f.location, [key]: value }
//       }));
//     } else {
//       setForm(f => ({ ...f, [path]: value }));
//     }
//   }

//   function addTiming() {
//     setForm(f => ({
//       ...f,
//       timings: [...f.timings, { date: "", start_time: "", end_time: "" }]
//     }));
//   }

//   function updateTiming(i, field, val) {
//     const updated = [...form.timings];
//     updated[i][field] = val;
//     setForm(f => ({ ...f, timings: updated }));
//   }

//   function removeTiming(i) {
//     const updated = form.timings.filter((_, idx) => idx !== i);
//     setForm(f => ({ ...f, timings: updated }));
//   }

//   // Donor modal open: fetch and show donors for camp
//   async function openDonorModal(camp) {
//     setSelectedCamp(camp);
//     setDonorModalOpen(true);
//     setDonorForm({ donorId: "", blood_group: "", units: "", donation_time: "", verified: false });
//     setDonorAlert({ type: "", msg: "" });
//     try {
//       const res = await axios.get(`${API_BASE}/${camp._id}/donors`, { withCredentials: true });
//       setDonors(res.data);
//     } catch {
//       setDonorAlert({ type: "error", msg: "Failed to load donors." });
//     }
//   }

//   function closeDonorModal() {
//     setDonorModalOpen(false);
//     setSelectedCamp(null);
//     setDonors([]);
//     setDonorAlert({ type: "", msg: "" });
//   }

//   function handleDonorChange(field, value) {
//     setDonorForm(prev => ({ ...prev, [field]: value }));
//   }

//   async function addDonor(e) {
//   e.preventDefault();
//   try {
//     // Call API to add donor
//     await axios.post(`${API_BASE}/${selectedCamp._id}/add`, donorForm, {
//       withCredentials: true,
//     });

//     // Fetch updated donors after add
//     const res = await axios.get(`${API_BASE}/${selectedCamp._id}/donors`, {
//       withCredentials: true,
//     });
//     setDonors(res.data); // Update frontend state with latest donors

//     // Reset donor form and show success message
//     setDonorForm({ donorId: "", blood_group: "", units: "", donation_time: "", verified: false });
//     setAlert({ type: "success", msg: "Donor added successfully." });
//   } catch (err) {
//     setAlert({
//       type: "error",
//       msg: err.response?.data?.message || "Failed to add donor.",
//     });
//   }
// }

//   function closeModal() {
//     setShowModal(false);
//     resetForm();
//     setEditCamp(null);
//     setAlert({ type: "", msg: "" });
//   }

//   return (
//     <div style={styles.bg}>
//       <div style={styles.header}>
//         <h1 style={styles.logo}><span style={{ color: "#fff", fontWeight: 900 }}>🩸 Blood Bank</span> Camp Admin</h1>
//         <button style={styles.addBtn} onClick={() => { setShowModal(true); resetForm(); }}>+ Organize Camp</button>
//       </div>

//       {alert.msg && (
//         <div style={{
//           background: alert.type === "success" ? "#dbffe6" : "#ffe3e3",
//           color: alert.type === "success" ? "#26703b" : "#a10000",
//           padding: "12px 18px",
//           borderRadius: 12,
//           fontWeight: 600,
//           margin: "12px 0",
//           maxWidth: 480
//         }}>{alert.msg}</div>
//       )}

//       <div style={styles.campGrid}>
//         {camps.map((camp) => (
//           <div style={styles.campCard} key={camp._id}>
//             <div style={styles.cardTitleRow}>
//               <h2 style={{ margin: 0, fontSize: 24, color: "#c41e3a" }}>{camp.name}</h2>
//               <div style={{ fontSize: 15, color: "#a00", fontWeight: 600 }}>{camp.status?.toUpperCase()}</div>
//             </div>

//             <div style={{ fontSize: 14 }}>
//               {camp.location?.address}, <span style={{ color: "#666" }}>{camp.location?.city}, {camp.location?.state}</span>
//             </div>

//             <div style={{ margin: "5px 0" }}>
//               <span style={styles.datePill}>{camp.start_date?.slice(0, 10)}</span>{" "}
//               -{" "}
//               <span style={styles.datePill}>{camp.end_date?.slice(0, 10)}</span>
//             </div>

//             <div style={{ margin: "5px 0 10px 0", color: "#444" }}>
//               Timings: {camp.timings && camp.timings.length > 0 ? camp.timings.map(t =>
//                 <span key={t.date} style={styles.timingBox}>
//                   {new Date(t.date).toLocaleDateString()} {t.start_time}-{t.end_time}
//                 </span>
//               ) : "N/A"}
//             </div>

//             <div style={{ marginBottom: 8 }}>
//               {/* Display total donors here */}
//               <span style={styles.infoBox}><b>Donors:</b> {camp.donations?.length || 0}</span>
//               <span style={styles.infoBox}><b>Volunteers:</b> {camp.volunteers?.length || 0}</span>
//             </div>

//             <div style={styles.cardBtns}>
//               <button style={styles.editBtn} onClick={() => startEditCamp(camp)}>Edit</button>
//               <button style={styles.deleteBtn} onClick={() => handleDeleteCamp(camp._id)}>Delete</button>
//               <button style={styles.donorBtn} onClick={() => openDonorModal(camp)}>Manage Donors</button>
//             </div>

//             <div style={{ marginTop: 2, fontSize: 13, color: "#888" }}>Contact: {camp.contact_phone} | {camp.contact_email}</div>
//             <div style={{ marginTop: 2, fontSize: 13, color: "#888" }}>Description: {camp.description}</div>
//           </div>
//         ))}
//       </div>

//       {/* Modal for Create/Edit Camp */}
//       {showModal && (
//         <div style={styles.overlay} onClick={closeModal}>
//           <form onClick={e => e.stopPropagation()} onSubmit={handleCreateOrEdit} style={styles.modalCard}>

//             <div style={styles.modalHeader}>
//               <h2 style={{ fontWeight: 900, color: "#a00", margin: 0 }}>{editCamp ? "Edit" : "Organize"} Blood Camp</h2>
//               <button type="button" style={styles.modalCloseBtn} onClick={closeModal} aria-label="Close Modal">&times;</button>
//             </div>

//             <div style={styles.modalBody}>

//               <input
//                 required
//                 placeholder="Camp Name"
//                 value={form.name}
//                 onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                 style={styles.input}
//               />

//               <div style={styles.flexRow}>
//                 <input
//                   type="date"
//                   required
//                   value={form.start_date}
//                   onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
//                   style={styles.inputHalf}
//                 />
//                 <input
//                   type="date"
//                   required
//                   value={form.end_date}
//                   onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
//                   style={styles.inputHalf}
//                 />
//               </div>

//               <fieldset style={styles.fieldset}>
//                 <legend>Location</legend>
//                 <input
//                   required
//                   placeholder="Address"
//                   value={form.location.address}
//                   onChange={e => handleFormChange(e, "location.address")}
//                   style={styles.input}
//                 />
//                 <div style={styles.flexRow}>
//                   <input
//                     placeholder="City"
//                     value={form.location.city}
//                     onChange={e => handleFormChange(e, "location.city")}
//                     style={styles.inputThird}
//                   />
//                   <input
//                     placeholder="State"
//                     value={form.location.state}
//                     onChange={e => handleFormChange(e, "location.state")}
//                     style={styles.inputThird}
//                   />
//                   <input
//                     placeholder="Country"
//                     value={form.location.country}
//                     onChange={e => handleFormChange(e, "location.country")}
//                     style={styles.inputThird}
//                   />
//                 </div>
//                 <input
//                   placeholder="Pincode"
//                   value={form.location.pincode}
//                   onChange={e => handleFormChange(e, "location.pincode")}
//                   style={styles.input}
//                 />
//                 <div style={styles.flexRow}>
//                   <input
//                     placeholder="Latitude"
//                     value={form.location.geo.lat}
//                     onChange={e => handleFormChange(e, "location.geo.lat")}
//                     style={styles.inputHalf}
//                   />
//                   <input
//                     placeholder="Longitude"
//                     value={form.location.geo.lng}
//                     onChange={e => handleFormChange(e, "location.geo.lng")}
//                     style={styles.inputHalf}
//                   />
//                 </div>
//               </fieldset>

//               <fieldset style={styles.fieldset}>
//                 <legend>
//                   Timings
//                   <button type="button" onClick={addTiming} style={styles.addTimingBtnFieldset}>+ Add Timing</button>
//                 </legend>
//                 {form.timings.length === 0 && <p style={{ color: "#a00" }}>No timings added yet</p>}

//                 {form.timings.map((timing, index) => (
//                   <div key={index} style={styles.timingGroup}>
//                     <input
//                       type="date"
//                       required
//                       value={timing.date}
//                       onChange={e => updateTiming(index, "date", e.target.value)}
//                       style={{ ...styles.inputSmall, width: 130 }}
//                       title="Date"
//                     />
//                     <input
//                       type="time"
//                       required
//                       value={timing.start_time}
//                       onChange={e => updateTiming(index, "start_time", e.target.value)}
//                       style={{ ...styles.inputSmall, width: 90 }}
//                       title="Start Time"
//                     />
//                     <input
//                       type="time"
//                       required
//                       value={timing.end_time}
//                       onChange={e => updateTiming(index, "end_time", e.target.value)}
//                       style={{ ...styles.inputSmall, width: 90 }}
//                       title="End Time"
//                     />
//                     <button type="button" onClick={() => removeTiming(index)} style={styles.removeTimingBtnModal} title="Remove Timing">×</button>
//                   </div>
//                 ))}
//               </fieldset>

//               <textarea
//                 placeholder="Description"
//                 value={form.description}
//                 onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                 rows={3}
//                 style={styles.input}
//               />

//               <input
//                 placeholder="Contact Phone"
//                 value={form.contact_phone}
//                 onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
//                 style={styles.input}
//               />

//               <input
//                 type="email"
//                 placeholder="Contact Email"
//                 value={form.contact_email}
//                 onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.modalFooter}>
//               <button type="submit" style={styles.greenBtn}>
//                 {editCamp ? "Update" : "Create"} Camp
//               </button>
//               <button type="button" style={styles.outlineBtn} onClick={closeModal}>Cancel</button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Donor Modal */}
//       {donorModalOpen && (
//         <div style={styles.overlay} onClick={closeDonorModal}>
//           <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
//             <h2 style={{ marginBottom: 10 }}>Manage Donors for "{selectedCamp?.name}"</h2>

//             {donorAlert.msg && (
//               <div style={{
//                 background: donorAlert.type === "success" ? "#dbffe6" : "#ffe3e3",
//                 color: donorAlert.type === "success" ? "#26703b" : "#a10000",
//                 padding: "10px 18px",
//                 borderRadius: 12,
//                 fontWeight: 600,
//                 margin: "12px 0"
//               }}>
//                 {donorAlert.msg}
//               </div>
//             )}

//             <form onSubmit={addDonor} style={{ marginBottom: 20 }}>
//               <input
//                 placeholder="Donor ID"
//                 value={donorForm.donorId}
//                 onChange={e => setDonorForm(f => ({ ...f, donorId: e.target.value }))}
//                 required
//                 style={styles.input}
//               />
//               <input
//                 placeholder="Blood Group"
//                 value={donorForm.blood_group}
//                 onChange={e => setDonorForm(f => ({ ...f, blood_group: e.target.value }))}
//                 required
//                 style={styles.input}
//               />
//               <input
//                 type="number"
//                 min="1"
//                 placeholder="Units Donated"
//                 value={donorForm.units}
//                 onChange={e => setDonorForm(f => ({ ...f, units: e.target.value }))}
//                 required
//                 style={styles.input}
//               />
//               <input
//                 type="datetime-local"
//                 placeholder="Donation Time (optional)"
//                 value={donorForm.donation_time}
//                 onChange={e => setDonorForm(f => ({ ...f, donation_time: e.target.value }))}
//                 style={styles.input}
//               />
//               <label style={{ marginBottom: 10 }}>
//                 <input
//                   type="checkbox"
//                   checked={donorForm.verified}
//                   onChange={e => setDonorForm(f => ({ ...f, verified: e.target.checked }))}
//                 /> Verified
//               </label>
//               <button type="submit" style={styles.greenBtn}>Add Donor</button>
//             </form>

//             <h3>Current Donors</h3>
//             {donors.length === 0 ? (
//               <p>No donors added yet.</p>
//             ) : (
//               <ul style={{ maxHeight: 180, overflowY: "auto", paddingLeft: 20 }}>
//                 {donors.map(d => (
//                   <li key={d._id}>{d.name || d._id} - {d.blood_group || "N/A"} - {d.email || "No Email"}</li>
//                 ))}
//               </ul>
//             )}

//             <button onClick={closeDonorModal} style={styles.outlineBtn}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   async function addDonor(e) {
//     e.preventDefault();
//     if (!donorForm.donorId || !donorForm.blood_group || !donorForm.units) {
//       setDonorAlert({ type: "error", msg: "Please fill all required donor fields." });
//       return;
//     }
//     try {
//       await axios.post(`${API_BASE}/${selectedCamp._id}/add-donor`, donorForm, { withCredentials: true });
//       setDonorAlert({ type: "success", msg: "Donor added successfully." });
//       const res = await axios.get(`${API_BASE}/${selectedCamp._id}/donors`, { withCredentials: true });
//       setDonors(res.data);
//       setDonorForm({ donorId: "", blood_group: "", units: "", donation_time: "", verified: false });
//     } catch (err) {
//       setDonorAlert({ type: "error", msg: err.response?.data?.message || "Failed to add donor." });
//     }
//   }
// }

// const styles = {
//   bg: { minHeight: "100vh", background: "linear-gradient(120deg,#fa8181 0%, #ffe6e6 100%)", paddingBottom: 20 },
//   header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 8vw 10px 8vw", background: "linear-gradient(120deg,#c41e3a 0%, #fa8181 100%)", marginBottom: 14 },
//   logo: { fontSize: 33, letterSpacing: 2, fontWeight: 700, textShadow: "0 1px 4px #fff2" },
//   addBtn: { background: "#fff", color: "#c41e3a", fontWeight: 700, border: 0, padding: "11px 32px", borderRadius: 24, fontSize: 16, boxShadow: "0 2px 8px #eee", cursor: "pointer" },
//   campGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 24, margin: "24px 8vw" },
//   campCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px #eeb4b44d", padding: 24, marginBottom: 10, position: "relative", minHeight: 160 },
//   cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
//   datePill: { background: "#fff7f1", color: "#b00", padding: "2px 9px", fontWeight: 700, borderRadius: 8, fontSize: 14, margin: "0 2px" },
//   timingBox: { background: "#e9f4fa", color: "#1a5276", margin: "0 4px", padding: "2px 7px", borderRadius: 6, fontSize: 13 },
//   infoBox: { background: "#feeded", color: "#ad2121", padding: "2px 9px", borderRadius: 7, fontSize: 13, margin: "0 4px" },
//   cardBtns: { display: "flex", gap: 8, marginTop: 8 },
//   editBtn: { background: "#e7f6ee", color: "#048152", border: 0, borderRadius: 24, fontWeight: 700, padding: "6px 20px", cursor: "pointer" },
//   deleteBtn: { background: "#ffe3e3", color: "#a10000", border: 0, borderRadius: 24, fontWeight: 700, padding: "6px 20px", cursor: "pointer" },
//   donorBtn: { background: "#d4f0ff", color: "#31708f", border: 0, borderRadius: 24, fontWeight: 700, padding: "6px 20px", cursor: "pointer" },
//   overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.25)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" },
//   modalCard: { width: 480, maxHeight: "80vh", display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 4px 32px rgba(181,0,0,0.35)", overflowY: "auto", padding: 24 },
//   modalHeader: { padding: "16px 24px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "900", fontSize: 20, color: "#b22" },
//   modalCloseBtn: { fontSize: 28, border: 0, background: "none", color: "#b22", cursor: "pointer", lineHeight: 1 },
//   modalBody: { padding: 24, overflowY: "auto", flexGrow: 1 },
//   modalFooter: { padding: "12px 24px", borderTop: "1px solid #ddd", display: "flex", justifyContent: "flex-end", gap: 12 },
//   input: { width: "100%", marginBottom: 10, padding: "8px 10px", borderRadius: 7, border: "1px solid #edd", fontSize: 16, fontWeight: 500 },
//   inputSmall: { width: 100, padding: "6px 10px", fontSize: 14, borderRadius: 6, border: "1px solid #edd", marginRight: 6 },
//   flexRow: { display: "flex", gap: 6, marginBottom: 10 },
//   fieldset: { border: "1px solid #d9a9a9", borderRadius: 10, marginTop: 16, padding: "12px 16px", position: "relative" },
//   addTimingBtnFieldset: { position: "absolute", top: 8, right: 16, fontSize: 14, color: "#b22", fontWeight: "600", cursor: "pointer", background: "none", border: "none", userSelect: "none" },
//   timingGroup: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
//   removeTimingBtnModal: { background: "transparent", border: "none", color: "#b22", fontWeight: "bold", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1, marginLeft: 6 },
//   greenBtn: { background: "linear-gradient(90deg,#38ef7d 30%,#11998e 100%)", color: "#fff", fontWeight: 700, border: 0, borderRadius: 23, padding: "8px 24px", fontSize: 15, boxShadow: "0 0px 10px #efefef", cursor: "pointer" },
//   outlineBtn: { background: "#fff", color: "#c41e3a", border: "1.5px solid #e1b4b4", fontWeight: 700, borderRadius: 23, padding: "8px 24px", fontSize: 15, cursor: "pointer" }
// };













































import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:1600/api/blood-camp";

export default function DoctorAdminCampPortal() {
  const [camps, setCamps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCamp, setEditCamp] = useState(null);
  const [form, setForm] = useState({
    name: "", start_date: "", end_date: "",
    location: { address: "", city: "", state: "", country: "", pincode: "", geo: { lat: "", lng: "" } },
    timings: [], description: "", contact_phone: "", contact_email: "",
  });
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [donors, setDonors] = useState([]);
  const [donorForm, setDonorForm] = useState({ donorId:"", blood_group:"", units:"", donation_time:"", verified:false });
  const [donorAlert, setDonorAlert] = useState({ type:"", msg:"" });

  useEffect(() => { fetchCamps(); }, []);

  async function fetchCamps() {
    try {
      const res = await axios.get(`${API_BASE}/camps`, { withCredentials: true });
      setCamps(res.data);
    } catch {
      setAlert({ type:"error", msg:"Failed to fetch camps." });
    }
  }

  // Show only present & future camps
  const today = new Date();
  const upcomingCamps = camps.filter(c => new Date(c.end_date) >= today);

  // --- Form Handlers ---
  function resetForm() {
    setForm({
      name: "", start_date: "", end_date: "",
      location: { address: "", city: "", state: "", country: "", pincode: "", geo: { lat: "", lng: "" } },
      timings: [], description: "", contact_phone: "", contact_email: ""
    });
    setEditCamp(null);
    setAlert({ type: "", msg: "" });
  }
  function openCreateModal() { resetForm(); setShowModal(true); }
  function closeModal() { setShowModal(false); resetForm(); }
  function startEditCamp(camp) {
    setEditCamp(camp);
    setForm({
      name: camp.name,
      start_date: camp.start_date?.slice(0,10) || "",
      end_date: camp.end_date?.slice(0,10) || "",
      location: {
        address: camp.location?.address || "",
        city: camp.location?.city || "",
        state: camp.location?.state || "",
        country: camp.location?.country || "",
        pincode: camp.location?.pincode || "",
        geo: camp.location?.geo || { lat:"", lng:"" }
      },
      timings: camp.timings?.map(t => ({ date: t.date?.slice(0,10) || "", start_time: t.start_time || "", end_time: t.end_time || "" })) || [],
      description: camp.description || "",
      contact_phone: camp.contact_phone || "",
      contact_email: camp.contact_email || ""
    });
    setShowModal(true);
  }
  function handleFormChange(e, path) {
    const v = e.target.value;
    if(path.startsWith("location.geo.")) {
      const key = path.split(".")[2];
      setForm(f => ({...f, location: {...f.location, geo:{...f.location.geo, [key]: v}}}));
    } else if(path.startsWith("location.")) {
      const key = path.split(".")[1];
      setForm(f => ({ ...f, location: { ...f.location, [key]: v } }));
    } else setForm(f => ({ ...f, [path]: v }));
  }
  function addTiming() {
    setForm(f => ({ ...f, timings: [...f.timings, { date:"", start_time:"", end_time:"" }] }));
  }
  function updateTiming(i, field, val) {
    const t = [...form.timings]; t[i][field] = val; setForm(f => ({ ...f, timings: t }));
  }
  function removeTiming(i) {
    setForm(f => ({ ...f, timings: f.timings.filter((_, idx) => idx !== i) }));
  }

  async function handleCreateOrEdit(e) {
    e.preventDefault();
    setAlert({ type: "", msg: "" });
    if (!form.name.trim()) return setAlert({type: "error", msg: "Camp name is required"});
    if (form.timings.length === 0) return setAlert({type: "error", msg: "Please add at least one timing"});
    try {
      if(editCamp) {
        await axios.put(`${API_BASE}/update-camps/${editCamp._id}`, form, { withCredentials: true });
        setAlert({type: "success", msg: "Camp updated!"});
      } else {
        await axios.post(`${API_BASE}/create-camps`, form, { withCredentials: true });
        setAlert({type: "success", msg: "Camp created!"});
      }
      closeModal();
      fetchCamps();
    } catch(err) {
      setAlert({type: "error", msg: err.response?.data?.message || "Operation failed"});
    }
  }

  async function handleDeleteCamp(id) {
    if(!window.confirm("Delete this camp?")) return;
    try {
      await axios.delete(`${API_BASE}/delete-camp/${id}`, { withCredentials: true });
      setAlert({type:"success", msg:"Camp deleted."});
      fetchCamps();
    } catch {
      setAlert({type:"error", msg:"Delete failed."});
    }
  }

  // Donor modal handlers
  async function openDonorModal(camp) {
    setSelectedCamp(camp);
    setDonorModalOpen(true);
    setDonorForm({donorId:"", blood_group:"", units:"", donation_time:"", verified:false});
    setDonorAlert({type:"", msg:""});
    try {
      const res = await axios.get(`${API_BASE}/${camp._id}/donors`, { withCredentials:true });
      setDonors(res.data);
    } catch {
      setDonorAlert({type:"error", msg:"Failed to load donors."});
    }
  }
  function closeDonorModal() {
    setDonorModalOpen(false);
    setSelectedCamp(null);
    setDonors([]);
    setDonorForm({donorId:"", blood_group:"", units:"", donation_time:"", verified:false});
    setDonorAlert({type:"", msg:""});
  }
  function handleDonorChange(field, val) {
    setDonorForm(f => ({...f, [field]: val }));
  }
  async function addDonor(e) {
    e.preventDefault();
    if(!donorForm.donorId || !donorForm.blood_group || !donorForm.units) {
      return setDonorAlert({type:"error", msg:"Please fill all required donor fields"});
    }
    try {
      await axios.post(`${API_BASE}/${selectedCamp._id}/add-donor`, donorForm, { withCredentials: true });
      setDonorAlert({type:"success", msg:"Donor added successfully"});
      const res = await axios.get(`${API_BASE}/${selectedCamp._id}/donors`, { withCredentials: true });
      setDonors(res.data);
      setDonorForm({donorId:"", blood_group:"", units:"", donation_time:"", verified:false});
    } catch(err) {
      setDonorAlert({type:"error", msg: err.response?.data?.message || "Failed to add donor"});
    }
  }

  return (
    <div style={styles.bg}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🩸 Blood Bank Camp Admin</h1>
        <button style={styles.addBtn} onClick={openCreateModal}>+ Organize Camp</button>
      </header>

      {alert.msg &&
        <div
          role="alert"
          style={{
            ...styles.alert,
            background: alert.type === "success" ? "#dbffe6" : "#ffe3e3",
            color: alert.type === "success" ? "#26703b" : "#a10000",
          }}
        >
          {alert.msg}
        </div>
      }

      <main style={styles.campGrid}>
        {upcomingCamps.length === 0 ? (
          <p style={{textAlign:"center",marginTop:40,color:"#999"}}>No active or upcoming camps found.</p>
        ) : upcomingCamps.map(camp => (
          <section key={camp._id} style={styles.campCard} tabIndex={0} aria-label={`Blood camp named ${camp.name}`}>
            <div style={styles.cardTitleRow}>
              <h2 style={styles.campTitle}>{camp.name}</h2>
              <span style={styles.statusBadge}>{camp.status?.toUpperCase() || "UNKNOWN"}</span>
            </div>
            <p style={styles.locationText}>{camp.location?.address}, {camp.location?.city}, {camp.location?.state}</p>
            <p>
              <strong>Dates:</strong> <span style={styles.datePill}>{camp.start_date?.slice(0,10)}</span> - <span style={styles.datePill}>{camp.end_date?.slice(0,10)}</span>
            </p>
            <p>
              <strong>Timings:</strong>{" "}
              {camp.timings && camp.timings.length > 0 ? camp.timings.map(t => (
                <span key={t.date} style={styles.timingPill}>
                  {new Date(t.date).toLocaleDateString()} {t.start_time}–{t.end_time}
                </span>
              )) : "No timings"}
            </p>
            <p>
              <span style={styles.infoBox}><strong>Donors:</strong> {camp.donations?.length || 0}</span>
              <span style={styles.infoBox}><strong>Volunteers:</strong> {camp.volunteers?.length || 0}</span>
            </p>
            <div style={styles.cardBtns}>
              <button style={styles.editBtn} onClick={() => startEditCamp(camp)} aria-label={`Edit camp ${camp.name}`}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => handleDeleteCamp(camp._id)} aria-label={`Delete camp ${camp.name}`}>Delete</button>
              <button style={styles.donorBtn} onClick={() => openDonorModal(camp)} aria-label={`Manage donors for camp ${camp.name}`}>Manage Donors</button>
            </div>
            <p style={styles.contactText}><strong>Contact:</strong> {camp.contact_phone} | {camp.contact_email}</p>
            <p style={styles.descriptionText}><strong>Description:</strong> {camp.description}</p>
          </section>
        ))}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={closeModal}>
          <form style={styles.modalCard} onClick={e => e.stopPropagation()} onSubmit={handleCreateOrEdit}>
            <header style={styles.modalHeader}>
              <h2 id="modal-title" style={styles.modalTitle}>{editCamp ? "Edit Blood Camp" : "Organize Blood Camp"}</h2>
              <button type="button" style={styles.modalCloseBtn} aria-label="Close" onClick={closeModal}>&times;</button>
            </header>
            <section style={styles.modalBody}>
              <input type="text" required placeholder="Camp Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={styles.input} />
              <div style={styles.flexRow}>
                <input type="date" required value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} style={styles.inputHalf} />
                <input type="date" required value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} style={styles.inputHalf} />
              </div>
              <fieldset style={styles.fieldset}>
                <legend>Location</legend>
                <input type="text" required placeholder="Address" value={form.location.address} onChange={e => handleFormChange(e, "location.address")} style={styles.input} />
                <div style={styles.flexRow}>
                  <input placeholder="City" value={form.location.city} onChange={e => handleFormChange(e, "location.city")} style={styles.inputThird} />
                  <input placeholder="State" value={form.location.state} onChange={e => handleFormChange(e, "location.state")} style={styles.inputThird} />
                  <input placeholder="Country" value={form.location.country} onChange={e => handleFormChange(e, "location.country")} style={styles.inputThird} />
                </div>
                <input placeholder="Pincode" value={form.location.pincode} onChange={e => handleFormChange(e, "location.pincode")} style={styles.input} />
                <div style={styles.flexRow}>
                  <input placeholder="Latitude" value={form.location.geo.lat} onChange={e => handleFormChange(e, "location.geo.lat")} style={styles.inputHalf} />
                  <input placeholder="Longitude" value={form.location.geo.lng} onChange={e => handleFormChange(e, "location.geo.lng")} style={styles.inputHalf} />
                </div>
              </fieldset>
              <fieldset style={styles.fieldset}>
                <legend>
                  Timings
                  <button type="button" onClick={addTiming} style={styles.addTimingBtnFieldset}>+ Add Timing</button>
                </legend>
                {form.timings.length === 0 && <p style={{ color: "#b22" }}>No timings added</p>}
                {form.timings.map((tim, idx) => (
                  <div key={idx} style={styles.timingGroup}>
                    <input type="date" required value={tim.date} onChange={e => updateTiming(idx, "date", e.target.value)} style={styles.inputSmall} />
                    <input type="time" required value={tim.start_time} onChange={e => updateTiming(idx, "start_time", e.target.value)} style={styles.inputSmall} />
                    <input type="time" required value={tim.end_time} onChange={e => updateTiming(idx, "end_time", e.target.value)} style={styles.inputSmall} />
                    <button type="button" onClick={() => removeTiming(idx)} style={styles.removeTimingBtnModal} aria-label="Remove timing">&times;</button>
                  </div>
                ))}
              </fieldset>
              <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={styles.input} />
              <input placeholder="Contact Phone" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} style={styles.input} />
              <input type="email" placeholder="Contact Email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} style={styles.input} />
            </section>
            <footer style={styles.modalFooter}>
              <button type="submit" style={styles.greenBtn}>{editCamp ? "Update Camp" : "Create Camp"}</button>
              <button type="button" onClick={closeModal} style={styles.outlineBtn}>Cancel</button>
            </footer>
          </form>
        </div>
      )}

      {/* Donor Modal */}
      {donorModalOpen && (
        <div style={styles.overlay} role="dialog" aria-modal="true" onClick={closeDonorModal}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h2>Manage Donors for "{selectedCamp?.name}"</h2>
            {donorAlert.msg && (
              <div style={{
                background: donorAlert.type === "success" ? "#dbffe6" : "#ffe3e3",
                color: donorAlert.type === "success" ? "#26703b" : "#a10000",
                padding: "10px 18px",
                borderRadius: 12,
                margin: "12px 0"
              }}>
                {donorAlert.msg}
              </div>
            )}
            <form onSubmit={addDonor} style={{ marginBottom: 20 }}>
              <input placeholder="Donor ID" value={donorForm.donorId} onChange={e => handleDonorChange("donorId", e.target.value)} required style={styles.input} />
              <input placeholder="Blood Group" value={donorForm.blood_group} onChange={e => handleDonorChange("blood_group", e.target.value)} required style={styles.input} />
              <input type="number" min="1" placeholder="Units" value={donorForm.units} onChange={e => handleDonorChange("units", e.target.value)} required style={styles.input} />
              <input type="datetime-local" placeholder="Donation Time (optional)" value={donorForm.donation_time} onChange={e => handleDonorChange("donation_time", e.target.value)} style={styles.input} />
              <label style={{ display: "block", marginBottom: 10 }}>
                <input type="checkbox" checked={donorForm.verified} onChange={e => handleDonorChange("verified", e.target.checked)} /> Verified
              </label>
              <button type="submit" style={styles.greenBtn}>Add Donor</button>
            </form>
            <h3>Current Donors</h3>
            {donors.length === 0 ? <p>No donors yet.</p> : (
              <ul style={{ maxHeight: 180, overflowY: "auto", paddingLeft: 20 }}>
                {donors.map(d => <li key={d._id}>{d.name || d._id} - {d.blood_group} - {d.email || "No Email"}</li>)}
              </ul>
            )}
            <button onClick={closeDonorModal} style={styles.outlineBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  bg: { minHeight: "100vh", background: "linear-gradient(120deg,#fa8181 0%,#ffe6e6 100%)", paddingBottom: 20 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 8vw 10px 8vw", background: "linear-gradient(120deg,#c41e3a 0%,#fa8181 100%)", marginBottom: 14 },
  logo: { fontSize: 33, letterSpacing: 2, fontWeight: 700, color: "#fff" },
  addBtn: { background: "#fff", color: "#c41e3a", fontWeight: 700, border: 0, padding: "11px 32px", borderRadius: 24, fontSize: 16, boxShadow: "0 2px 8px #eee", cursor: "pointer" },
  alert: { borderRadius: 12, fontWeight: 600, margin: "12px 8vw", maxWidth: 480, padding: "12px 18px" },
  campGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))", gap: 24, margin: "24px 8vw" },
  campCard: { background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px #e4b4b44d", padding: 24, marginBottom: 10, minHeight: 160 },
  cardTitleRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  campTitle: { margin: 0, fontSize: 24, color: "#c41e3a" },
  statusBadge: { fontSize: 15, color: "#a00", fontWeight: 600 },
  locationText: { fontSize: 14, color: "#333", margin: "4px 0" },
  datePill: { background: "#fff7f1", color: "#b00", padding: "2px 9px", borderRadius: 8, fontSize: 14, margin: "0 2px" },
  timingPill: { background: "#e9f4fa", color: "#1a5276", margin: "0 4px", padding: "2px 7px", borderRadius: 6, fontSize: 13, display: "inline-block" },
  infoBox: { background: "#feeded", color: "#ad2121", padding: "2px 9px", borderRadius: 7, fontSize: 13, margin: "0 4px", display: "inline-block" },
  cardBtns: { display: "flex", gap: 8, marginTop: 8 },
  editBtn: { background: "#e7f6ee", color: "#048152", border: 0, borderRadius: 24, padding: "6px 20px", cursor: "pointer", fontWeight: 700 },
  deleteBtn: { background: "#ffe3e3", color: "#a10000", border: 0, borderRadius: 24, padding: "6px 20px", cursor: "pointer", fontWeight: 700 },
  donorBtn: { background: "#d4f0ff", color: "#31708f", border: 0, borderRadius: 24, padding: "6px 20px", cursor: "pointer", fontWeight: 700 },
  contactText: { fontSize: 13, color: "#888", marginTop: 2 },
  descriptionText: { fontSize: 13, color: "#888", marginTop: 2, maxHeight: 48, overflow: "hidden", textOverflow: "ellipsis" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.25)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" },
  modalCard: { width: 480, maxHeight: "80vh", background: "#fff", borderRadius: 14, boxShadow: "0 4px 32px rgba(181,0,0,0.35)", overflowY: "auto", padding: 24, display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #ddd" },
  modalTitle: { margin: 0, color: "#b22", fontWeight: 900 },
  modalCloseBtn: { fontSize: 28, border: 0, background: "none", color: "#b22", cursor: "pointer", lineHeight: 1 },
  modalBody: { paddingTop: 15, flexGrow: 1, overflowY: "auto" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 12, borderTop: "1px solid #ddd" },
  input: { width: "100%", marginBottom: 10, padding: "8px 10px", borderRadius: 7, border: "1px solid #ddd", fontSize: 16, fontWeight: 500 },
  inputHalf: { width: "48%", padding: "8px 10px", borderRadius: 7, border: "1px solid #ddd", fontSize: 16, fontWeight: 500 },
  inputThird: { width: "32%", padding: "8px 10px", borderRadius: 7, border: "1px solid #ddd", fontSize: 16, fontWeight: 500 },
  flexRow: { display: "flex", gap: 6, marginBottom: 10 },
  fieldset: { border: "1px solid #ddd", borderRadius: 10, padding: "12px 16px", position: "relative", marginTop: 16 },
  addTimingBtnFieldset: { position: "absolute", top: 8, right: 16, fontSize: 14, color: "#b22", fontWeight: 600, background: "none", border: "none", cursor: "pointer", userSelect: "none" },
  timingGroup: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
  removeTimingBtnModal: { background: "none", border: 0, color: "#b22", fontWeight: "bold", fontSize: 20, cursor: "pointer" },
  greenBtn: { background: "linear-gradient(90deg,#38ef7d 30%,#11998e 100%)", color: "#fff", border: 0, borderRadius: 23, padding: "8px 24px", fontSize: 15, cursor: "pointer", fontWeight: 700 },
  outlineBtn: { background: "#fff", color: "#c41e3a", border: "1.5px solid #ddd", borderRadius: 23, padding: "8px 24px", fontSize: 15, cursor: "pointer", fontWeight: 700 }
};
