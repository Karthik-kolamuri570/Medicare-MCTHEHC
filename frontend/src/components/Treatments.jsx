import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Brain, Bone, Stethoscope, Baby, Eye, Activity, Smile,
    Accessibility, Ear, Search, Sparkles, ArrowRight, Star
} from 'lucide-react';
import Header from './forms/Header';
import Footer from './forms/Footer';

// Icon mapping with color themes
const specializationData = {
    'Cardiology': { icon: Heart, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
    'Neurology': { icon: Brain, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    'Orthopedics': { icon: Bone, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    'Pediatrics': { icon: Baby, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
    'Ophthalmology': { icon: Eye, color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
    'Dermatology': { icon: Smile, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    'ENT': { icon: Ear, color: '#f97316', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    'Psychiatry': { icon: Brain, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
    'General Medicine': { icon: Stethoscope, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
    'Gynecology': { icon: Accessibility, color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
    'Oncology': { icon: Activity, color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' },
    'Dental': { icon: Smile, color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
};

const defaultData = { icon: Activity, color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' };

const Treatments = () => {
    const [specializations, setSpecializations] = useState([]);
    const [filteredSpecs, setFilteredSpecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await axios.get('/api/doctor/all-specializations');
                if (response.data.success) {
                    setSpecializations(response.data.data);
                    setFilteredSpecs(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching specializations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredSpecs(specializations);
        } else {
            const filtered = specializations.filter(spec =>
                spec.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSpecs(filtered);
        }
    }, [searchTerm, specializations]);

    const getSpecData = (name) => {
        const key = Object.keys(specializationData).find(k => name.toLowerCase().includes(k.toLowerCase()));
        return specializationData[key] || defaultData;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                    animation: 'float 20s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                    animation: 'float 15s ease-in-out infinite reverse'
                }}></div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Header />

                {/* Hero Section */}
                <div style={{
                    paddingTop: '140px',
                    paddingBottom: '100px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Mesh gradient overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                                         radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        pointerEvents: 'none'
                    }}></div>

                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Premium badge */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(20px)',
                                    padding: '10px 24px',
                                    borderRadius: '50px',
                                    marginBottom: '40px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <Star size={18} color="#fbbf24" fill="#fbbf24" />
                                <span style={{ color: 'white', fontSize: '14px', fontWeight: '600', letterSpacing: '1.5px' }}>
                                    WORLD-CLASS HEALTHCARE
                                </span>
                            </motion.div>

                            <h1 style={{
                                fontSize: '64px',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '28px',
                                lineHeight: '1.1',
                                letterSpacing: '-2px',
                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}>
                                Medical Excellence<br />
                                <span style={{
                                    background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Across Specializations
                                </span>
                            </h1>

                            <p style={{
                                fontSize: '20px',
                                color: 'rgba(255, 255, 255, 0.95)',
                                maxWidth: '700px',
                                margin: '0 auto 50px',
                                lineHeight: '1.7',
                                fontWeight: '400'
                            }}>
                                Discover our comprehensive range of medical departments, each staffed with expert physicians dedicated to your health and wellbeing
                            </p>

                            {/* Enhanced Search Bar */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    left: '24px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#9ca3af',
                                    zIndex: 2
                                }}>
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for a medical specialization..."
                                    style={{
                                        width: '100%',
                                        padding: '20px 24px 20px 60px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        fontSize: '17px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={(e) => e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)'}
                                    onBlur={(e) => e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)'}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Specializations Grid */}
                <main style={{
                    maxWidth: '1400px',
                    margin: '-60px auto 0',
                    padding: '0 24px 100px',
                    position: 'relative',
                    zIndex: 10
                }}>
                    {loading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '28px'
                        }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} style={{
                                    height: '320px',
                                    backgroundColor: 'white',
                                    borderRadius: '24px',
                                    animation: 'shimmer 2s infinite',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                                }}></div>
                            ))}
                        </div>
                    ) : filteredSpecs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center',
                                padding: '100px 20px',
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <Search size={72} color="#d1d5db" style={{ margin: '0 auto 24px' }} />
                            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
                                No specializations found
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '16px' }}>Try adjusting your search terms</p>
                        </motion.div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '28px'
                        }}>
                            <AnimatePresence>
                                {filteredSpecs.map((spec, index) => {
                                    const specData = getSpecData(spec);
                                    const Icon = specData.icon;
                                    const isHovered = hoveredCard === index;

                                    return (
                                        <motion.div
                                            key={spec}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.05,
                                                ease: [0.22, 1, 0.36, 1]
                                            }}
                                            onMouseEnter={() => setHoveredCard(index)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            style={{
                                                backgroundColor: 'white',
                                                borderRadius: '24px',
                                                padding: '36px',
                                                boxShadow: isHovered
                                                    ? '0 30px 60px rgba(0, 0, 0, 0.12)'
                                                    : '0 10px 40px rgba(0, 0, 0, 0.08)',
                                                border: '1px solid',
                                                borderColor: isHovered ? specData.color + '40' : '#f1f5f9',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                                transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {/* Animated gradient background */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '5px',
                                                background: specData.gradient,
                                                opacity: isHovered ? 1 : 0,
                                                transition: 'opacity 0.4s ease'
                                            }}></div>

                                            {/* Floating icon background */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '-20px',
                                                right: '-20px',
                                                width: '140px',
                                                height: '140px',
                                                borderRadius: '50%',
                                                background: specData.gradient,
                                                opacity: isHovered ? 0.08 : 0.04,
                                                transition: 'all 0.5s ease',
                                                transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                                            }}></div>

                                            <div style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '20px',
                                                background: specData.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '24px',
                                                boxShadow: `0 12px 28px ${specData.color}40`,
                                                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                                                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
                                            }}>
                                                <Icon size={36} color="white" strokeWidth={2} />
                                            </div>

                                            <h3 style={{
                                                fontSize: '26px',
                                                fontWeight: '700',
                                                color: '#0f172a',
                                                marginBottom: '14px',
                                                lineHeight: '1.3',
                                                transition: 'color 0.3s ease'
                                            }}>
                                                {spec}
                                            </h3>

                                            <p style={{
                                                fontSize: '15px',
                                                color: '#64748b',
                                                lineHeight: '1.7',
                                                marginBottom: '24px',
                                                minHeight: '48px'
                                            }}>
                                                Advanced diagnostic and therapeutic care for all {spec.toLowerCase()} conditions with state-of-the-art facilities.
                                            </p>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: specData.color,
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                transition: 'gap 0.3s ease'
                                            }}>
                                                <span>Explore Services</span>
                                                <ArrowRight
                                                    size={18}
                                                    style={{
                                                        transition: 'transform 0.3s ease',
                                                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                <Footer />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(5deg); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg); }
                }
                
                @keyframes shimmer {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default Treatments;
