

// src/pages/PaymentSuccess.jsx
// import React, { useEffect } from "react";
// import { toast } from "react-toastify";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//     useEffect(() => {
//         const sessionId = searchParams.get("session_id");
//         console.log("session_id:", sessionId); // 👈 this should show a valid ID


//     if (!sessionId) {
//       toast.error("Invalid session ID. Please contact support.");
//       return navigate("/");
//     }

//     toast.success("🎉 Payment Successful! Your appointment is confirmed.", {
//       position: "top-center",
//       autoClose: 5000,
//     });

//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
//       <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
//         <p className="text-gray-700 mb-6">
//           Your consultation has been booked successfully. We'll send you the details shortly.
//         </p>
//         <button
//           onClick={() => navigate("/")}
//           className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Go to Home
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;


























































// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showFireworks, setShowFireworks] = useState(false);
//   const [showSparkles, setShowSparkles] = useState(false);

//   useEffect(() => {
//     const sessionId = searchParams.get("session_id");
//     console.log("session_id:", sessionId);

//     if (!sessionId) {
//       toast.error("Invalid session ID. Please contact support.");
//       return navigate("/");
//     }

//     toast.success("🎉 Payment Successful! Your appointment is confirmed.", {
//       position: "top-center",
//       autoClose: 5000,
//     });

//     // Orchestrated animation sequence
//     setTimeout(() => setShowAnimation(true), 300);
//     setTimeout(() => setShowFireworks(true), 800);
//     setTimeout(() => setShowSparkles(true), 1200);
//     setTimeout(() => setCurrentStep(1), 1500);
//     setTimeout(() => setCurrentStep(2), 2000);
//     setTimeout(() => setCurrentStep(3), 2500);
//   }, []);

//   const styles = {
//     container: {
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #065f46 60%, #064e3b 100%)',
//       padding: '1.5rem',
//       position: 'relative',
//       overflow: 'hidden',
//       fontFamily: 'system-ui, -apple-system, sans-serif',
//     },
    
//     // Advanced background effects
//     starField: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       pointerEvents: 'none',
//       zIndex: 1,
//     },
    
//     star: {
//       position: 'absolute',
//       background: 'white',
//       borderRadius: '50%',
//       animation: 'twinkle 2s infinite alternate',
//     },
    
//     // 3D Card with advanced shadows
//     successCard: {
//       background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
//       backdropFilter: 'blur(20px)',
//       padding: '3rem 2.5rem',
//       borderRadius: '2rem',
//       boxShadow: showAnimation 
//         ? '0 40px 80px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
//         : '0 20px 40px -12px rgba(0, 0, 0, 0.2)',
//       textAlign: 'center',
//       maxWidth: '40rem',
//       width: '100%',
//       position: 'relative',
//       zIndex: 3,
//       transform: showAnimation ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(50px) scale(0.9) rotateX(10deg)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
//       border: '1px solid rgba(255, 255, 255, 0.2)',
//     },
    
//     // Premium checkmark with 3D effect
//     checkmarkSection: {
//       position: 'relative',
//       marginBottom: '2rem',
//     },
    
//     checkmarkContainer: {
//       width: '7rem',
//       height: '7rem',
//       margin: '0 auto',
//       background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       position: 'relative',
//       transform: showAnimation ? 'scale(1) rotateY(0deg)' : 'scale(0) rotateY(180deg)',
//       transition: 'transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
//       transitionDelay: '0.5s',
//       boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)',
//     },
    
//     checkmark: {
//       width: '3.5rem',
//       height: '3.5rem',
//       color: 'white',
//       filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
//     },
    
//     checkmarkPath: {
//       strokeDasharray: '80',
//       strokeDashoffset: showAnimation ? '0' : '80',
//       transition: 'stroke-dashoffset 1s ease-in-out',
//       transitionDelay: '1s',
//     },
    
//     // Multiple pulse rings
//     pulseRing1: {
//       position: 'absolute',
//       top: '-1rem',
//       left: '-1rem',
//       right: '-1rem',
//       bottom: '-1rem',
//       border: '3px solid rgba(16, 185, 129, 0.4)',
//       borderRadius: '50%',
//       animation: showAnimation ? 'pulse 2s infinite' : 'none',
//     },
    
