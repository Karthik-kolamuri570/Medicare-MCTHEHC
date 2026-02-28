import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
  FiPlus, FiSearch, FiCalendar, FiMapPin, 
  FiClock, FiPhone, FiMail, FiUsers, 
  FiEdit2, FiTrash2, FiUserPlus, FiX,
  FiDroplet, FiInfo, FiChevronRight, FiCheckCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "../ui/Loader";
import "../../styles/DBloodCamps.css";

const API_BASE = "/api/blood-camp";

const DBloodCamps = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editCamp, setEditCamp] = useState(null);
    const [form, setForm] = useState({
        name: "", start_date: "", end_date: "",
        location: { address: "", city: "", state: "", country: "India", pincode: "", geo: { lat: "", lng: "" } },
        timings: [], description: "", contact_phone: "", contact_email: "",
    });

    // Donor Modal States
    const [donorModalOpen, setDonorModalOpen] = useState(false);
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [donors, setDonors] = useState([]);
    const [donorForm, setDonorForm] = useState({ donorId: "", blood_group: "", units: "", donation_time: "", verified: false });
    const [donorLoading, setDonorLoading] = useState(false);

    useEffect(() => { fetchCamps(); }, []);

    const fetchCamps = async () => {
        try {
            setLoading(true);
            const res = await api.get(`${API_BASE}/camps`);
            setCamps(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch blood camps");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrEdit = async (e) => {
        e.preventDefault();
        try {
            if (editCamp) {
                await api.put(`${API_BASE}/update-camps/${editCamp._id}`, form);
                toast.success("Camp updated successfully!");
            } else {
                await api.post(`${API_BASE}/create-camps`, form);
                toast.success("Camp organized successfully!");
            }
            setShowModal(false);
            fetchCamps();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDeleteCamp = async (id) => {
        if (!window.confirm("Are you sure you want to delete this camp?")) return;
        try {
            await api.delete(`${API_BASE}/delete-camp/${id}`);
            toast.success("Camp deleted");
            fetchCamps();
        } catch {
            toast.error("Delete failed");
        }
    };

    const openDonorModal = async (camp) => {
        setSelectedCamp(camp);
        setDonorModalOpen(true);
        setDonorLoading(true);
        try {
            const res = await api.get(`${API_BASE}/${camp._id}/donors`);
            setDonors(res.data || []);
        } catch {
            toast.error("Failed to load donors");
        } finally {
            setDonorLoading(false);
        }
    };

    const handleAddDonor = async (e) => {
        e.preventDefault();
        try {
            await api.post(`${API_BASE}/${selectedCamp._id}/add-donor`, donorForm);
            toast.success("Donor added!");
            const res = await api.get(`${API_BASE}/${selectedCamp._id}/donors`);
            setDonors(res.data || []);
            setDonorForm({ donorId: "", blood_group: "", units: "", donation_time: "", verified: false });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add donor");
        }
    };

    const handleFormChange = (e, path) => {
        const v = e.target.value;
        if (path.startsWith("location.geo.")) {
            const key = path.split(".")[2];
            setForm(f => ({ ...f, location: { ...f.location, geo: { ...f.location.geo, [key]: v } } }));
        } else if (path.startsWith("location.")) {
            const key = path.split(".")[1];
            setForm(f => ({ ...f, location: { ...f.location, [key]: v } }));
        } else setForm(f => ({ ...f, [path]: v }));
    };

    const filterCamps = () => {
        return camps.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getStatus = (end_date) => {
        const today = new Date();
        const end = new Date(end_date);
        return end >= today ? 'upcoming' : 'completed';
    };

    if (loading) return <div className="dbc-container"><Loader /></div>;

    const filteredCamps = filterCamps();

    return (
        <div className="dbc-container">
            <div className="dbc-max-width">
                <header className="dbc-header">
                    <div className="dbc-title-section">
                        <h1><FiDroplet color="#ef4444" /> Blood Camp Management</h1>
                        <p>Organize and manage life-saving donation drives</p>
                    </div>
                    <button className="dbc-organize-btn" onClick={() => { setEditCamp(null); setShowModal(true); }}>
                        <FiPlus /> Organize New Camp
                    </button>
                </header>

                <div className="dbc-controls">
                    <div className="dbc-search-wrapper">
                        <FiSearch className="dbc-search-icon" />
                        <input 
                            type="text" 
                            className="dbc-search-input"
                            placeholder="Search by camp name or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="dbc-stats-overview">
                        <span className="dbc-stat-mini">Total Camps: <strong>{camps.length}</strong></span>
                    </div>
                </div>

                <div className="dbc-grid">
                    <AnimatePresence>
                        {filteredCamps.map(camp => (
                            <motion.div 
                                key={camp._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="dbc-card"
                            >
                                <div className="dbc-card-header">
                                    <h2 className="dbc-camp-name">{camp.name}</h2>
                                    <span className={`dbc-status-badge dbc-status-${getStatus(camp.end_date)}`}>
                                        {getStatus(camp.end_date)}
                                    </span>
                                </div>

                                <div className="dbc-info-row">
                                    <FiMapPin className="dbc-icon" size={16} />
                                    <span>{camp.location?.address}, {camp.location?.city}</span>
                                </div>

                                <div className="dbc-info-row">
                                    <FiCalendar className="dbc-icon" size={16} />
                                    <span>{new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}</span>
                                </div>

                                <div className="dbc-description">
                                    {camp.description || "No description provided."}
                                </div>

                                <div className="dbc-card-footer">
                                    <div className="dbc-stats">
                                        <div className="dbc-stat">
                                            <FiUsers size={14} />
                                            <span>{camp.donations?.length || 0} Donors</span>
                                        </div>
                                    </div>
                                    <div className="dbc-actions">
                                        <button className="dbc-action-btn dbc-edit-btn" onClick={() => { setEditCamp(camp); setForm({...camp, start_date: camp.start_date.slice(0,10), end_date: camp.end_date.slice(0,10)}); setShowModal(true); }}>
                                            <FiEdit2 />
                                        </button>
                                        <button className="dbc-action-btn dbc-manage-btn" onClick={() => openDonorModal(camp)}>
                                            <FiUserPlus /> Manage
                                        </button>
                                        <button className="dbc-action-btn dbc-delete-btn" onClick={() => handleDeleteCamp(camp._id)} style={{color: '#ef4444'}}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Create/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="dbc-modal-overlay" onClick={() => setShowModal(false)}>
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="dbc-modal" 
                                onClick={e => e.stopPropagation()}
                            >
                                <header className="dbc-modal-header">
                                    <h2 className="dbc-modal-title">{editCamp ? "Edit Camp" : "Organize Camp"}</h2>
                                    <button className="doc-oc-tab active" onClick={() => setShowModal(false)} style={{padding: '5px', borderRadius: '50%'}}><FiX /></button>
                                </header>
                                <div className="dbc-modal-content">
                                    <form onSubmit={handleCreateOrEdit}>
                                        <div className="dbc-form-section">
                                            <span className="dbc-section-label">General Information</span>
                                            <div className="dbc-input-group">
                                                <label>Camp Name</label>
                                                <input type="text" className="dbc-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. LifeSave Blood Drive" />
                                            </div>
                                            <div className="dbc-grid-2">
                                                <div className="dbc-input-group">
                                                    <label>Start Date</label>
                                                    <input type="date" className="dbc-input" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required />
                                                </div>
                                                <div className="dbc-input-group">
                                                    <label>End Date</label>
                                                    <input type="date" className="dbc-input" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} required />
                                                </div>
                                            </div>
                                            <div className="dbc-input-group">
                                                <label>Description</label>
                                                <textarea className="dbc-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the camp goals..." />
                                            </div>
                                        </div>

                                        <div className="dbc-form-section">
                                            <span className="dbc-section-label">Location Details</span>
                                            <div className="dbc-input-group">
                                                <label>Address</label>
                                                <input type="text" className="dbc-input" value={form.location.address} onChange={e => handleFormChange(e, "location.address")} required />
                                            </div>
                                            <div className="dbc-grid-2">
                                                <div className="dbc-input-group">
                                                    <label>City</label>
                                                    <input type="text" className="dbc-input" value={form.location.city} onChange={e => handleFormChange(e, "location.city")} required />
                                                </div>
                                                <div className="dbc-input-group">
                                                    <label>Pincode</label>
                                                    <input type="text" className="dbc-input" value={form.location.pincode} onChange={e => handleFormChange(e, "location.pincode")} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dbc-form-section">
                                            <span className="dbc-section-label">Contact Information</span>
                                            <div className="dbc-grid-2">
                                                <div className="dbc-input-group">
                                                    <label>Phone</label>
                                                    <input type="text" className="dbc-input" value={form.contact_phone} onChange={e => setForm({...form, contact_phone: e.target.value})} required />
                                                </div>
                                                <div className="dbc-input-group">
                                                    <label>Email</label>
                                                    <input type="email" className="dbc-input" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dbc-modal-footer">
                                            <button type="button" className="dbc-action-btn dbc-edit-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                            <button type="submit" className="dbc-organize-btn">{editCamp ? "Update Camp" : "Create Camp"}</button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Donor Modal */}
                <AnimatePresence>
                    {donorModalOpen && (
                        <div className="dbc-modal-overlay" onClick={() => setDonorModalOpen(false)}>
                            <motion.div 
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                className="dbc-modal" 
                                style={{maxWidth: '450px', marginLeft: 'auto', height: '100vh', borderRadius: '0'}}
                                onClick={e => e.stopPropagation()}
                            >
                                <header className="dbc-modal-header">
                                    <h2 className="dbc-modal-title">Manage Donors</h2>
                                    <button onClick={() => setDonorModalOpen(false)} style={{background: 'none', border: 'none'}}><FiX size={24} /></button>
                                </header>
                                <div className="dbc-modal-content">
                                    <form onSubmit={handleAddDonor} className="dbc-form-section">
                                        <span className="dbc-section-label">Register New Donation</span>
                                        <div className="dbc-input-group">
                                            <label>Patient/Donor ID</label>
                                            <input type="text" className="dbc-input" value={donorForm.donorId} onChange={e => setDonorForm({...donorForm, donorId: e.target.value})} required />
                                        </div>
                                        <div className="dbc-grid-2">
                                            <div className="dbc-input-group">
                                                <label>Blood Group</label>
                                                <select className="dbc-input" value={donorForm.blood_group} onChange={e => setDonorForm({...donorForm, blood_group: e.target.value})} required>
                                                    <option value="">Select</option>
                                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <div className="dbc-input-group">
                                                <label>Units</label>
                                                <input type="number" className="dbc-input" value={donorForm.units} onChange={e => setDonorForm({...donorForm, units: e.target.value})} required min="1" />
                                            </div>
                                        </div>
                                        <button type="submit" className="dbc-organize-btn" style={{width: '100%', justifyContent: 'center'}}>
                                            <FiUserPlus /> Add Donor
                                        </button>
                                    </form>

                                    <div className="dbc-donors-list">
                                        <span className="dbc-section-label">Recent Donors ({donors.length})</span>
                                        {donorLoading ? <Loader /> : (
                                            donors.length > 0 ? (
                                                <div className="dbc-donor-items">
                                                    {donors.map(d => (
                                                        <div key={d._id} className="dbc-donor-item" style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '0.5rem', border: '1px solid #e2e8f0'}}>
                                                            <div>
                                                                <div style={{fontWeight: '700', fontSize: '0.9rem'}}>{d.name || d.donorId}</div>
                                                                <div style={{fontSize: '0.75rem', color: '#64748b'}}>{d.email || d.blood_group}</div>
                                                            </div>
                                                            <div style={{color: '#ef4444', fontWeight: '800'}}>{d.blood_group}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem'}}>No donors registered for this camp.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default DBloodCamps;
