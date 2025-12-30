import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Building2, Users, Award, Clock, CheckCircle2, AlertCircle, TrendingUp, Shield, Zap, ChevronRight, Activity, Sparkles, ArrowUpRight } from 'lucide-react';
import Header from './forms/Header';
import Footer from './forms/Footer';

const OurHospitals = () => {
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const features = [
        { icon: Building2, title: "Premium Facilities", description: "State-of-the-art medical infrastructure", color: "#3b82f6", bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
        { icon: Users, title: "Expert Teams", description: "Highly qualified medical professionals", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" },
        { icon: Award, title: "Quality Care", description: "Internationally certified standards", color: "#ec4899", bgGradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" },
        { icon: Clock, title: "24/7 Support", description: "Round-the-clock medical assistance", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }
    ];

    const stats = [
        { icon: TrendingUp, value: "15+", label: "Partner Hospitals", color: "#3b82f6", description: "In Active Discussion" },
        { icon: Shield, value: "100%", label: "Quality Assured", color: "#10b981", description: "Certified Standards" },
        { icon: Zap, value: "Q1 2025", label: "Expected Launch", color: "#f59e0b", description: "Network Go-Live" }
    ];

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(to bottom, #020617 0%, #0f172a 40%, #1e293b 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#e2e8f0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Advanced grid background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                zIndex: 0,
                maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}></div>

            {/* Mouse follower glow */}
            <div style={{
                position: 'fixed',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
                transition: 'transform 0.3s ease-out',
                zIndex: 0
            }}></div>

            {/* Animated orbs */}
            <div style={{
                position: 'fixed',
                top: '15%',
                right: '5%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)',
                animation: 'float 25s ease-in-out infinite',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'fixed',
                bottom: '5%',
                left: '5%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
                filter: 'blur(120px)',
                animation: 'float 30s ease-in-out infinite reverse',
                zIndex: 0
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Header />
                
                {/* Premium Development Notice */}
                <div style={{
                    marginTop: '140px',
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)',
                    backdropFilter: 'blur(20px)',
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(245, 158, 11, 0.2)',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent)',
                        animation: 'shimmer 4s ease-in-out infinite'
                    }}></div>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <Sparkles size={18} color="#fbbf24" />
                        </motion.div>
                        <span style={{
                            color: '#fbbf24',
                            fontSize: '13px',
                            fontWeight: '700',
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase'
                        }}>
                            Platform Under Development • Hospital Network Expansion in Progress
                        </span>
                        <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <Sparkles size={18} color="#fbbf24" />
                        </motion.div>
                    </div>
                </div>

                {/* Hero Section */}
                <div style={{
                    padding: '100px 24px 80px',
                    position: 'relative'
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '80px', alignItems: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px',
                                        marginBottom: '32px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <Activity size={18} color="#60a5fa" />
                                    <span style={{
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        letterSpacing: '1.2px',
                                        textTransform: 'uppercase',
                                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        Network Expansion Initiative
                                    </span>
                                </motion.div>
                                <h1 style={{
                                    fontSize: '64px',
                                    fontWeight: '900',
                                    color: 'white',
                                    marginBottom: '24px',
                                    lineHeight: '1.05',
                                    letterSpacing: '-2px'
                                }}>
                                    Building the Future of
                                    <br/>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 40%, #ec4899 80%, #f59e0b 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        backgroundSize: '200% 100%',
                                        animation: 'gradient-flow 8s ease infinite'
                                    }}>
                                        Healthcare Networks
                                    </span>
                                </h1>
                                <p style={{
                                    fontSize: '18px',
                                    color: '#94a3b8',
                                    lineHeight: '1.8',
                                    marginBottom: '40px',
                                    maxWidth: '580px'
                                }}>
                                    Actively collaborating with premier healthcare institutions to expand our network and provide comprehensive, world-class medical services across the region.
                                </p>

                                {/* Enhanced Progress Section */}
                                <div style={{
                                    background: 'rgba(30, 41, 59, 0.4)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(51, 65, 85, 0.6)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    marginBottom: '32px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '12px'
                                    }}>
                                        <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: '600' }}>Partnership Progress</span>
                                        <span style={{ fontSize: '14px', color: '#60a5fa', fontWeight: '800' }}>75%</span>
                                    </div>
                                    <div style={{
                                        height: '10px',
                                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(51, 65, 85, 0.8)',
                                        position: 'relative'
                                    }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
                                                position: 'relative'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                                animation: 'shimmer 2s ease-in-out infinite'
                                            }}></div>
                                        </motion.div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '24px',
                                        marginTop: '16px',
                                        fontSize: '12px',
                                        color: '#64748b'
                                    }}>
                                        <div><span style={{ color: '#60a5fa', fontWeight: '700' }}>15+</span> Hospitals</div>
                                        <div><span style={{ color: '#a78bfa', fontWeight: '700' }}>8</span> Regions</div>
                                        <div><span style={{ color: '#f472b6', fontWeight: '700' }}>Q1 2025</span> Launch</div>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                        padding: '14px 24px',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <CheckCircle2 size={22} color="#34d399" strokeWidth={2.5} />
                                    <span style={{
                                        color: '#6ee7b7',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        letterSpacing: '0.3px'
                                    }}>
                                        Active Negotiations with 15+ Premier Hospitals
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* Premium Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                style={{ display: 'grid', gap: '20px' }}
                            >
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    const isHovered = hoveredStat === index;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            onMouseEnter={() => setHoveredStat(index)}
                                            onMouseLeave={() => setHoveredStat(null)}
                                            whileHover={{ scale: 1.03, x: 10 }}
                                            style={{
                                                background: isHovered 
                                                    ? `linear-gradient(135deg, ${stat.color}15 0%, rgba(30, 41, 59, 0.6) 100%)`
                                                    : 'rgba(30, 41, 59, 0.5)',
                                                backdropFilter: 'blur(30px)',
                                                border: '1px solid',
                                                borderColor: isHovered ? `${stat.color}50` : 'rgba(51, 65, 85, 0.8)',
                                                borderRadius: '20px',
                                                padding: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '24px',
                                                cursor: 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '5px',
                                                height: '100%',
                                                backgroundColor: stat.color,
                                                boxShadow: `0 0 20px ${stat.color}`,
                                                opacity: isHovered ? 1 : 0.5,
                                                transition: 'opacity 0.3s ease'
                                            }}></div>
                                            <div style={{
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                                                border: `1px solid ${stat.color}40`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: isHovered ? `0 0 30px ${stat.color}40` : 'none',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <Icon size={32} color={stat.color} strokeWidth={2} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: '36px',
                                                    fontWeight: '900',
                                                    color: 'white',
                                                    lineHeight: '1',
                                                    marginBottom: '8px',
                                                    letterSpacing: '-1px'
                                                }}>
                                                    {stat.value}
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#cbd5e1',
                                                    fontWeight: '700',
                                                    marginBottom: '4px'
                                                }}>
                                                    {stat.label}
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#64748b',
                                                    fontWeight: '500'
                                                }}>
                                                    {stat.description}
                                                </div>
                                            </div>
                                            {isHovered && (
                                                <ArrowUpRight size={20} color={stat.color} style={{ opacity: 0.6 }} />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 24px 100px'
                }}>
                    {/* Premium Status Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            background: 'rgba(30, 41, 59, 0.4)',
                            backdropFilter: 'blur(30px)',
                            border: '1px solid rgba(51, 65, 85, 0.8)',
                            borderRadius: '24px',
                            padding: '48px',
                            marginBottom: '48px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 33%, #ec4899 66%, #f59e0b 100%)',
                            boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
                        }}></div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'center' }}>
                            <motion.div
                                animate={{ 
                                    boxShadow: [
                                        '0 0 40px rgba(59, 130, 246, 0.4)',
                                        '0 0 60px rgba(59, 130, 246, 0.6)',
                                        '0 0 40px rgba(59, 130, 246, 0.4)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{
                                    width: '96px',
                                    height: '96px',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(96, 165, 250, 0.4)'
                                }}
                            >
                                <Building2 size={48} color="white" strokeWidth={2} />
                            </motion.div>

                            <div>
                                <h2 style={{
                                    fontSize: '32px',
                                    fontWeight: '900',
                                    color: 'white',
                                    marginBottom: '16px',
                                    letterSpacing: '-0.8px'
                                }}>
                                    Network Expansion Status
                                </h2>
                                <p style={{
                                    fontSize: '17px',
                                    color: '#94a3b8',
                                    lineHeight: '1.8',
                                    marginBottom: '0'
                                }}>
                                    Currently in <strong style={{ color: '#60a5fa', fontWeight: '700' }}>active negotiations</strong> with multiple premier healthcare facilities across the region. Our strategic partnerships will provide seamless access to <strong style={{ color: '#a78bfa', fontWeight: '700' }}>world-class medical care</strong>, advanced technology, and experienced professionals dedicated to your wellbeing.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Features Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px',
                        marginBottom: '48px'
                    }}>
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const isHovered = hoveredFeature === index;
                            
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    onMouseEnter={() => setHoveredFeature(index)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                    whileHover={{ y: -12 }}
                                    style={{
                                        background: isHovered 
                                            ? `linear-gradient(135deg, ${feature.color}12 0%, rgba(30, 41, 59, 0.5) 100%)`
                                            : 'rgba(30, 41, 59, 0.4)',
                                        backdropFilter: 'blur(30px)',
                                        border: '1px solid',
                                        borderColor: isHovered ? `${feature.color}60` : 'rgba(51, 65, 85, 0.8)',
                                        borderRadius: '20px',
                                        padding: '32px',
                                        cursor: 'pointer',
                                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {isHovered && (
                                        <>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '4px',
                                                background: feature.bgGradient,
                                                boxShadow: `0 0 20px ${feature.color}`
                                            }}></div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-50%',
                                                right: '-50%',
                                                width: '200px',
                                                height: '200px',
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle, ${feature.color}15 0%, transparent 70%)`,
                                                filter: 'blur(40px)'
                                            }}></div>
                                        </>
                                    )}

                                    <motion.div
                                        animate={isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '16px',
                                            background: feature.bgGradient,
                                            border: `1px solid ${feature.color}40`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '24px',
                                            boxShadow: isHovered ? `0 0 30px ${feature.color}50` : 'none',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        <Icon size={32} color="white" strokeWidth={2} />
                                    </motion.div>

                                    <h4 style={{
                                        fontSize: '20px',
                                        fontWeight: '800',
                                        color: 'white',
                                        marginBottom: '10px',
                                        letterSpacing: '-0.4px',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {feature.title}
                                    </h4>

                                    <p style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        lineHeight: '1.7',
                                        marginBottom: '0',
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Premium CTA Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
                            backdropFilter: 'blur(30px)',
                            borderRadius: '24px',
                            padding: '48px',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '48px',
                            alignItems: 'center',
                            border: '1px solid rgba(96, 165, 250, 0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-60%',
                            right: '-15%',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
                            filter: 'blur(60px)'
                        }}></div>

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '16px',
                                letterSpacing: '-0.8px'
                            }}>
                                Explore Available Services
                            </h3>
                            <p style={{
                                fontSize: '17px',
                                color: 'rgba(255, 255, 255, 0.9)',
                                lineHeight: '1.8',
                                marginBottom: '0'
                            }}>
                                While we expand our hospital network, connect with expert doctors and access comprehensive medical services available now.
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, x: 8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = '/top-doctors'}
                            style={{
                                padding: '18px 36px',
                                fontSize: '16px',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                color: 'white',
                                border: '1px solid rgba(96, 165, 250, 0.5)',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.5px',
                                boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
                                position: 'relative',
                                zIndex: 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Find Doctors
                            <ChevronRight size={22} />
                        </motion.button>
                    </motion.div>
                </main>

                <Footer />
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(40px, -40px) rotate(3deg); }
                    66% { transform: translate(-30px, 30px) rotate(-3deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes gradient-flow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </div>
    );
};

export default OurHospitals;