//     pulseRing2: {
//       position: 'absolute',
//       top: '-1.5rem',
//       left: '-1.5rem',
//       right: '-1.5rem',
//       bottom: '-1.5rem',
//       border: '2px solid rgba(16, 185, 129, 0.2)',
//       borderRadius: '50%',
//       animation: showAnimation ? 'pulse 2s infinite' : 'none',
//       animationDelay: '0.5s',
//     },
    
//     // Animated title with gradient
//     title: {
//       fontSize: '3rem',
//       fontWeight: '900',
//       background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
//       backgroundClip: 'text',
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent',
//       marginBottom: '1rem',
//       transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 1s ease-out',
//       transitionDelay: '0.7s',
//       textShadow: '0 4px 8px rgba(0,0,0,0.1)',
//       letterSpacing: '-0.02em',
//     },
    
//     subtitle: {
//       fontSize: '1.25rem',
//       color: '#10b981',
//       fontWeight: '600',
//       marginBottom: '1.5rem',
//       transform: showAnimation ? 'translateY(0)' : 'translateY(15px)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 0.8s ease-out',
//       transitionDelay: '0.8s',
//     },
    
//     description: {
//       color: '#64748b',
//       fontSize: '1.1rem',
//       marginBottom: '2.5rem',
//       lineHeight: '1.7',
//       transform: showAnimation ? 'translateY(0)' : 'translateY(15px)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 0.8s ease-out',
//       transitionDelay: '0.9s',
//     },
    
//     // Progress Steps with animations
//     progressSection: {
//       marginBottom: '2.5rem',
//     },
    
//     progressTitle: {
//       fontSize: '1.1rem',
//       fontWeight: '600',
//       color: '#374151',
//       marginBottom: '1.5rem',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'opacity 0.6s ease-out',
//       transitionDelay: '1s',
//     },
    
//     progressSteps: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: '2rem',
//       flexWrap: 'wrap',
//       gap: '1rem',
//     },
    
//     progressStep: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       flex: 1,
//       minWidth: '120px',
//     },
    
//     stepCircle: {
//       width: '3.5rem',
//       height: '3.5rem',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       marginBottom: '0.75rem',
//       transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
//       position: 'relative',
//     },
    
//     stepActive: {
//       background: 'linear-gradient(135deg, #10b981, #059669)',
//       color: 'white',
//       transform: 'scale(1.1)',
//       boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
//     },
    
//     stepCompleted: {
//       background: 'linear-gradient(135deg, #10b981, #059669)',
//       color: 'white',
//       boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
//     },
    
//     stepPending: {
//       background: '#f3f4f6',
//       color: '#9ca3af',
//       border: '2px solid #e5e7eb',
//     },
    
//     stepText: {
//       fontSize: '0.9rem',
//       fontWeight: '500',
//       textAlign: 'center',
//       color: '#64748b',
//       transition: 'color 0.5s ease',
//     },
    
//     stepTextActive: {
//       color: '#10b981',
//       fontWeight: '600',
//     },
    
//     // Enhanced stats section
//     statsSection: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '1.5rem',
//       marginBottom: '2.5rem',
//       transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 0.8s ease-out',
//       transitionDelay: '1.1s',
//     },
    
//     statCard: {
//       background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
//       borderRadius: '1.25rem',
//       padding: '1.5rem',
//       border: '1px solid rgba(16, 185, 129, 0.15)',
//       textAlign: 'center',
//       transition: 'all 0.3s ease',
//       cursor: 'default',
//     },
    
//     statIcon: {
//       width: '2.5rem',
//       height: '2.5rem',
//       margin: '0 auto 1rem auto',
//       color: '#10b981',
//     },
    
//     statTitle: {
//       fontSize: '0.95rem',
//       fontWeight: '600',
//       color: '#166534',
//       marginBottom: '0.5rem',
//     },
    
//     statDescription: {
//       fontSize: '0.85rem',
//       color: '#16a34a',
//       lineHeight: '1.4',
//     },
    
//     // Premium button with multiple effects
//     buttonContainer: {
//       position: 'relative',
//       transform: showAnimation ? 'translateY(0)' : 'translateY(20px)',
//       opacity: showAnimation ? 1 : 0,
//       transition: 'all 0.8s ease-out',
//       transitionDelay: '1.2s',
//     },
    
