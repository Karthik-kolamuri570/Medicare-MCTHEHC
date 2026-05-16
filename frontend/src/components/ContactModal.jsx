import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Send } from 'lucide-react';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const contactInfo = [
        {
            icon: Phone,
            label: "Phone",
            value: "+91 9182615101",
            color: "#3b82f6",
            action: "tel:+919182615101"
        },
        {
            icon: Mail,
            label: "Email",
            value: "kart91801@gmail.com",
            color: "#8b5cf6",
            action: "mailto:kart91801@gmail.com"
        },
        {
            icon: MapPin,
            label: "Location",
            value: "Coming Soon",
            color: "#ec4899",
            action: null
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate an API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitStatus(null), 3000);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="cm-overlay"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="cm-modal"
                >
                    {/* Close button */}
                    <button onClick={onClose} className="cm-close-btn">
                        <X size={20} />
                    </button>

                    <div className="cm-layout">
                        {/* Left Column: Contact Info */}
                        <div className="cm-left-col">
                            <h2 className="cm-title">Get in Touch</h2>
                            <p className="cm-subtitle">
                                Have a question or need to report an issue? We'd love to hear from you.
                            </p>

                            <div className="cm-info-list">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => info.action && window.open(info.action, '_blank')}
                                            className="cm-info-card"
                                            style={{ cursor: info.action ? 'pointer' : 'default' }}
                                        >
                                            <div 
                                                className="cm-info-icon-wrap" 
                                                style={{ background: `${info.color}15`, border: `1px solid ${info.color}30` }}
                                            >
                                                <Icon size={24} color={info.color} strokeWidth={2} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div className="cm-info-label">{info.label}</div>
                                                <div className="cm-info-value">{info.value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="cm-right-col">
                            <h3 className="cm-form-title">Send a Message</h3>

                            <form onSubmit={handleSubmit} className="cm-form">
                                <div className="cm-input-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                        className="cm-input"
                                    />
                                </div>

                                <div className="cm-input-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@example.com"
                                        className="cm-input"
                                    />
                                </div>

                                <div className="cm-input-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="How can we help you?"
                                        rows="4"
                                        className="cm-input cm-textarea"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || submitStatus === 'success'}
                                    className={`cm-submit-btn ${submitStatus === 'success' ? 'success' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <div className="cm-spinner" />
                                    ) : submitStatus === 'success' ? (
                                        <>Message Sent Successfully!</>
                                    ) : (
                                        <>
                                            Send Message <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContactModal;
