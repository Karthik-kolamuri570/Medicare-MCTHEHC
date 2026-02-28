import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Send } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
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
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '850px',
                        maxHeight: '90vh',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 25px 80px rgba(59, 130, 246, 0.4)',
                        position: 'relative',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-30%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        pointerEvents: 'none'
                    }}></div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid rgba(51, 65, 85, 0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            zIndex: 10
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                            e.target.style.borderColor = '#ef4444';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)';
                            e.target.style.borderColor = 'rgba(51, 65, 85, 0.8)';
                        }}
                    >
                        <X size={18} color="#94a3b8" style={{ pointerEvents: 'none' }} />
                    </button>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Left Column: Contact Info */}
                        <div style={{
                            flex: '1 1 350px',
                            minWidth: '280px',
                            padding: '40px',
                            borderRight: '1px solid rgba(51, 65, 85, 0.5)',
                            borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
                        }}>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: '32px',
                                    fontWeight: '900',
                                    color: 'white',
                                    marginBottom: '10px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Get in Touch
                                </h2>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#94a3b8',
                                    margin: 0,
                                    lineHeight: '1.5'
                                }}>
                                    Have a question or need to report an issue? We'd love to hear from you.
                                </p>
                            </div>

                            {/* Contact Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    const isHovered = hoveredItem === index;

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.1 }}
                                            onMouseEnter={() => setHoveredItem(index)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                            whileHover={{ x: 6 }}
                                            onClick={() => info.action && window.open(info.action, '_blank')}
                                            style={{
                                                background: isHovered
                                                    ? `linear-gradient(135deg, ${info.color}15 0%, rgba(30, 41, 59, 0.7) 100%)`
                                                    : 'rgba(30, 41, 59, 0.4)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid',
                                                borderColor: isHovered ? `${info.color}50` : 'rgba(51, 65, 85, 0.6)',
                                                borderRadius: '16px',
                                                padding: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '20px',
                                                cursor: info.action ? 'pointer' : 'default',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {isHovered && info.action && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: '4px',
                                                    background: info.color,
                                                    boxShadow: `0 0 12px ${info.color}`
                                                }}></div>
                                            )}

                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '14px',
                                                background: `${info.color}15`,
                                                border: `1px solid ${info.color}30`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <Icon size={24} color={info.color} strokeWidth={2} />
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    color: '#94a3b8',
                                                    marginBottom: '4px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {info.label}
                                                </div>
                                                <div style={{
                                                    fontSize: '16px',
                                                    fontWeight: '700',
                                                    color: 'white',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {info.value}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div style={{
                            flex: '1 1 350px',
                            minWidth: '280px',
                            padding: '40px',
                            background: 'rgba(15, 23, 42, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'white',
                                marginBottom: '24px'
                            }}>
                                Send a Message
                            </h3>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label htmlFor="name" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(30, 41, 59, 0.6)',
                                            border: '1px solid rgba(51, 65, 85, 0.6)',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease, background 0.3s ease',
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(30, 41, 59, 0.9)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(51, 65, 85, 0.6)'; e.target.style.background = 'rgba(30, 41, 59, 0.6)'; }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(30, 41, 59, 0.6)',
                                            border: '1px solid rgba(51, 65, 85, 0.6)',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition: 'border-color 0.3s ease, background 0.3s ease',
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(30, 41, 59, 0.9)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(51, 65, 85, 0.6)'; e.target.style.background = 'rgba(30, 41, 59, 0.6)'; }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px' }}>Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="How can we help you?"
                                        rows="4"
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            background: 'rgba(30, 41, 59, 0.6)',
                                            border: '1px solid rgba(51, 65, 85, 0.6)',
                                            color: 'white',
                                            fontSize: '15px',
                                            outline: 'none',
                                            resize: 'none',
                                            transition: 'border-color 0.3s ease, background 0.3s ease',
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(30, 41, 59, 0.9)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'rgba(51, 65, 85, 0.6)'; e.target.style.background = 'rgba(30, 41, 59, 0.6)'; }}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || submitStatus === 'success'}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: submitStatus === 'success' ? '#10b981' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: isSubmitting || submitStatus === 'success' ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.3s ease',
                                        marginTop: '10px',
                                        opacity: isSubmitting ? 0.7 : 1,
                                        boxShadow: submitStatus === 'success' ? '0 10px 25px rgba(16, 185, 129, 0.4)' : '0 10px 25px rgba(37, 99, 235, 0.3)',
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isSubmitting && submitStatus !== 'success') {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 15px 30px rgba(37, 99, 235, 0.4)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isSubmitting && submitStatus !== 'success') {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                                        }
                                    }}
                                >
                                    {isSubmitting ? (
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                    ) : submitStatus === 'success' ? (
                                        <>Message Sent Successfully!</>
                                    ) : (
                                        <>
                                            Send Message <Send size={18} />
                                        </>
                                    )}
                                </button>
                                {/* Keyframes for loader -> injected implicitly via a `<style>` tag or assumes external CSS if "spin" class isn't strictly defined. We can inline an inline style tag here just in case! */}
                                <style>{`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContactModal;