//     homeButton: {
//       background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
//       color: 'white',
//       padding: '1.25rem 3rem',
//       borderRadius: '1rem',
//       border: 'none',
//       fontSize: '1.1rem',
//       fontWeight: '700',
//       cursor: 'pointer',
//       transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
//       boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
//       position: 'relative',
//       overflow: 'hidden',
//       textTransform: 'uppercase',
//       letterSpacing: '0.05em',
//     },
    
//     buttonShine: {
//       position: 'absolute',
//       top: 0,
//       left: '-100%',
//       width: '100%',
//       height: '100%',
//       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
//       transition: 'left 0.6s ease',
//     },
    
//     // Fireworks effect
//     firework: {
//       position: 'absolute',
//       width: '4px',
//       height: '4px',
//       borderRadius: '50%',
//       pointerEvents: 'none',
//       zIndex: 4,
//     },
    
//     // Sparkle effects
//     sparkle: {
//       position: 'absolute',
//       width: '6px',
//       height: '6px',
//       background: '#fbbf24',
//       borderRadius: '50%',
//       pointerEvents: 'none',
//       zIndex: 4,
//       animation: 'sparkle 1.5s ease-out infinite',
//     },
//   };

//   // Enhanced keyframes with more animations
//   const keyframes = `
//     @keyframes float {
//       0%, 100% { transform: translateY(0px) rotate(0deg); }
//       50% { transform: translateY(-25px) rotate(180deg); }
//     }
    
//     @keyframes pulse {
//       0% { transform: scale(1); opacity: 0.8; }
//       50% { transform: scale(1.15); opacity: 0.4; }
//       100% { transform: scale(1); opacity: 0.8; }
//     }
    
//     @keyframes twinkle {
//       0% { opacity: 0.3; transform: scale(1); }
//       100% { opacity: 1; transform: scale(1.2); }
//     }
    
//     @keyframes firework {
//       0% { 
//         transform: translateY(100vh) scale(0);
//         opacity: 1;
//       }
//       15% {
//         transform: translateY(20vh) scale(1);
//         opacity: 1;
//       }
//       25% {
//         transform: translateY(20vh) scale(1);
//         opacity: 1;
//       }
//       100% { 
//         transform: translateY(-20vh) scale(0);
//         opacity: 0;
//       }
//     }
    
//     @keyframes sparkle {
//       0%, 100% { 
//         opacity: 0;
//         transform: scale(0) rotate(0deg);
//       }
//       50% { 
//         opacity: 1;
//         transform: scale(1) rotate(180deg);
//       }
//     }
    
//     @keyframes slideInUp {
//       0% {
//         transform: translateY(30px);
//         opacity: 0;
//       }
//       100% {
//         transform: translateY(0);
//         opacity: 1;
//       }
//     }
//   `;

//   const steps = [
//     { icon: "💳", title: "Payment", description: "Processed" },
//     { icon: "✅", title: "Booking", description: "Confirmed" },
//     { icon: "📧", title: "Email", description: "Sent" },
//   ];

//   const stats = [
//     {
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
//         </svg>
//       ),
//       title: "Appointment Secured",
//       description: "Your slot is reserved and confirmed"
//     },
//     {
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.5 7.5h-4l4-4v4zM3 12h18m-9-9v18"/>
//         </svg>
//       ),
//       title: "Instant Confirmation",
//       description: "Details sent to your email immediately"
//     },
//     {
//       icon: (
//         <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
//         </svg>
//       ),
//       title: "Reminders Set",
//       description: "You'll get notified before your appointment"
//     },
//   ];

//   const handleButtonHover = (e) => {
//     e.target.style.transform = 'translateY(-4px) scale(1.05)';
//     e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.5)';
//     const shine = e.target.querySelector('.button-shine');
//     if (shine) shine.style.left = '100%';
//   };

//   const handleButtonLeave = (e) => {
//     e.target.style.transform = 'translateY(0) scale(1)';
//     e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
//     const shine = e.target.querySelector('.button-shine');
//     if (shine) shine.style.left = '-100%';
//   };

//   const handleStatHover = (e) => {
//     e.target.style.transform = 'translateY(-5px) scale(1.02)';
//     e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.2)';
//   };

//   const handleStatLeave = (e) => {
//     e.target.style.transform = 'translateY(0) scale(1)';
//     e.target.style.boxShadow = 'none';
//   };

