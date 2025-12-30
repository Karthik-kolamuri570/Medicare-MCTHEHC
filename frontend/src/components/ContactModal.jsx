import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
    const [hoveredItem, setHoveredItem] = useState(null);

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
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        borderRadius: '24px',
                        width: '420px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        boxShadow: '0 25px 80px rgba(59, 130, 246, 0.4)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Glow effect */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-30%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        pointerEvents: 'none'
                    }}></div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
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
                        <X size={16} color="#94a3b8" />
                    </button>

                    <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px' }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{
                                fontSize: '28px',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '8px',
                                letterSpacing: '-0.5px'
                            }}>
                                Get in Touch
                            </h2>
                            <p style={{
                                fontSize: '14px',
                                color: '#94a3b8',
                                margin: 0
                            }}>
                                Reach out through any of these channels
                            </p>
                        </div>

                        {/* Contact Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                                        whileHover={{ x: 4 }}
                                        onClick={() => info.action && window.open(info.action, '_blank')}
                                        style={{
                                            background: isHovered
                                                ? `linear-gradient(135deg, ${info.color}10 0%, rgba(30, 41, 59, 0.5) 100%)`
                                                : 'rgba(30, 41, 59, 0.4)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid',
                                            borderColor: isHovered ? `${info.color}40` : 'rgba(51, 65, 85, 0.6)',
                                            borderRadius: '14px',
                                            padding: '16px 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
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
                                                width: '3px',
                                                background: info.color,
                                                boxShadow: `0 0 10px ${info.color}`
                                            }}></div>
                                        )}

                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: `${info.color}15`,
                                            border: `1px solid ${info.color}30`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <Icon size={22} color={info.color} strokeWidth={2} />
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                marginBottom: '2px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {info.label}
                                            </div>
                                            <div style={{
                                                fontSize: '15px',
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
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContactModal;