//   return (
//     <>
//       <style>{keyframes}</style>
//       <div style={styles.container}>
//         {/* Animated Star Field */}
//         <div style={styles.starField}>
//           {[...Array(50)].map((_, i) => (
//             <div
//               key={i}
//               style={{
//                 ...styles.star,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 width: `${Math.random() * 3 + 1}px`,
//                 height: `${Math.random() * 3 + 1}px`,
//                 animationDelay: `${Math.random() * 2}s`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Fireworks */}
//         {showFireworks && (
//           <>
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 style={{
//                   ...styles.firework,
//                   left: `${20 + i * 10}%`,
//                   background: `hsl(${i * 45}, 70%, 60%)`,
//                   animation: `firework 3s ease-out ${i * 0.2}s`,
//                 }}
//               />
//             ))}
//           </>
//         )}

//         {/* Sparkles */}
//         {showSparkles && (
//           <>
//             {[...Array(20)].map((_, i) => (
//               <div
//                 key={i}
//                 style={{
//                   ...styles.sparkle,
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 100}%`,
//                   animationDelay: `${Math.random() * 1.5}s`,
//                 }}
//               />
//             ))}
//           </>
//         )}

//         {/* Success Card */}
//         <div style={styles.successCard}>
//           {/* Checkmark Section */}
//           <div style={styles.checkmarkSection}>
//             <div style={styles.checkmarkContainer}>
//               <div style={styles.pulseRing1}></div>
//               <div style={styles.pulseRing2}></div>
//               <svg style={styles.checkmark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path 
//                   style={styles.checkmarkPath}
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth="3" 
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//           </div>

//           <h1 style={styles.title}>Payment Successful!</h1>
//           <p style={styles.subtitle}>🎉 Congratulations!</p>
          
//           <p style={styles.description}>
//             Your consultation has been successfully booked and confirmed. 
//             You'll receive detailed information and reminders about your upcoming appointment.
//           </p>

//           {/* Progress Steps */}
//           <div style={styles.progressSection}>
//             <h3 style={styles.progressTitle}>Booking Progress</h3>
//             <div style={styles.progressSteps}>
//               {steps.map((step, index) => (
//                 <div key={index} style={styles.progressStep}>
//                   <div style={{
//                     ...styles.stepCircle,
//                     ...(index < currentStep ? styles.stepCompleted :
//                         index === currentStep ? styles.stepActive : styles.stepPending)
//                   }}>
//                     <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>
//                   </div>
//                   <div>
//                     <div style={{
//                       ...styles.stepText,
//                       ...(index <= currentStep ? styles.stepTextActive : {})
//                     }}>
//                       {step.title}
//                     </div>
//                     <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
//                       {step.description}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Stats Section */}
//           <div style={styles.statsSection}>
//             {stats.map((stat, index) => (
//               <div 
//                 key={index} 
//                 style={styles.statCard}
//                 onMouseEnter={handleStatHover}
//                 onMouseLeave={handleStatLeave}
//               >
//                 <div style={styles.statIcon}>
//                   {stat.icon}
//                 </div>
//                 <h4 style={styles.statTitle}>{stat.title}</h4>
//                 <p style={styles.statDescription}>{stat.description}</p>
//               </div>
//             ))}
//           </div>

//           {/* Enhanced Button */}
//           <div style={styles.buttonContainer}>
//             <button
//               onClick={() => navigate("/")}
//               onMouseEnter={handleButtonHover}
//               onMouseLeave={handleButtonLeave}
//               style={styles.homeButton}
//             >
//               <div className="button-shine" style={styles.buttonShine}></div>
//               Return to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentSuccess;





































import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showRipples, setShowRipples] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    console.log("session_id:", sessionId);

    if (!sessionId) {
      toast.error("Invalid session ID. Please contact support.");
      return navigate("/");
    }

    toast.success("🎉 Payment Successful! Your appointment is confirmed.", {
      position: "top-center",
      autoClose: 5000,
    });

    // Orchestrated animation sequence
    setTimeout(() => setShowAnimation(true), 200);
    setTimeout(() => setShowRipples(true), 600);
    setTimeout(() => setShowConfetti(true), 800);
    setTimeout(() => setShowCoins(true), 1000);
    setTimeout(() => setShowBadges(true), 1200);
    
    // Progressive badge animation
    setTimeout(() => setCurrentBadge(1), 1500);
    setTimeout(() => setCurrentBadge(2), 2000);
    setTimeout(() => setCurrentBadge(3), 2500);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    
    // Animated background waves
    backgroundWaves: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1,
    },
    
    wave: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(16, 185, 129, 0.05)',
      animation: 'wave 8s ease-in-out infinite',
    },
    
    // Floating healthcare icons
    floatingIcons: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 1,
    },
    
    floatingIcon: {
      position: 'absolute',
      color: 'rgba(16, 185, 129, 0.3)',
      animation: 'floatIcon 6s ease-in-out infinite',
    },
    
    // Enhanced success card
    successCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '2rem 1.5rem',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      maxWidth: '28rem',
      width: '100%',
      position: 'relative',
      zIndex: 2,
      transform: showAnimation ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      opacity: showAnimation ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(16, 185, 129, 0.1)',
    },
    
    // Enhanced checkmark with ripples
    checkmarkSection: {
      position: 'relative',
      marginBottom: '1.5rem',
    },
    
    checkmarkContainer: {
      width: '4rem',
      height: '4rem',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transform: showAnimation ? 'scale(1) rotateY(0deg)' : 'scale(0) rotateY(180deg)',
      transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      transitionDelay: '0.3s',
      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
    },
    
    checkmark: {
      width: '2rem',
      height: '2rem',
      color: 'white',
      animation: showAnimation ? 'checkmarkBounce 0.6s ease-out 0.8s both' : 'none',
    },
    
    checkmarkPath: {
      strokeDasharray: '50',
      strokeDashoffset: showAnimation ? '0' : '50',
      transition: 'stroke-dashoffset 0.8s ease-in-out',
      transitionDelay: '0.6s',
    },
    
    // Ripple effects
    ripple: {
      position: 'absolute',
      border: '2px solid rgba(16, 185, 129, 0.6)',
      borderRadius: '50%',
      animation: showRipples ? 'ripple 2s ease-out infinite' : 'none',
    },
    
    ripple1: {
      top: '-1rem',
      left: '-1rem',
      right: '-1rem',
      bottom: '-1rem',
      animationDelay: '0s',
    },
    
    ripple2: {
      top: '-2rem',
      left: '-2rem',
      right: '-2rem',
      bottom: '-2rem',
      animationDelay: '0.5s',
    },
    
    ripple3: {
      top: '-3rem',
      left: '-3rem',
      right: '-3rem',
      bottom: '-3rem',
      animationDelay: '1s',
    },
    
    // Typography with animations
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
      animation: showAnimation ? 'titleReveal 0.8s ease-out 0.4s both' : 'none',
    },
    
    subtitle: {
      fontSize: '1rem',
      color: '#10b981',
      fontWeight: '600',
      marginBottom: '1rem',
      animation: showAnimation ? 'subtitleSlide 0.6s ease-out 0.6s both' : 'none',
    },
    
    description: {
      color: '#64748b',
      fontSize: '0.95rem',
      marginBottom: '1.5rem',
      lineHeight: '1.5',
      animation: showAnimation ? 'fadeInUp 0.6s ease-out 0.8s both' : 'none',
    },
    
    // Animated success badges
    badgesContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    
    badge: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      minWidth: '80px',
      transform: 'translateY(30px) scale(0.8)',
      opacity: 0,
      transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    badgeActive: {
      transform: 'translateY(0) scale(1)',
      opacity: 1,
    },
    
    badgeIcon: {
      fontSize: '1.5rem',
      marginBottom: '0.25rem',
      animation: 'bounce 1s ease-in-out infinite',
    },
    
    badgeText: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#166534',
    },
    
    // Enhanced button
    homeButton: {
      background: 'linear-gradient(135deg, #059669, #10b981)',
      color: 'white',
      padding: '0.75rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      animation: showAnimation ? 'buttonSlideUp 0.6s ease-out 1s both' : 'none',
    },
    
    buttonShine: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      transition: 'left 0.6s ease',
    },
    
    // Celebration particles
    particles: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      pointerEvents: 'none',
      zIndex: 3,
    },
    
    particle: {
      position: 'absolute',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      animation: 'particleBurst 1.5s ease-out forwards',
    },
    
    // Falling coins
    coin: {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      pointerEvents: 'none',
      zIndex: 3,
      animation: 'coinFall 3s ease-out forwards',
      boxShadow: 'inset 2px 2px 4px rgba(255, 255, 255, 0.3)',
    },
    
    // Floating confetti
    confetti: {
      position: 'absolute',
      width: '8px',
      height: '8px',
      pointerEvents: 'none',
      zIndex: 3,
      animation: 'confetti 3s ease-out forwards',
    },
  };

  // Enhanced keyframes
  const keyframes = `
    @keyframes wave {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.1; }
      50% { transform: scale(1.2) rotate(180deg); opacity: 0.05; }
    }
    
    @keyframes floatIcon {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
    }
    
    @keyframes ripple {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes checkmarkBounce {
      0% { transform: scale(0.5); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes titleReveal {
      0% { transform: translateY(20px) scale(0.9); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    @keyframes subtitleSlide {
      0% { transform: translateX(-30px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeInUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes buttonSlideUp {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes particleBurst {
      0% { 
        transform: translateX(0) translateY(0) scale(1);
        opacity: 1;
      }
      100% { 
        transform: translateX(var(--dx)) translateY(var(--dy)) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes coinFall {
      0% { 
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      70% {
        opacity: 1;
      }
      100% { 
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    @keyframes confetti {
      0% { 
        transform: translateY(-50px) rotate(0deg);
        opacity: 1;
      }
      100% { 
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;

  const badges = [
    { icon: '💳', text: 'Paid', delay: 0.2 },
    { icon: '✅', text: 'Booked', delay: 0.4 },
    { icon: '📧', text: 'Notified', delay: 0.6 },
  ];

  const healthIcons = ['🏥', '💊', '🩺', '❤️', '⚕️'];

  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-3px) scale(1.05)';
    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
    const shine = e.target.querySelector('.button-shine');
    if (shine) shine.style.left = '100%';
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0) scale(1)';
    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
    const shine = e.target.querySelector('.button-shine');
    if (shine) shine.style.left = '-100%';
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Animated Background Waves */}
        <div style={styles.backgroundWaves}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.wave,
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Healthcare Icons */}
        <div style={styles.floatingIcons}>
          {healthIcons.map((icon, i) => (
            <div
              key={i}
              style={{
                ...styles.floatingIcon,
                fontSize: '2rem',
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Celebration Particles */}
        {showAnimation && (
          <div style={styles.particles}>
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const distance = 100;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.particle,
                    background: `hsl(${120 + i * 15}, 70%, 60%)`,
                    '--dx': `${Math.cos(angle) * distance}px`,
                    '--dy': `${Math.sin(angle) * distance}px`,
                    animationDelay: `${0.8 + i * 0.1}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Falling Coins */}
        {showCoins && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.coin,
                  left: `${20 + i * 12}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Floating Confetti */}
        {showConfetti && (
          <>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.confetti,
                  left: `${15 + i * 8}%`,
                  top: '5%',
                  background: i % 4 === 0 ? '#10b981' : 
                             i % 4 === 1 ? '#3b82f6' : 
                             i % 4 === 2 ? '#f59e0b' : '#ef4444',
                  borderRadius: i % 2 === 0 ? '50%' : '2px',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Success Card */}
        <div style={styles.successCard}>
          {/* Enhanced Checkmark with Ripples */}
          <div style={styles.checkmarkSection}>
            <div style={styles.checkmarkContainer}>
              <div style={{...styles.ripple, ...styles.ripple1}}></div>
              <div style={{...styles.ripple, ...styles.ripple2}}></div>
              <div style={{...styles.ripple, ...styles.ripple3}}></div>
              <svg style={styles.checkmark} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  style={styles.checkmarkPath}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 style={styles.title}>Payment Successful!</h1>
          <p style={styles.subtitle}>🎉 Congratulations!</p>
          
          <p style={styles.description}>
            Your consultation has been booked successfully. 
            We'll send you confirmation details shortly.
          </p>

          {/* Animated Success Badges */}
          <div style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.badge,
                  ...(index < currentBadge ? styles.badgeActive : {}),
                  transitionDelay: `${badge.delay}s`,
                }}
              >
                <div style={styles.badgeIcon}>{badge.icon}</div>
                <div style={styles.badgeText}>{badge.text}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Button */}
          <button
            onClick={() => navigate("/")}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            style={styles.homeButton}
          >
            <div className="button-shine" style={styles.buttonShine}></div>
            Return to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
