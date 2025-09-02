// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function BloodPortal() {
//   const [loading, setLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState("home");
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showMyDonations, setShowMyDonations] = useState(false);
//   const [showMyRequests, setShowMyRequests] = useState(false);
//   const [bloodData, setBloodData] = useState({
//     bloodBanks: [],
//     urgentRequests: [],
//     userStats: {
//       acceptedDonations: 0,
//       acceptedRequests: 0,
//       livesSaved: 0,
//       canDonate: true,
//       pendingDonations: 0,
//       pendingRequests: 0
//     },
//     myDonations: [],
//     myRequests: [],
//     notifications: []
//   });

//   useEffect(() => {
//     initializeBloodPortal();
//   }, []);

//   const initializeBloodPortal = async () => {
//     try {
//       setLoading(true);
      
//       // Using your exact API endpoints
//       const [banksRes, urgentRes, donationsRes, requestsRes] = await Promise.all([
//         axios.get('http://localhost:1600/api/blood-bank/banks', { withCredentials: true }),
//         axios.get('http://localhost:1600/api/blood-bank-user/blood/urgent-requests', { withCredentials: true }),
//         axios.get('http://localhost:1600/api/blood-bank-user/donation-requests', { withCredentials: true }),
//         axios.get('http://localhost:1600/api/blood-bank-user/blood-requests', { withCredentials: true })
//       ]);

//       // Calculate stats from the data
//       const donations = donationsRes.data.donations || [];
//       const requests = requestsRes.data.requests || [];
      
//       const acceptedDonations = donations.filter(d => d.status === 'accepted').length;
//       const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
//       const pendingDonations = donations.filter(d => d.status === 'pending').length;
//       const pendingRequests = requests.filter(r => r.status === 'pending').length;
//       const livesSaved = acceptedDonations * 3;

//       // Create mock notifications based on recent activities
//       const notifications = [
//         ...donations.slice(0, 3).map(d => ({
//           id: `donation-${d._id}`,
//           type: 'donation',
//           title: `Donation ${d.status}`,
//           message: `Your ${d.blood_group} blood donation has been ${d.status}`,
//           time: new Date(d.requested_date).toLocaleDateString(),
//           status: d.status
//         })),
//         ...requests.slice(0, 3).map(r => ({
//           id: `request-${r._id}`,
//           type: 'request',
//           title: `Request ${r.status}`,
//           message: `Your ${r.blood_group} blood request has been ${r.status}`,
//           time: new Date(r.requested_date).toLocaleDateString(),
//           status: r.status
//         }))
//       ].slice(0, 5);

//       setBloodData({
//         bloodBanks: banksRes.data.banks || banksRes.data || [],
//         urgentRequests: urgentRes.data.urgent || [],
//         userStats: {
//           acceptedDonations,
//           acceptedRequests,
//           livesSaved,
//           canDonate: true,
//           pendingDonations,
//           pendingRequests
//         },
//         myDonations: donations,
//         myRequests: requests,
//         notifications
//       });

//     } catch (error) {
//       console.error('Failed to load Blood Portal:', error);
//       setBloodData({
//         bloodBanks: [],
//         urgentRequests: [],
//         userStats: {
//           acceptedDonations: 0,
//           acceptedRequests: 0,
//           livesSaved: 0,
//           canDonate: true,
//           pendingDonations: 0,
//           pendingRequests: 0
//         },
//         myDonations: [],
//         myRequests: [],
//         notifications: []
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = async () => {
//     await initializeBloodPortal();
//   };

//   const handleDonationSubmit = async (donationData) => {
//     try {
//       console.log('Submitting donation data:', donationData);
//       const response = await axios.post('http://localhost:1600/api/blood-bank-user/donation-request', donationData);

//       if (response.data.message) {
//         alert('🎉 ' + response.data.message);
//         await refreshData();
//       }
//     } catch (error) {
//       console.error('Donation submission failed:', error);
//       alert(error.response?.data?.message || 'Failed to submit donation request');
//     }
//   };

//   const handleRequestSubmit = async (requestData) => {
//     try {
//       console.log('Submitting request data:', requestData);
//       const response = await axios.post('http://localhost:1600/api/blood-bank-user/request-blood', requestData);

//       if (response.data.message) {
//         alert('🙏 ' + response.data.message);
//         await refreshData();
//       }
//     } catch (error) {
//       console.error('Request submission failed:', error);
//       alert(error.response?.data?.message || 'Failed to submit blood request');
//     }
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.loadingContent}>
//           <div style={styles.loadingIcon}>🩸</div>
//           <div style={styles.loadingText}>Loading Blood Portal...</div>
//           <div style={styles.progressBar}>
//             <div style={styles.progressFill}></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* Enhanced Header with Notifications, My Donations, My Requests */}
//       <header style={styles.header}>
//         <div style={styles.headerContent}>
//           <div style={styles.logo}>
//             <span style={styles.logoIcon}>🩸</span>
//             <span style={styles.logoText}>BloodBank Portal</span>
//           </div>
          
//           <div style={styles.headerActions}>
//             {/* Notifications Dropdown */}
//             <div style={styles.headerActionItem}>
//               <button 
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 style={styles.headerButton}
//               >
//                 <span style={styles.headerButtonIcon}>🔔</span>
//                 <span style={styles.headerButtonText}>Notifications</span>
//                 {bloodData.notifications.length > 0 && (
//                   <span style={styles.notificationBadge}>{bloodData.notifications.length}</span>
//                 )}
//               </button>
              
//               {showNotifications && (
//                 <div style={styles.dropdown}>
//                   <div style={styles.dropdownHeader}>
//                     <h4>Recent Notifications</h4>
//                   </div>
//                   <div style={styles.dropdownContent}>
//                     {bloodData.notifications.length === 0 ? (
//                       <div style={styles.emptyDropdown}>
//                         <span style={styles.emptyIcon}>🔔</span>
//                         <p>No notifications yet</p>
//                       </div>
//                     ) : (
//                       bloodData.notifications.map(notification => (
//                         <div key={notification.id} style={styles.notificationItem}>
//                           <div style={styles.notificationIcon}>
//                             {notification.type === 'donation' ? '🩸' : '🆘'}
//                           </div>
//                           <div style={styles.notificationContent}>
//                             <h5 style={styles.notificationTitle}>{notification.title}</h5>
//                             <p style={styles.notificationMessage}>{notification.message}</p>
//                             <span style={styles.notificationTime}>{notification.time}</span>
//                           </div>
//                           <div style={{
//                             ...styles.notificationStatus,
//                             backgroundColor: notification.status === 'accepted' ? '#27ae60' : 
//                                             notification.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                           }}>
//                             {notification.status === 'accepted' ? '✅' :
//                              notification.status === 'rejected' ? '❌' : '⏳'}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* My Donations Dropdown */}
//             <div style={styles.headerActionItem}>
//               <button 
//                 onClick={() => setShowMyDonations(!showMyDonations)}
//                 style={styles.headerButton}
//               >
//                 <span style={styles.headerButtonIcon}>🩸</span>
//                 <span style={styles.headerButtonText}>My Donations</span>
//                 <span style={styles.countBadge}>{bloodData.userStats.acceptedDonations}</span>
//               </button>
              
//               {showMyDonations && (
//                 <div style={styles.dropdown}>
//                   <div style={styles.dropdownHeader}>
//                     <h4>My Donations ({bloodData.myDonations.length})</h4>
//                     <div style={styles.statsRow}>
//                       <span style={styles.statBadge}>✅ {bloodData.userStats.acceptedDonations} Accepted</span>
//                       <span style={styles.statBadge}>⏳ {bloodData.userStats.pendingDonations} Pending</span>
//                     </div>
//                   </div>
//                   <div style={styles.dropdownContent}>
//                     {bloodData.myDonations.length === 0 ? (
//                       <div style={styles.emptyDropdown}>
//                         <span style={styles.emptyIcon}>🩸</span>
//                         <p>No donations yet</p>
//                         <button 
//                           onClick={() => setActiveSection('donate')}
//                           style={styles.emptyActionButton}
//                         >
//                           Make First Donation
//                         </button>
//                       </div>
//                     ) : (
//                       bloodData.myDonations.slice(0, 5).map(donation => (
//                         <div key={donation._id} style={styles.dropdownItem}>
//                           <div style={styles.itemLeft}>
//                             <span style={styles.bloodTypeSmall}>{donation.blood_group}</span>
//                             <span style={styles.itemUnits}>{donation.units_donated}u</span>
//                           </div>
//                           <div style={styles.itemCenter}>
//                             <span style={styles.itemBank}>{donation.bank_id?.name || 'Blood Bank'}</span>
//                             <span style={styles.itemDate}>{new Date(donation.requested_date).toLocaleDateString()}</span>
//                           </div>
//                           <div style={styles.itemRight}>
//                             <span style={{
//                               ...styles.itemStatus,
//                               color: donation.status === 'accepted' ? '#27ae60' : 
//                                      donation.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                             }}>
//                               {donation.status === 'accepted' ? '✅' :
//                                donation.status === 'rejected' ? '❌' : '⏳'}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                     {bloodData.myDonations.length > 5 && (
//                       <div style={styles.viewAllButton} onClick={() => setActiveSection('history')}>
//                         View All Donations ({bloodData.myDonations.length})
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* My Requests Dropdown */}
//             <div style={styles.headerActionItem}>
//               <button 
//                 onClick={() => setShowMyRequests(!showMyRequests)}
//                 style={styles.headerButton}
//               >
//                 <span style={styles.headerButtonIcon}>🆘</span>
//                 <span style={styles.headerButtonText}>My Requests</span>
//                 <span style={styles.countBadge}>{bloodData.userStats.acceptedRequests}</span>
//               </button>
              
//               {showMyRequests && (
//                 <div style={styles.dropdown}>
//                   <div style={styles.dropdownHeader}>
//                     <h4>My Requests ({bloodData.myRequests.length})</h4>
//                     <div style={styles.statsRow}>
//                       <span style={styles.statBadge}>✅ {bloodData.userStats.acceptedRequests} Fulfilled</span>
//                       <span style={styles.statBadge}>⏳ {bloodData.userStats.pendingRequests} Pending</span>
//                     </div>
//                   </div>
//                   <div style={styles.dropdownContent}>
//                     {bloodData.myRequests.length === 0 ? (
//                       <div style={styles.emptyDropdown}>
//                         <span style={styles.emptyIcon}>🆘</span>
//                         <p>No requests yet</p>
//                         <button 
//                           onClick={() => setActiveSection('request')}
//                           style={styles.emptyActionButton}
//                         >
//                           Make First Request
//                         </button>
//                       </div>
//                     ) : (
//                       bloodData.myRequests.slice(0, 5).map(request => (
//                         <div key={request._id} style={styles.dropdownItem}>
//                           <div style={styles.itemLeft}>
//                             <span style={styles.bloodTypeSmall}>{request.blood_group}</span>
//                             <span style={styles.itemUnits}>{request.units_requested}u</span>
//                           </div>
//                           <div style={styles.itemCenter}>
//                             <span style={styles.itemBank}>{request.bank_id?.name || 'Blood Bank'}</span>
//                             <span style={styles.itemDate}>{new Date(request.requested_date).toLocaleDateString()}</span>
//                           </div>
//                           <div style={styles.itemRight}>
//                             <span style={{
//                               ...styles.itemStatus,
//                               color: request.status === 'accepted' ? '#27ae60' : 
//                                      request.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                             }}>
//                               {request.status === 'accepted' ? '✅' :
//                                request.status === 'rejected' ? '❌' : '⏳'}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                     {bloodData.myRequests.length > 5 && (
//                       <div style={styles.viewAllButton} onClick={() => setActiveSection('history')}>
//                         View All Requests ({bloodData.myRequests.length})
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Quick Stats */}
//             <div style={styles.quickStats}>
//               <div style={styles.quickStat}>
//                 <span style={styles.quickStatNumber}>{bloodData.userStats.livesSaved}</span>
//                 <span style={styles.quickStatLabel}>Lives Saved</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Click outside to close dropdowns */}
//       {(showNotifications || showMyDonations || showMyRequests) && (
//         <div 
//           style={styles.overlay} 
//           onClick={() => {
//             setShowNotifications(false);
//             setShowMyDonations(false);
//             setShowMyRequests(false);
//           }}
//         />
//       )}

//       {/* Enhanced Hero Section */}
//       <section style={styles.hero}>
//         <div style={styles.heroContent}>
//           <div style={styles.heroLeft}>
//             <h1 style={styles.heroTitle}>
//               Save Lives Through <span style={styles.highlight}>Blood Donation</span>
//             </h1>
//             <p style={styles.heroSubtitle}>
//               Your contribution can save up to 3 lives. Join our community of life-savers!
//             </p>
//             <div style={styles.heroButtons}>
//               <button 
//                 onClick={() => setActiveSection('donate')}
//                 style={styles.heroPrimaryButton}
//               >
//                 🩸 Donate Now
//               </button>
//               <button 
//                 onClick={() => setActiveSection('request')}
//                 style={styles.heroSecondaryButton}
//               >
//                 🆘 Request Blood
//               </button>
//             </div>
//           </div>
//           <div style={styles.heroRight}>
//             <div style={styles.heroStatsCard}>
//               <h3 style={styles.heroStatsTitle}>Your Impact</h3>
//               <div style={styles.heroStatsList}>
//                 <div style={styles.heroStatItem}>
//                   <span style={styles.heroStatIcon}>🩸</span>
//                   <div>
//                     <div style={styles.heroStatNumber}>{bloodData.userStats.acceptedDonations}</div>
//                     <div style={styles.heroStatLabel}>Successful Donations</div>
//                   </div>
//                 </div>
//                 <div style={styles.heroStatItem}>
//                   <span style={styles.heroStatIcon}>🆘</span>
//                   <div>
//                     <div style={styles.heroStatNumber}>{bloodData.userStats.acceptedRequests}</div>
//                     <div style={styles.heroStatLabel}>Fulfilled Requests</div>
//                   </div>
//                 </div>
//                 <div style={styles.heroStatItem}>
//                   <span style={styles.heroStatIcon}>❤️</span>
//                   <div>
//                     <div style={styles.heroStatNumber}>{bloodData.userStats.livesSaved}</div>
//                     <div style={styles.heroStatLabel}>Lives Saved</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Enhanced Navigation */}
//       <nav style={styles.nav}>
//         <div style={styles.navContent}>
//           {[
//             { id: "home", label: "Dashboard", icon: "🏠", color: "#3498db" },
//             { id: "donate", label: "Donate Blood", icon: "🩸", color: "#e74c3c" },
//             { id: "request", label: "Request Blood", icon: "🆘", color: "#f39c12" },
//             { id: "history", label: "My History", icon: "📊", color: "#9b59b6" },
//             { id: "urgent", label: "Urgent Needs", icon: "⚡", color: "#e67e22" }
//           ].map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveSection(item.id)}
//               style={{
//                 ...styles.navButton,
//                 ...(activeSection === item.id ? {
//                   ...styles.navButtonActive,
//                   backgroundColor: item.color,
//                   boxShadow: `0 8px 25px ${item.color}40`,
//                   transform: 'translateY(-2px)'
//                 } : {})
//               }}
//               onMouseEnter={(e) => {
//                 if (activeSection !== item.id) {
//                   e.target.style.backgroundColor = `${item.color}20`;
//                   e.target.style.borderColor = item.color;
//                   e.target.style.color = item.color;
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (activeSection !== item.id) {
//                   e.target.style.backgroundColor = 'white';
//                   e.target.style.borderColor = '#ecf0f1';
//                   e.target.style.color = '#2c3e50';
//                 }
//               }}
//             >
//               <span style={styles.navIcon}>{item.icon}</span>
//               <span style={styles.navLabel}>{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Content with better styling */}
//       <div style={styles.content}>
//         <div style={styles.contentWrapper}>
//           {activeSection === "home" && (
//             <HomeSection 
//               urgentRequests={bloodData.urgentRequests} 
//               bloodBanks={bloodData.bloodBanks}
//               userStats={bloodData.userStats}
//               setActiveSection={setActiveSection} 
//             />
//           )}
//           {activeSection === "donate" && (
//             <DonateSection 
//               bloodBanks={bloodData.bloodBanks}
//               userStats={bloodData.userStats}
//               onSubmit={handleDonationSubmit} 
//             />
//           )}
//           {activeSection === "request" && (
//             <RequestSection 
//               bloodBanks={bloodData.bloodBanks}
//               userStats={bloodData.userStats}
//               onSubmit={handleRequestSubmit} 
//             />
//           )}
//           {activeSection === "history" && (
//             <HistorySection 
//               myDonations={bloodData.myDonations}
//               myRequests={bloodData.myRequests}
//               userStats={bloodData.userStats}
//               setActiveSection={setActiveSection}
//             />
//           )}
//           {activeSection === "urgent" && (
//             <UrgentSection urgentRequests={bloodData.urgentRequests} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Keep your existing section components (HomeSection, DonateSection, etc.) 
// // but I'll show you the updated HomeSection with better styling:

// function HomeSection({ urgentRequests, bloodBanks, userStats, setActiveSection }) {
//   return (
//     <div style={styles.section}>
//       <div style={styles.welcomeCard}>
//         <div style={styles.welcomeContent}>
//           <h2 style={styles.welcomeTitle}>Your Blood Bank Journey 🌟</h2>
//           <p style={styles.welcomeText}>
//             Track your life-saving contributions and make a real difference in your community!
//           </p>
          
//           <div style={styles.achievementShowcase}>
//             <div style={styles.achievementItem}>
//               <div style={styles.achievementNumber}>{userStats.acceptedDonations}</div>
//               <div style={styles.achievementLabel}>Successful Donations</div>
//               <div style={styles.achievementDesc}>Accepted by blood banks</div>
//             </div>
//             <div style={styles.achievementDivider}>→</div>
//             <div style={styles.achievementItem}>
//               <div style={styles.achievementNumber}>{userStats.livesSaved}</div>
//               <div style={styles.achievementLabel}>Lives Saved</div>
//               <div style={styles.achievementDesc}>Through your donations</div>
//             </div>
//             <div style={styles.achievementDivider}>→</div>
//             <div style={styles.achievementItem}>
//               <div style={styles.achievementNumber}>{userStats.acceptedRequests}</div>
//               <div style={styles.achievementLabel}>Requests Fulfilled</div>
//               <div style={styles.achievementDesc}>When you needed help</div>
//             </div>
//           </div>

//           {(userStats.pendingDonations > 0 || userStats.pendingRequests > 0) && (
//             <div style={styles.pendingAlert}>
//               <span style={styles.pendingIcon}>⏳</span>
//               <div style={styles.pendingText}>
//                 {userStats.pendingDonations > 0 && (
//                   <span>{userStats.pendingDonations} donation{userStats.pendingDonations > 1 ? 's' : ''} pending approval</span>
//                 )}
//                 {userStats.pendingDonations > 0 && userStats.pendingRequests > 0 && <span> • </span>}
//                 {userStats.pendingRequests > 0 && (
//                   <span>{userStats.pendingRequests} request{userStats.pendingRequests > 1 ? 's' : ''} pending approval</span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Action Cards */}
//       <div style={styles.quickActionCards}>
//         <div 
//           onClick={() => setActiveSection('donate')}
//           style={{...styles.quickCard, ...styles.donateCard}}
//         >
//           <div style={styles.quickCardIcon}>🩸</div>
//           <h3 style={styles.quickCardTitle}>Donate Blood</h3>
//           <p style={styles.quickCardDesc}>Save up to 3 lives with one donation</p>
//           <div style={styles.quickCardArrow}>→</div>
//         </div>
        
//         <div 
//           onClick={() => setActiveSection('request')}
//           style={{...styles.quickCard, ...styles.requestCard}}
//         >
//           <div style={styles.quickCardIcon}>🆘</div>
//           <h3 style={styles.quickCardTitle}>Request Blood</h3>
//           <p style={styles.quickCardDesc}>Get help when you need it most</p>
//           <div style={styles.quickCardArrow}>→</div>
//         </div>
        
//         <div 
//           onClick={() => setActiveSection('urgent')}
//           style={{...styles.quickCard, ...styles.urgentCard}}
//         >
//           <div style={styles.quickCardIcon}>⚡</div>
//           <h3 style={styles.quickCardTitle}>Urgent Needs</h3>
//           <p style={styles.quickCardDesc}>Help someone in critical need</p>
//           <div style={styles.quickCardArrow}>→</div>
//         </div>
//       </div>

//       {/* Available Blood Banks Carousel */}
//       {bloodBanks.length > 0 && (
//         <div style={styles.bloodBanksSection}>
//           <h3 style={styles.sectionSubtitle}>🏥 Available Blood Banks ({bloodBanks.length})</h3>
//           <div style={styles.bloodBanksCarousel}>
//             {bloodBanks.slice(0, 6).map(bank => (
//               <div key={bank._id} style={styles.bankCard}>
//                 <div style={styles.bankCardIcon}>🏥</div>
//                 <h4 style={styles.bankCardName}>{bank.name}</h4>
//                 <p style={styles.bankCardLocation}>📍 {bank.location || bank.address}</p>
//                 {bank.phone && (
//                   <p style={styles.bankCardContact}>📞 {bank.phone}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//           {bloodBanks.length > 6 && (
//             <div style={styles.showMoreBanks}>
//               <span>And {bloodBanks.length - 6} more blood banks available...</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Urgent Requests Preview */}
//       {urgentRequests.length > 0 && (
//         <div style={styles.urgentSection}>
//           <h3 style={styles.urgentSectionTitle}>🚨 Critical Blood Needs</h3>
//           <div style={styles.urgentCarousel}>
//             {urgentRequests.slice(0, 3).map(request => (
//               <div key={request._id} style={styles.urgentPreviewCard}>
//                 <div style={styles.urgentCardTop}>
//                   <span style={styles.urgentBloodTypeBig}>{request.blood_group}</span>
//                   <span style={styles.urgentPriorityBadge}>
//                     {request.urgency === 'critical' ? '🔴 CRITICAL' : '🟠 URGENT'}
//                   </span>
//                 </div>
//                 <div style={styles.urgentCardDetails}>
//                   <p>📍 {request.location}</p>
//                   <p>🩸 {request.units_requested} units needed</p>
//                   <p>⏰ {request.timeAgo}</p>
//                 </div>
//                 <button style={styles.urgentHelpBtn}>💪 Help Now</button>
//               </div>
//             ))}
//           </div>
//           <div style={styles.viewAllUrgent} onClick={() => setActiveSection('urgent')}>
//             View All Urgent Requests ({urgentRequests.length})
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Enhanced Styles with modern design
// const styles = {
//   container: {
//     fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     minHeight: "100vh",
//     position: "relative"
//   },

//   // Loading Screen
//   loadingContainer: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//   },
//   loadingContent: {
//     textAlign: "center",
//     background: "rgba(255,255,255,0.95)",
//     padding: "3rem",
//     borderRadius: "20px",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
//     backdropFilter: "blur(10px)"
//   },
//   loadingIcon: {
//     fontSize: "5rem",
//     marginBottom: "1.5rem",
//     animation: "pulse 2s infinite"
//   },
//   loadingText: {
//     fontSize: "1.8rem",
//     color: "#2c3e50",
//     fontWeight: "700",
//     marginBottom: "1.5rem"
//   },
//   progressBar: {
//     width: "200px",
//     height: "4px",
//     background: "#ecf0f1",
//     borderRadius: "2px",
//     overflow: "hidden",
//     margin: "0 auto"
//   },
//   progressFill: {
//     width: "100%",
//     height: "100%",
//     background: "linear-gradient(90deg, #e74c3c, #f39c12)",
//     animation: "slideIn 2s ease-in-out infinite"
//   },

//   // Header with Notifications
//   header: {
//     background: "rgba(255,255,255,0.95)",
//     backdropFilter: "blur(20px)",
//     borderBottom: "1px solid rgba(255,255,255,0.2)",
//     position: "sticky",
//     top: 0,
//     zIndex: 1000,
//     boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
//   },
//   headerContent: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//     padding: "1rem 2rem",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between"
//   },
//   logo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem"
//   },
//   logoIcon: {
//     fontSize: "2.5rem",
//     animation: "heartbeat 2s ease-in-out infinite"
//   },
//   logoText: {
//     fontSize: "1.8rem",
//     fontWeight: "800",
//     color: "#2c3e50",
//     background: "linear-gradient(45deg, #e74c3c, #f39c12)",
//     backgroundClip: "text",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent"
//   },
//   headerActions: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem"
//   },
//   headerActionItem: {
//     position: "relative"
//   },
//   headerButton: {
//     background: "white",
//     border: "2px solid #ecf0f1",
//     borderRadius: "15px",
//     padding: "0.8rem 1.2rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//     position: "relative"
//   },
//   headerButtonIcon: {
//     fontSize: "1.3rem"
//   },
//   headerButtonText: {
//     fontWeight: "600",
//     color: "#2c3e50"
//   },
//   notificationBadge: {
//     background: "#e74c3c",
//     color: "white",
//     borderRadius: "50%",
//     width: "20px",
//     height: "20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "0.7rem",
//     fontWeight: "bold",
//     position: "absolute",
//     top: "-5px",
//     right: "-5px"
//   },
//   countBadge: {
//     background: "#27ae60",
//     color: "white",
//     borderRadius: "12px",
//     padding: "0.2rem 0.5rem",
//     fontSize: "0.8rem",
//     fontWeight: "bold"
//   },
//   quickStats: {
//     background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
//     borderRadius: "15px",
//     padding: "1rem 1.5rem",
//     color: "white"
//   },
//   quickStat: {
//     textAlign: "center"
//   },
//   quickStatNumber: {
//     display: "block",
//     fontSize: "1.8rem",
//     fontWeight: "bold"
//   },
//   quickStatLabel: {
//     fontSize: "0.8rem",
//     opacity: 0.9
//   },

//   // Dropdown Menus
//   dropdown: {
//     position: "absolute",
//     top: "100%",
//     right: "0",
//     background: "white",
//     borderRadius: "15px",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
//     width: "400px",
//     maxHeight: "500px",
//     overflow: "hidden",
//     zIndex: 1001,
//     marginTop: "0.5rem",
//     border: "1px solid rgba(0,0,0,0.1)"
//   },
//   dropdownHeader: {
//     padding: "1.5rem",
//     borderBottom: "1px solid #ecf0f1",
//     background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
//   },
//   dropdownContent: {
//     maxHeight: "400px",
//     overflowY: "auto"
//   },
//   statsRow: {
//     display: "flex",
//     gap: "0.5rem",
//     marginTop: "0.5rem"
//   },
//   statBadge: {
//     background: "#ecf0f1",
//     padding: "0.3rem 0.8rem",
//     borderRadius: "12px",
//     fontSize: "0.8rem",
//     fontWeight: "600",
//     color: "#2c3e50"
//   },
//   emptyDropdown: {
//     textAlign: "center",
//     padding: "3rem 2rem",
//     color: "#7f8c8d"
//   },
//   emptyIcon: {
//     fontSize: "3rem",
//     marginBottom: "1rem"
//   },
//   emptyActionButton: {
//     background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
//     color: "white",
//     border: "none",
//     padding: "0.8rem 1.5rem",
//     borderRadius: "20px",
//     fontSize: "0.9rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "1rem"
//   },
//   notificationItem: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "1rem",
//     padding: "1rem",
//     borderBottom: "1px solid #f8f9fa",
//     transition: "background 0.2s ease"
//   },
//   notificationIcon: {
//     fontSize: "1.5rem",
//     minWidth: "30px"
//   },
//   notificationContent: {
//     flex: 1
//   },
//   notificationTitle: {
//     margin: "0 0 0.3rem 0",
//     color: "#2c3e50",
//     fontSize: "0.9rem",
//     fontWeight: "600"
//   },
//   notificationMessage: {
//     margin: "0 0 0.3rem 0",
//     color: "#7f8c8d",
//     fontSize: "0.8rem",
//     lineHeight: 1.4
//   },
//   notificationTime: {
//     fontSize: "0.7rem",
//     color: "#bdc3c7"
//   },
//   notificationStatus: {
//     width: "24px",
//     height: "24px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "0.8rem",
//     color: "white"
//   },
//   dropdownItem: {
//     display: "flex",
//     alignItems: "center",
//     justify: "space-between",
//     padding: "0.8rem 1rem",
//     borderBottom: "1px solid #f8f9fa",
//     transition: "background 0.2s ease"
//   },
//   itemLeft: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem"
//   },
//   bloodTypeSmall: {
//     background: "#e74c3c",
//     color: "white",
//     padding: "0.3rem 0.6rem",
//     borderRadius: "12px",
//     fontSize: "0.8rem",
//     fontWeight: "bold"
//   },
//   itemUnits: {
//     color: "#2c3e50",
//     fontSize: "0.8rem",
//     fontWeight: "600"
//   },
//   itemCenter: {
//     flex: 1,
//     textAlign: "center"
//   },
//   itemBank: {
//     display: "block",
//     color: "#2c3e50",
//     fontSize: "0.8rem",
//     fontWeight: "600"
//   },
//   itemDate: {
//     display: "block",
//     color: "#7f8c8d",
//     fontSize: "0.7rem"
//   },
//   itemRight: {
//     minWidth: "30px",
//     textAlign: "center"
//   },
//   itemStatus: {
//     fontSize: "1.2rem"
//   },
//   viewAllButton: {
//     padding: "1rem",
//     textAlign: "center",
//     background: "#f8f9fa",
//     color: "#2c3e50",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "background 0.2s ease",
//     borderTop: "1px solid #ecf0f1"
//   },
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.3)",
//     zIndex: 999
//   },

//   // Enhanced Hero Section
//   hero: {
//     background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
//     color: "white",
//     padding: "4rem 2rem",
//     position: "relative",
//     overflow: "hidden"
//   },
//   heroContent: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//     display: "flex",
//     alignItems: "center",
//     gap: "4rem"
//   },
//   heroLeft: {
//     flex: 1
//   },
//   heroTitle: {
//     fontSize: "3.5rem",
//     fontWeight: "800",
//     marginBottom: "1.5rem",
//     lineHeight: 1.2
//   },
//   highlight: {
//     background: "linear-gradient(45deg, #e74c3c, #f39c12)",
//     backgroundClip: "text",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent"
//   },
//   heroSubtitle: {
//     fontSize: "1.3rem",
//     opacity: 0.9,
//     marginBottom: "2.5rem",
//     lineHeight: 1.6
//   },
//   heroButtons: {
//     display: "flex",
//     gap: "1rem"
//   },
//   heroPrimaryButton: {
//     background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
//     color: "white",
//     border: "none",
//     padding: "1.2rem 2.5rem",
//     borderRadius: "30px",
//     fontSize: "1.1rem",
//     fontWeight: "700",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     boxShadow: "0 8px 25px rgba(231,76,60,0.3)"
//   },
//   heroSecondaryButton: {
//     background: "transparent",
//     color: "white",
//     border: "2px solid white",
//     padding: "1.2rem 2.5rem",
//     borderRadius: "30px",
//     fontSize: "1.1rem",
//     fontWeight: "700",
//     cursor: "pointer",
//     transition: "all 0.3s ease"
//   },
//   heroRight: {
//     flex: 1
//   },
//   heroStatsCard: {
//     background: "rgba(255,255,255,0.1)",
//     backdropFilter: "blur(20px)",
//     borderRadius: "20px",
//     padding: "2rem",
//     border: "1px solid rgba(255,255,255,0.2)"
//   },
//   heroStatsTitle: {
//     fontSize: "1.5rem",
//     marginBottom: "1.5rem",
//     fontWeight: "700",
//     textAlign: "center"
//   },
//   heroStatsList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem"
//   },
//   heroStatItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//     background: "rgba(255,255,255,0.1)",
//     padding: "1rem",
//     borderRadius: "12px"
//   },
//   heroStatIcon: {
//     fontSize: "2rem",
//     minWidth: "50px"
//   },
//   heroStatNumber: {
//     fontSize: "2rem",
//     fontWeight: "bold",
//     color: "#ffeaa7"
//   },
//   heroStatLabel: {
//     fontSize: "0.9rem",
//     opacity: 0.9
//   },

//   // Enhanced Navigation
//   nav: {
//     background: "rgba(255,255,255,0.95)",
//     backdropFilter: "blur(20px)",
//     padding: "2rem",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
//   },
//   navContent: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//     display: "flex",
//     justifyContent: "center",
//     gap: "1rem",
//     flexWrap: "wrap"
//   },
//   navButton: {
//     background: "white",
//     border: "2px solid #ecf0f1",
//     borderRadius: "20px",
//     padding: "1.2rem 2rem",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "600",
//     color: "#2c3e50",
//     transition: "all 0.3s ease",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.8rem",
//     minWidth: "160px",
//     justifyContent: "center",
//     boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
//   },
//   navButtonActive: {
//     color: "white",
//     transform: "translateY(-2px)"
//   },
//   navIcon: {
//     fontSize: "1.4rem"
//   },
//   navLabel: {
//     fontSize: "0.95rem"
//   },

//   // Content Area
//   content: {
//     padding: "3rem 2rem"
//   },
//   contentWrapper: {
//     maxWidth: "1400px",
//     margin: "0 auto"
//   },
//   section: {
//     marginBottom: "3rem"
//   },

//   // Welcome Card
//   welcomeCard: {
//     background: "white",
//     borderRadius: "25px",
//     padding: "3rem",
//     marginBottom: "3rem",
//     boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
//     border: "1px solid rgba(0,0,0,0.05)"
//   },
//   welcomeContent: {
//     textAlign: "center"
//   },
//   welcomeTitle: {
//     fontSize: "2.5rem",
//     color: "#2c3e50",
//     marginBottom: "1rem",
//     fontWeight: "800"
//   },
//   welcomeText: {
//     fontSize: "1.2rem",
//     color: "#7f8c8d",
//     marginBottom: "3rem",
//     lineHeight: 1.6
//   },
//   achievementShowcase: {
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "2rem",
//     marginBottom: "2rem",
//     flexWrap: "wrap"
//   },
//   achievementItem: {
//     textAlign: "center",
//     padding: "1.5rem",
//     background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
//     borderRadius: "15px",
//     minWidth: "150px"
//   },
//   achievementNumber: {
//     fontSize: "3rem",
//     fontWeight: "bold",
//     color: "#e74c3c",
//     marginBottom: "0.5rem"
//   },
//   achievementLabel: {
//     fontSize: "1rem",
//     fontWeight: "600",
//     color: "#2c3e50",
//     marginBottom: "0.3rem"
//   },
//   achievementDesc: {
//     fontSize: "0.8rem",
//     color: "#7f8c8d"
//   },
//   achievementDivider: {
//     fontSize: "2rem",
//     color: "#bdc3c7",
//     fontWeight: "bold"
//   },
//   pendingAlert: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//     background: "#fff3cd",
//     border: "1px solid #ffeaa7",
//     borderRadius: "12px",
//     padding: "1rem",
//     marginTop: "2rem"
//   },
//   pendingIcon: {
//     fontSize: "1.5rem"
//   },
//   pendingText: {
//     color: "#856404",
//     fontWeight: "600"
//   },

//   // Quick Action Cards
//   quickActionCards: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
//     gap: "2rem",
//     marginBottom: "3rem"
//   },
//   quickCard: {
//     background: "white",
//     borderRadius: "20px",
//     padding: "2rem",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
//     border: "1px solid rgba(0,0,0,0.05)",
//     position: "relative",
//     overflow: "hidden"
//   },
//   donateCard: {
//     background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
//   },
//   requestCard: {
//     background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
//   },
//   urgentCard: {
//     background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
//   },
//   quickCardIcon: {
//     fontSize: "3.5rem",
//     marginBottom: "1rem"
//   },
//   quickCardTitle: {
//     color: "#2c3e50",
//     marginBottom: "0.8rem",
//     fontSize: "1.4rem",
//     fontWeight: "700"
//   },
//   quickCardDesc: {
//     color: "#5a6c7d",
//     marginBottom: "1.5rem",
//     lineHeight: 1.5
//   },
//   quickCardArrow: {
//     fontSize: "1.5rem",
//     color: "#2c3e50",
//     fontWeight: "bold",
//     position: "absolute",
//     bottom: "1.5rem",
//     right: "1.5rem"
//   },

//   // Blood Banks Section
//   bloodBanksSection: {
//     background: "white",
//     borderRadius: "20px",
//     padding: "2rem",
//     marginBottom: "3rem",
//     boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
//   },
//   sectionSubtitle: {
//     fontSize: "1.8rem",
//     color: "#2c3e50",
//     marginBottom: "2rem",
//     fontWeight: "700",
//     textAlign: "center"
//   },
//   bloodBanksCarousel: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//     gap: "1.5rem",
//     marginBottom: "1rem"
//   },
//   bankCard: {
//     background: "#f8f9fa",
//     borderRadius: "15px",
//     padding: "1.5rem",
//     textAlign: "center",
//     border: "2px solid #ecf0f1",
//     transition: "all 0.3s ease"
//   },
//   bankCardIcon: {
//     fontSize: "2.5rem",
//     marginBottom: "1rem"
//   },
//   bankCardName: {
//     color: "#2c3e50",
//     marginBottom: "0.5rem",
//     fontSize: "1.1rem",
//     fontWeight: "600"
//   },
//   bankCardLocation: {
//     color: "#7f8c8d",
//     marginBottom: "0.3rem",
//     fontSize: "0.9rem"
//   },
//   bankCardContact: {
//     color: "#27ae60",
//     fontSize: "0.9rem",
//     fontWeight: "600"
//   },
//   showMoreBanks: {
//     textAlign: "center",
//     color: "#7f8c8d",
//     fontStyle: "italic"
//   },

//   // Urgent Section
//   urgentSection: {
//     background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
//     borderRadius: "20px",
//     padding: "2rem",
//     color: "white",
//     boxShadow: "0 20px 60px rgba(255,107,107,0.3)"
//   },
//   urgentSectionTitle: {
//     fontSize: "2rem",
//     fontWeight: "700",
//     marginBottom: "2rem",
//     textAlign: "center"
//   },
//   urgentCarousel: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//     gap: "1.5rem",
//     marginBottom: "2rem"
//   },
//   urgentPreviewCard: {
//     background: "rgba(255,255,255,0.1)",
//     borderRadius: "15px",
//     padding: "1.5rem",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(255,255,255,0.2)"
//   },
//   urgentCardTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "1rem"
//   },
//   urgentBloodTypeBig: {
//     background: "rgba(255,255,255,0.2)",
//     padding: "0.8rem 1.2rem",
//     borderRadius: "20px",
//     fontSize: "1.3rem",
//     fontWeight: "bold"
//   },
//   urgentPriorityBadge: {
//     background: "rgba(255,255,255,0.2)",
//     padding: "0.5rem 1rem",
//     borderRadius: "15px",
//     fontSize: "0.8rem",
//     fontWeight: "bold"
//   },
//   urgentCardDetails: {
//     marginBottom: "1.5rem",
//     lineHeight: 1.8
//   },
//   urgentHelpBtn: {
//     background: "rgba(255,255,255,0.2)",
//     color: "white",
//     border: "2px solid rgba(255,255,255,0.3)",
//     padding: "0.8rem 1.5rem",
//     borderRadius: "20px",
//     fontSize: "1rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     width: "100%",
//     backdropFilter: "blur(10px)",
//     transition: "all 0.3s ease"
//   },
//   viewAllUrgent: {
//     textAlign: "center",
//     background: "rgba(255,255,255,0.2)",
//     padding: "1rem",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontWeight: "600",
//     backdropFilter: "blur(10px)"
//   }
// };

// // Add CSS animations
// const styleSheet = document.createElement('style');
// styleSheet.textContent = `
//   @keyframes pulse {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.1); }
//   }
  
//   @keyframes slideIn {
//     0% { transform: translateX(-100%); }
//     100% { transform: translateX(100%); }
//   }
  
//   @keyframes heartbeat {
//     0%, 100% { transform: scale(1); }
//     25% { transform: scale(1.1); }
//     50% { transform: scale(1); }
//     75% { transform: scale(1.05); }
//   }
  
//   .quickCard:hover {
//     transform: translateY(-8px);
//     box-shadow: 0 25px 60px rgba(0,0,0,0.15);
//   }
  
//   .bankCard:hover {
//     transform: translateY(-4px);
//     border-color: #3498db;
//     box-shadow: 0 12px 30px rgba(52,152,219,0.2);
//   }
  
//   .urgentHelpBtn:hover {
//     background: rgba(255,255,255,0.3);
//     transform: translateY(-2px);
//   }
  
//   .headerButton:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 8px 25px rgba(0,0,0,0.15);
//   }
  
//   .notificationItem:hover, .dropdownItem:hover {
//     background: #f8f9fa;
//   }
  
//   .viewAllButton:hover {
//     background: #e9ecef;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default BloodPortal;





















































import React, { useState, useEffect } from "react";
import axios from "axios";

function BloodPortal() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyDonations, setShowMyDonations] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [bloodData, setBloodData] = useState({
    bloodBanks: [],
    urgentRequests: [],
    userStats: {
      acceptedDonations: 0,
      acceptedRequests: 0,
      livesSaved: 0,
      canDonate: true,
      pendingDonations: 0,
      pendingRequests: 0
    },
    myDonations: [],
    myRequests: [],
    notifications: []
  });

  useEffect(() => {
    initializeBloodPortal();
  }, []);

  const initializeBloodPortal = async () => {
    try {
      setLoading(true);
      
      const [banksRes, urgentRes, donationsRes, requestsRes] = await Promise.all([
        axios.get('http://localhost:1600/api/blood-bank/banks', { withCredentials: true }),
        axios.get('http://localhost:1600/api/blood-bank-user/blood/urgent-requests', { withCredentials: true }),
        axios.get('http://localhost:1600/api/blood-bank-user/donation-requests', { withCredentials: true }),
        axios.get('http://localhost:1600/api/blood-bank-user/blood-requests', { withCredentials: true })
      ]);

      const donations = donationsRes.data.donations || [];
      const requests = requestsRes.data.requests || [];
      
      const acceptedDonations = donations.filter(d => d.status === 'accepted').length;
      const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
      const pendingDonations = donations.filter(d => d.status === 'pending').length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;
      const livesSaved = acceptedDonations * 3;

      const notifications = [
        ...donations.slice(0, 3).map(d => ({
          id: `donation-${d._id}`,
          type: 'donation',
          title: `Donation ${d.status}`,
          message: `Your ${d.blood_group} blood donation has been ${d.status}`,
          time: new Date(d.requested_date).toLocaleDateString(),
          status: d.status
        })),
        ...requests.slice(0, 3).map(r => ({
          id: `request-${r._id}`,
          type: 'request',
          title: `Request ${r.status}`,
          message: `Your ${r.blood_group} blood request has been ${r.status}`,
          time: new Date(r.requested_date).toLocaleDateString(),
          status: r.status
        }))
      ].slice(0, 5);

      setBloodData({
        bloodBanks: banksRes.data.banks || banksRes.data || [],
        urgentRequests: urgentRes.data.urgent || [],
        userStats: {
          acceptedDonations,
          acceptedRequests,
          livesSaved,
          canDonate: true,
          pendingDonations,
          pendingRequests
        },
        myDonations: donations,
        myRequests: requests,
        notifications
      });

    } catch (error) {
      console.error('Failed to load Blood Portal:', error);
      setBloodData({
        bloodBanks: [],
        urgentRequests: [],
        userStats: {
          acceptedDonations: 0,
          acceptedRequests: 0,
          livesSaved: 0,
          canDonate: true,
          pendingDonations: 0,
          pendingRequests: 0
        },
        myDonations: [],
        myRequests: [],
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await initializeBloodPortal();
  };

  const handleDonationSubmit = async (donationData) => {
    try {
      console.log('Submitting donation data:', donationData);
      const response = await axios.post('http://localhost:1600/api/blood-bank-user/donation-request', donationData);

      if (response.data.message) {
        alert('🎉 ' + response.data.message);
        await refreshData();
      }
    } catch (error) {
      console.error('Donation submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit donation request');
    }
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      console.log('Submitting request data:', requestData);
      const response = await axios.post('http://localhost:1600/api/blood-bank-user/request-blood', requestData);

      if (response.data.message) {
        alert('🙏 ' + response.data.message);
        await refreshData();
      }
    } catch (error) {
      console.error('Request submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit blood request');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingIcon}>🩸</div>
          <div style={styles.loadingText}>Loading Blood Portal...</div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Enhanced Header with Notifications, My Donations, My Requests */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🩸</span>
            <span style={styles.logoText}>BloodBank Portal</span>
          </div>
          
          <div style={styles.headerActions}>
            {/* Notifications Dropdown */}
            <div style={styles.headerActionItem}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={styles.headerButton}
              >
                <span style={styles.headerButtonIcon}>🔔</span>
                <span style={styles.headerButtonText}>Notifications</span>
                {bloodData.notifications.length > 0 && (
                  <span style={styles.notificationBadge}>{bloodData.notifications.length}</span>
                )}
              </button>
              
              {showNotifications && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <h4>Recent Notifications</h4>
                  </div>
                  <div style={styles.dropdownContent}>
                    {bloodData.notifications.length === 0 ? (
                      <div style={styles.emptyDropdown}>
                        <span style={styles.emptyIcon}>🔔</span>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      bloodData.notifications.map(notification => (
                        <div key={notification.id} style={styles.notificationItem}>
                          <div style={styles.notificationIcon}>
                            {notification.type === 'donation' ? '🩸' : '🆘'}
                          </div>
                          <div style={styles.notificationContent}>
                            <h5 style={styles.notificationTitle}>{notification.title}</h5>
                            <p style={styles.notificationMessage}>{notification.message}</p>
                            <span style={styles.notificationTime}>{notification.time}</span>
                          </div>
                          <div style={{
                            ...styles.notificationStatus,
                            backgroundColor: notification.status === 'accepted' ? '#27ae60' : 
                                            notification.status === 'rejected' ? '#e74c3c' : '#f39c12'
                          }}>
                            {notification.status === 'accepted' ? '✅' :
                             notification.status === 'rejected' ? '❌' : '⏳'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Donations Dropdown */}
            <div style={styles.headerActionItem}>
              <button 
                onClick={() => setShowMyDonations(!showMyDonations)}
                style={styles.headerButton}
              >
                <span style={styles.headerButtonIcon}>🩸</span>
                <span style={styles.headerButtonText}>My Donations</span>
                <span style={styles.countBadge}>{bloodData.userStats.acceptedDonations}</span>
              </button>
              
              {showMyDonations && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <h4>My Donations ({bloodData.myDonations.length})</h4>
                    <div style={styles.statsRow}>
                      <span style={styles.statBadge}>✅ {bloodData.userStats.acceptedDonations} Accepted</span>
                      <span style={styles.statBadge}>⏳ {bloodData.userStats.pendingDonations} Pending</span>
                    </div>
                  </div>
                  <div style={styles.dropdownContent}>
                    {bloodData.myDonations.length === 0 ? (
                      <div style={styles.emptyDropdown}>
                        <span style={styles.emptyIcon}>🩸</span>
                        <p>No donations yet</p>
                        <button 
                          onClick={() => setActiveSection('donate')}
                          style={styles.emptyActionButton}
                        >
                          Make First Donation
                        </button>
                      </div>
                    ) : (
                      bloodData.myDonations.slice(0, 5).map(donation => (
                        <div key={donation._id} style={styles.dropdownItem}>
                          <div style={styles.itemLeft}>
                            <span style={styles.bloodTypeSmall}>{donation.blood_group}</span>
                            <span style={styles.itemUnits}>{donation.units_donated}u</span>
                          </div>
                          <div style={styles.itemCenter}>
                            <span style={styles.itemBank}>{donation.bank_id?.name || 'Blood Bank'}</span>
                            <span style={styles.itemDate}>{new Date(donation.requested_date).toLocaleDateString()}</span>
                          </div>
                          <div style={styles.itemRight}>
                            <span style={{
                              ...styles.itemStatus,
                              color: donation.status === 'accepted' ? '#27ae60' : 
                                     donation.status === 'rejected' ? '#e74c3c' : '#f39c12'
                            }}>
                              {donation.status === 'accepted' ? '✅' :
                               donation.status === 'rejected' ? '❌' : '⏳'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {bloodData.myDonations.length > 5 && (
                      <div style={styles.viewAllButton} onClick={() => setActiveSection('history')}>
                        View All Donations ({bloodData.myDonations.length})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Requests Dropdown */}
            <div style={styles.headerActionItem}>
              <button 
                onClick={() => setShowMyRequests(!showMyRequests)}
                style={styles.headerButton}
              >
                <span style={styles.headerButtonIcon}>🆘</span>
                <span style={styles.headerButtonText}>My Requests</span>
                <span style={styles.countBadge}>{bloodData.userStats.acceptedRequests}</span>
              </button>
              
              {showMyRequests && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <h4>My Requests ({bloodData.myRequests.length})</h4>
                    <div style={styles.statsRow}>
                      <span style={styles.statBadge}>✅ {bloodData.userStats.acceptedRequests} Fulfilled</span>
                      <span style={styles.statBadge}>⏳ {bloodData.userStats.pendingRequests} Pending</span>
                    </div>
                  </div>
                  <div style={styles.dropdownContent}>
                    {bloodData.myRequests.length === 0 ? (
                      <div style={styles.emptyDropdown}>
                        <span style={styles.emptyIcon}>🆘</span>
                        <p>No requests yet</p>
                        <button 
                          onClick={() => setActiveSection('request')}
                          style={styles.emptyActionButton}
                        >
                          Make First Request
                        </button>
                      </div>
                    ) : (
                      bloodData.myRequests.slice(0, 5).map(request => (
                        <div key={request._id} style={styles.dropdownItem}>
                          <div style={styles.itemLeft}>
                            <span style={styles.bloodTypeSmall}>{request.blood_group}</span>
                            <span style={styles.itemUnits}>{request.units_requested}u</span>
                          </div>
                          <div style={styles.itemCenter}>
                            <span style={styles.itemBank}>{request.bank_id?.name || 'Blood Bank'}</span>
                            <span style={styles.itemDate}>{new Date(request.requested_date).toLocaleDateString()}</span>
                          </div>
                          <div style={styles.itemRight}>
                            <span style={{
                              ...styles.itemStatus,
                              color: request.status === 'accepted' ? '#27ae60' : 
                                     request.status === 'rejected' ? '#e74c3c' : '#f39c12'
                            }}>
                              {request.status === 'accepted' ? '✅' :
                               request.status === 'rejected' ? '❌' : '⏳'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {bloodData.myRequests.length > 5 && (
                      <div style={styles.viewAllButton} onClick={() => setActiveSection('history')}>
                        View All Requests ({bloodData.myRequests.length})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div style={styles.quickStats}>
              <div style={styles.quickStat}>
                <span style={styles.quickStatNumber}>{bloodData.userStats.livesSaved}</span>
                <span style={styles.quickStatLabel}>Lives Saved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showMyDonations || showMyRequests) && (
        <div 
          style={styles.overlay} 
          onClick={() => {
            setShowNotifications(false);
            setShowMyDonations(false);
            setShowMyRequests(false);
          }}
        />
      )}

      {/* Enhanced Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>
              Save Lives Through <span style={styles.highlight}>Blood Donation</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Your contribution can save up to 3 lives. Join our community of life-savers!
            </p>
            <div style={styles.heroButtons}>
              <button 
                onClick={() => setActiveSection('donate')}
                style={styles.heroPrimaryButton}
              >
                🩸 Donate Now
              </button>
              <button 
                onClick={() => setActiveSection('request')}
                style={styles.heroSecondaryButton}
              >
                🆘 Request Blood
              </button>
            </div>
          </div>
          <div style={styles.heroRight}>
            <div style={styles.heroStatsCard}>
              <h3 style={styles.heroStatsTitle}>Your Impact</h3>
              <div style={styles.heroStatsList}>
                <div style={styles.heroStatItem}>
                  <span style={styles.heroStatIcon}>🩸</span>
                  <div>
                    <div style={styles.heroStatNumber}>{bloodData.userStats.acceptedDonations}</div>
                    <div style={styles.heroStatLabel}>Successful Donations</div>
                  </div>
                </div>
                <div style={styles.heroStatItem}>
                  <span style={styles.heroStatIcon}>🆘</span>
                  <div>
                    <div style={styles.heroStatNumber}>{bloodData.userStats.acceptedRequests}</div>
                    <div style={styles.heroStatLabel}>Fulfilled Requests</div>
                  </div>
                </div>
                <div style={styles.heroStatItem}>
                  <span style={styles.heroStatIcon}>❤️</span>
                  <div>
                    <div style={styles.heroStatNumber}>{bloodData.userStats.livesSaved}</div>
                    <div style={styles.heroStatLabel}>Lives Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          {[
            { id: "home", label: "Dashboard", icon: "🏠", color: "#3498db" },
            { id: "donate", label: "Donate Blood", icon: "🩸", color: "#e74c3c" },
            { id: "request", label: "Request Blood", icon: "🆘", color: "#f39c12" },
            { id: "history", label: "My History", icon: "📊", color: "#9b59b6" },
            { id: "urgent", label: "Urgent Needs", icon: "⚡", color: "#e67e22" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navButton,
                ...(activeSection === item.id ? {
                  ...styles.navButtonActive,
                  backgroundColor: item.color,
                  boxShadow: `0 8px 25px ${item.color}40`,
                  transform: 'translateY(-2px)'
                } : {})
              }}
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = `${item.color}20`;
                  e.target.style.borderColor = item.color;
                  e.target.style.color = item.color;
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.color = '#2c3e50';
                }
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content with better styling */}
      <div style={styles.content}>
        <div style={styles.contentWrapper}>
          {activeSection === "home" && (
            <HomeSection 
              urgentRequests={bloodData.urgentRequests} 
              bloodBanks={bloodData.bloodBanks}
              userStats={bloodData.userStats}
              setActiveSection={setActiveSection} 
            />
          )}
          {activeSection === "donate" && (
            <DonateSection 
              bloodBanks={bloodData.bloodBanks}
              userStats={bloodData.userStats}
              onSubmit={handleDonationSubmit} 
            />
          )}
          {activeSection === "request" && (
            <RequestSection 
              bloodBanks={bloodData.bloodBanks}
              userStats={bloodData.userStats}
              onSubmit={handleRequestSubmit} 
            />
          )}
          {activeSection === "history" && (
            <HistorySection 
              myDonations={bloodData.myDonations}
              myRequests={bloodData.myRequests}
              userStats={bloodData.userStats}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === "urgent" && (
            <UrgentSection urgentRequests={bloodData.urgentRequests} />
          )}
        </div>
      </div>
    </div>
  );
}

// HOME SECTION
function HomeSection({ urgentRequests, bloodBanks, userStats, setActiveSection }) {
  return (
    <div style={styles.section}>
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeContent}>
          <h2 style={styles.welcomeTitle}>Your Blood Bank Journey 🌟</h2>
          <p style={styles.welcomeText}>
            Track your life-saving contributions and make a real difference in your community!
          </p>
          
          <div style={styles.achievementShowcase}>
            <div style={styles.achievementItem}>
              <div style={styles.achievementNumber}>{userStats.acceptedDonations}</div>
              <div style={styles.achievementLabel}>Successful Donations</div>
              <div style={styles.achievementDesc}>Accepted by blood banks</div>
            </div>
            <div style={styles.achievementDivider}>→</div>
            <div style={styles.achievementItem}>
              <div style={styles.achievementNumber}>{userStats.livesSaved}</div>
              <div style={styles.achievementLabel}>Lives Saved</div>
              <div style={styles.achievementDesc}>Through your donations</div>
            </div>
            <div style={styles.achievementDivider}>→</div>
            <div style={styles.achievementItem}>
              <div style={styles.achievementNumber}>{userStats.acceptedRequests}</div>
              <div style={styles.achievementLabel}>Requests Fulfilled</div>
              <div style={styles.achievementDesc}>When you needed help</div>
            </div>
          </div>

          {(userStats.pendingDonations > 0 || userStats.pendingRequests > 0) && (
            <div style={styles.pendingAlert}>
              <span style={styles.pendingIcon}>⏳</span>
              <div style={styles.pendingText}>
                {userStats.pendingDonations > 0 && (
                  <span>{userStats.pendingDonations} donation{userStats.pendingDonations > 1 ? 's' : ''} pending approval</span>
                )}
                {userStats.pendingDonations > 0 && userStats.pendingRequests > 0 && <span> • </span>}
                {userStats.pendingRequests > 0 && (
                  <span>{userStats.pendingRequests} request{userStats.pendingRequests > 1 ? 's' : ''} pending approval</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div style={styles.quickActionCards}>
        <div 
          onClick={() => setActiveSection('donate')}
          style={{...styles.quickCard, ...styles.donateCard}}
        >
          <div style={styles.quickCardIcon}>🩸</div>
          <h3 style={styles.quickCardTitle}>Donate Blood</h3>
          <p style={styles.quickCardDesc}>Save up to 3 lives with one donation</p>
          <div style={styles.quickCardArrow}>→</div>
        </div>
        
        <div 
          onClick={() => setActiveSection('request')}
          style={{...styles.quickCard, ...styles.requestCard}}
        >
          <div style={styles.quickCardIcon}>🆘</div>
          <h3 style={styles.quickCardTitle}>Request Blood</h3>
          <p style={styles.quickCardDesc}>Get help when you need it most</p>
          <div style={styles.quickCardArrow}>→</div>
        </div>
        
        <div 
          onClick={() => setActiveSection('urgent')}
          style={{...styles.quickCard, ...styles.urgentCard}}
        >
          <div style={styles.quickCardIcon}>⚡</div>
          <h3 style={styles.quickCardTitle}>Urgent Needs</h3>
          <p style={styles.quickCardDesc}>Help someone in critical need</p>
          <div style={styles.quickCardArrow}>→</div>
        </div>
      </div>

      {/* Available Blood Banks */}
      {bloodBanks.length > 0 && (
        <div style={styles.bloodBanksSection}>
          <h3 style={styles.sectionSubtitle}>🏥 Available Blood Banks ({bloodBanks.length})</h3>
          <div style={styles.bloodBanksCarousel}>
            {bloodBanks.slice(0, 6).map(bank => (
              <div key={bank._id} style={styles.bankCard}>
                <div style={styles.bankCardIcon}>🏥</div>
                <h4 style={styles.bankCardName}>{bank.name}</h4>
                <p style={styles.bankCardLocation}>📍 {bank.location || bank.address}</p>
                {bank.phone && (
                  <p style={styles.bankCardContact}>📞 {bank.phone}</p>
                )}
              </div>
            ))}
          </div>
          {bloodBanks.length > 6 && (
            <div style={styles.showMoreBanks}>
              <span>And {bloodBanks.length - 6} more blood banks available...</span>
            </div>
          )}
        </div>
      )}

      {/* Urgent Requests Preview */}
      {urgentRequests.length > 0 && (
        <div style={styles.urgentSection}>
          <h3 style={styles.urgentSectionTitle}>🚨 Critical Blood Needs</h3>
          <div style={styles.urgentCarousel}>
            {urgentRequests.slice(0, 3).map(request => (
              <div key={request._id} style={styles.urgentPreviewCard}>
                <div style={styles.urgentCardTop}>
                  <span style={styles.urgentBloodTypeBig}>{request.blood_group}</span>
                  <span style={styles.urgentPriorityBadge}>
                    {request.urgency === 'critical' ? '🔴 CRITICAL' : '🟠 URGENT'}
                  </span>
                </div>
                <div style={styles.urgentCardDetails}>
                  <p>📍 {request.location}</p>
                  <p>🩸 {request.units_requested} units needed</p>
                  <p>⏰ {request.timeAgo}</p>
                </div>
                <button style={styles.urgentHelpBtn}>💪 Help Now</button>
              </div>
            ))}
          </div>
          <div style={styles.viewAllUrgent} onClick={() => setActiveSection('urgent')}>
            View All Urgent Requests ({urgentRequests.length})
          </div>
        </div>
      )}
    </div>
  );
}

// DONATE SECTION
function DonateSection({ bloodBanks, userStats, onSubmit }) {
  const [donationForm, setDonationForm] = useState({
    bankId: "",
    units: 1,
    blood_group: "",
    requestedDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donationForm.bankId || !donationForm.blood_group || !donationForm.requestedDate) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(donationForm);
      setDonationForm({ 
        bankId: "",
        units: 1,
        blood_group: "",
        requestedDate: new Date().toISOString().split('T')[0]
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>🩸 Donate Blood</h2>
          <p style={styles.formSubtitle}>Your donation can save up to 3 lives!</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Blood Group *</label>
              <select
                value={donationForm.blood_group}
                onChange={(e) => setDonationForm({...donationForm, blood_group: e.target.value})}
                style={styles.input}
                required
                disabled={submitting}
              >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Units to Donate *</label>
              <select
                value={donationForm.units}
                onChange={(e) => setDonationForm({...donationForm, units: parseInt(e.target.value)})}
                style={styles.input}
                required
                disabled={submitting}
              >
                <option value={1}>1 Unit (450ml)</option>
                <option value={2}>2 Units (900ml)</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Blood Bank * ({bloodBanks?.length || 0} available)</label>
            <select
              value={donationForm.bankId}
              onChange={(e) => setDonationForm({...donationForm, bankId: e.target.value})}
              style={styles.input}
              required
              disabled={submitting}
            >
              <option value="">Choose a blood bank</option>
              {bloodBanks && bloodBanks.map(bank => (
                <option key={bank._id} value={bank._id}>
                  🏥 {bank.name || 'Blood Bank'} - {bank.location || bank.address || 'Location not specified'}
                  {bank.phone ? ` (${bank.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Requested Date *</label>
            <input
              type="date"
              value={donationForm.requestedDate}
              onChange={(e) => setDonationForm({...donationForm, requestedDate: e.target.value})}
              style={styles.input}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={submitting}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              opacity: (submitting || !bloodBanks || bloodBanks.length === 0) ? 0.7 : 1,
              cursor: (submitting || !bloodBanks || bloodBanks.length === 0) ? "not-allowed" : "pointer"
            }}
            disabled={submitting || !bloodBanks || bloodBanks.length === 0}
          >
            {submitting ? "Submitting..." : "🩸 Submit Donation Request"}
          </button>
        </form>

        <div style={styles.benefits}>
          <h3 style={styles.benefitsTitle}>Why Donate Blood?</h3>
          <div style={styles.benefitsList}>
            <div style={styles.benefitItem}>💪 Improves your health</div>
            <div style={styles.benefitItem}>❤️ Saves up to 3 lives</div>
            <div style={styles.benefitItem}>🏆 Builds community</div>
            <div style={styles.benefitItem}>😊 Gives satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// REQUEST SECTION
function RequestSection({ bloodBanks, userStats, onSubmit }) {
  const [requestForm, setRequestForm] = useState({
    bankId: "",
    units: 1,
    blood_group: "",
    requestedDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestForm.bankId || !requestForm.blood_group || !requestForm.requestedDate) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(requestForm);
      setRequestForm({ 
        bankId: "",
        units: 1,
        blood_group: "",
        requestedDate: new Date().toISOString().split('T')[0]
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>🆘 Request Blood</h2>
          <p style={styles.formSubtitle}>Get the help you need from our community</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Blood Group Needed *</label>
              <select
                value={requestForm.blood_group}
                onChange={(e) => setRequestForm({...requestForm, blood_group: e.target.value})}
                style={styles.input}
                required
                disabled={submitting}
              >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Units Needed *</label>
              <select
                value={requestForm.units}
                onChange={(e) => setRequestForm({...requestForm, units: parseInt(e.target.value)})}
                style={styles.input}
                required
                disabled={submitting}
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} Unit{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Blood Bank * ({bloodBanks?.length || 0} available)</label>
            <select
              value={requestForm.bankId}
              onChange={(e) => setRequestForm({...requestForm, bankId: e.target.value})}
              style={styles.input}
              required
              disabled={submitting}
            >
              <option value="">Choose a blood bank</option>
              {bloodBanks && bloodBanks.map(bank => (
                <option key={bank._id} value={bank._id}>
                  🏥 {bank.name || 'Blood Bank'} - {bank.location || bank.address || 'Location not specified'}
                  {bank.phone ? ` (${bank.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Needed By Date *</label>
            <input
              type="date"
              value={requestForm.requestedDate}
              onChange={(e) => setRequestForm({...requestForm, requestedDate: e.target.value})}
              style={styles.input}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={submitting}
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...styles.requestSubmitButton,
              opacity: (submitting || !bloodBanks || bloodBanks.length === 0) ? 0.7 : 1,
              cursor: (submitting || !bloodBanks || bloodBanks.length === 0) ? "not-allowed" : "pointer"
            }}
            disabled={submitting || !bloodBanks || bloodBanks.length === 0}
          >
            {submitting ? "Submitting..." : "🆘 Submit Blood Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

// HISTORY SECTION
function HistorySection({ myDonations, myRequests, userStats, setActiveSection }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return '#27ae60';
      case 'rejected': return '#e74c3c'; 
      case 'pending': return '#f39c12';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted': return '✅';
      case 'rejected': return '❌'; 
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.historyHeader}>
        <h2 style={styles.sectionTitle}>📊 Your Achievement History</h2>
        <div style={styles.historySummary}>
          <div style={styles.historyStat}>
            <span style={styles.historyStatNumber}>{userStats?.acceptedDonations || 0}</span>
            <span style={styles.historyStatLabel}>Successful Donations</span>
          </div>
          <div style={styles.historyStat}>
            <span style={styles.historyStatNumber}>{userStats?.acceptedRequests || 0}</span>
            <span style={styles.historyStatLabel}>Fulfilled Requests</span>
          </div>
          <div style={styles.historyStat}>
            <span style={styles.historyStatNumber}>{userStats?.livesSaved || 0}</span>
            <span style={styles.historyStatLabel}>Lives Saved</span>
          </div>
        </div>
      </div>

      {/* Donations History */}
      <div style={styles.historyCard}>
        <h3 style={styles.historyTitle}>🩸 My Donations ({myDonations?.length || 0})</h3>
        {!myDonations || myDonations.length === 0 ? (
          <div style={styles.emptyHistory}>
            <div style={styles.emptyIcon}>🩸</div>
            <p>No donations yet. Start saving lives today!</p>
            <button 
              onClick={() => setActiveSection('donate')}
              style={styles.emptyActionButton}
            >
              Make Your First Donation
            </button>
          </div>
        ) : (
          <div style={styles.historyList}>
            {myDonations.map(donation => (
              <div key={donation._id || Math.random()} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <span style={styles.historyBloodType}>{donation.blood_group || 'Unknown'}</span>
                  <span style={styles.historyUnits}>{donation.units_donated || 0} Unit{(donation.units_donated || 0) > 1 ? 's' : ''}</span>
                </div>
                <div style={styles.historyCenter}>
                  <span style={styles.historyDate}>{donation.requested_date ? new Date(donation.requested_date).toLocaleDateString() : 'Unknown'}</span>
                  <span style={styles.historyBank}>{donation.bank_id?.name || 'Blood Bank'}</span>
                </div>
                <div style={styles.historyRight}>
                  <span style={{...styles.historyStatus, color: getStatusColor(donation.status)}}>
                    {getStatusIcon(donation.status)} {(donation.status || 'unknown').toUpperCase()}
                  </span>
                  {donation.status === 'accepted' && (
                    <span style={styles.livesSavedBadge}>+{(donation.units_donated || 1) * 3} lives saved!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requests History */}
      <div style={styles.historyCard}>
        <h3 style={styles.historyTitle}>🆘 My Requests ({myRequests?.length || 0})</h3>
        {!myRequests || myRequests.length === 0 ? (
          <div style={styles.emptyHistory}>
            <div style={styles.emptyIcon}>🆘</div>
            <p>No blood requests yet.</p>
          </div>
        ) : (
          <div style={styles.historyList}>
            {myRequests.map(request => (
              <div key={request._id || Math.random()} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <span style={styles.historyBloodType}>{request.blood_group || 'Unknown'}</span>
                  <span style={styles.historyUnits}>{request.units_requested || 0} Unit{(request.units_requested || 0) > 1 ? 's' : ''}</span>
                </div>
                <div style={styles.historyCenter}>
                  <span style={styles.historyDate}>{request.requested_date ? new Date(request.requested_date).toLocaleDateString() : 'Unknown'}</span>
                  <span style={styles.historyBank}>{request.bank_id?.name || 'Blood Bank'}</span>
                </div>
                <div style={styles.historyRight}>
                  <span style={{...styles.historyStatus, color: getStatusColor(request.status)}}>
                    {getStatusIcon(request.status)} {(request.status || 'unknown').toUpperCase()}
                  </span>
                  {request.status === 'accepted' && (
                    <span style={styles.fulfilledBadge}>✅ Request fulfilled!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// URGENT SECTION
function UrgentSection({ urgentRequests }) {
  return (
    <div style={styles.section}>
      <div style={styles.urgentHeader}>
        <h2 style={styles.sectionTitle}>⚡ Urgent Blood Needs</h2>
        <p style={styles.urgentSubtitle}>Someone needs your help right now!</p>
      </div>

      {!urgentRequests || urgentRequests.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎉</div>
          <h3>Great News!</h3>
          <p>No urgent requests right now. Everyone is safe!</p>
        </div>
      ) : (
        <div style={styles.urgentGrid}>
          {urgentRequests.map(request => (
            <div key={request._id || Math.random()} style={styles.urgentCard}>
              <div style={styles.urgentCardHeader}>
                <span style={styles.urgentBloodTypeLarge}>{request.blood_group || 'Unknown'}</span>
                <span style={styles.urgentPriority}>
                  {request.urgency === 'critical' ? '🔴 CRITICAL' : '🟠 HIGH PRIORITY'}
                </span>
              </div>
              
              <div style={styles.urgentCardBody}>
                <p><strong>📍 Location:</strong> {request.location || 'Unknown location'}</p>
                <p><strong>🩸 Units Needed:</strong> {request.units_requested || 0}</p>
                <p><strong>⏰ Posted:</strong> {request.timeAgo || 'Recently'}</p>
                {request.patient_condition && (
                  <p><strong>🏥 Condition:</strong> {request.patient_condition}</p>
                )}
              </div>
              
              <div style={styles.urgentCardFooter}>
                <button style={styles.urgentHelpButton}>
                  💪 I Can Help!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// FIXED STYLES OBJECT - ALL BACKGROUND CONFLICTS RESOLVED
const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    position: "relative"
  },

  // Loading Screen
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  loadingContent: {
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: "3rem",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)"
  },
  loadingIcon: {
    fontSize: "5rem",
    marginBottom: "1.5rem",
    animation: "pulse 2s infinite"
  },
  loadingText: {
    fontSize: "1.8rem",
    color: "#2c3e50",
    fontWeight: "700",
    marginBottom: "1.5rem"
  },
  progressBar: {
    width: "200px",
    height: "4px",
    backgroundColor: "#ecf0f1",
    borderRadius: "2px",
    overflow: "hidden",
    margin: "0 auto"
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(90deg, #e74c3c, #f39c12)",
    animation: "slideIn 2s ease-in-out infinite"
  },

  // Header
  header: {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  logoIcon: {
    fontSize: "2.5rem",
    animation: "heartbeat 2s ease-in-out infinite"
  },
  logoText: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#2c3e50",
    backgroundImage: "linear-gradient(45deg, #e74c3c, #f39c12)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  headerActionItem: {
    position: "relative"
  },
  headerButton: {
    backgroundColor: "white",
    border: "2px solid #ecf0f1",
    borderRadius: "15px",
    padding: "0.8rem 1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    position: "relative"
  },
  headerButtonIcon: {
    fontSize: "1.3rem"
  },
  headerButtonText: {
    fontWeight: "600",
    color: "#2c3e50"
  },
  notificationBadge: {
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: "bold",
    position: "absolute",
    top: "-5px",
    right: "-5px"
  },
  countBadge: {
    backgroundColor: "#27ae60",
    color: "white",
    borderRadius: "12px",
    padding: "0.2rem 0.5rem",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  quickStats: {
    backgroundImage: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    borderRadius: "15px",
    padding: "1rem 1.5rem",
    color: "white"
  },
  quickStat: {
    textAlign: "center"
  },
  quickStatNumber: {
    display: "block",
    fontSize: "1.8rem",
    fontWeight: "bold"
  },
  quickStatLabel: {
    fontSize: "0.8rem",
    opacity: 0.9
  },

  // Dropdown Menus
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    width: "400px",
    maxHeight: "500px",
    overflow: "hidden",
    zIndex: 1001,
    marginTop: "0.5rem",
    border: "1px solid rgba(0,0,0,0.1)"
  },
  dropdownHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #ecf0f1",
    backgroundImage: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
  },
  dropdownContent: {
    maxHeight: "400px",
    overflowY: "auto"
  },
  statsRow: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem"
  },
  statBadge: {
    backgroundColor: "#ecf0f1",
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#2c3e50"
  },
  emptyDropdown: {
    textAlign: "center",
    padding: "3rem 2rem",
    color: "#7f8c8d"
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "1rem"
  },
  emptyActionButton: {
    backgroundImage: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    color: "white",
    border: "none",
    padding: "0.8rem 1.5rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "1rem"
  },
  notificationItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "1rem",
    borderBottom: "1px solid #f8f9fa",
    transition: "background-color 0.2s ease"
  },
  notificationIcon: {
    fontSize: "1.5rem",
    minWidth: "30px"
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    margin: "0 0 0.3rem 0",
    color: "#2c3e50",
    fontSize: "0.9rem",
    fontWeight: "600"
  },
  notificationMessage: {
    margin: "0 0 0.3rem 0",
    color: "#7f8c8d",
    fontSize: "0.8rem",
    lineHeight: 1.4
  },
  notificationTime: {
    fontSize: "0.7rem",
    color: "#bdc3c7"
  },
  notificationStatus: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    color: "white"
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.8rem 1rem",
    borderBottom: "1px solid #f8f9fa",
    transition: "background-color 0.2s ease"
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  bloodTypeSmall: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "0.3rem 0.6rem",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  itemUnits: {
    color: "#2c3e50",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  itemCenter: {
    flex: 1,
    textAlign: "center"
  },
  itemBank: {
    display: "block",
    color: "#2c3e50",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  itemDate: {
    display: "block",
    color: "#7f8c8d",
    fontSize: "0.7rem"
  },
  itemRight: {
    minWidth: "30px",
    textAlign: "center"
  },
  itemStatus: {
    fontSize: "1.2rem"
  },
  viewAllButton: {
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    borderTop: "1px solid #ecf0f1"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999
  },

  // Hero Section
  hero: {
    backgroundImage: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    color: "white",
    padding: "4rem 2rem",
    position: "relative",
    overflow: "hidden"
  },
  heroContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "4rem"
  },
  heroLeft: {
    flex: 1
  },
  heroTitle: {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "1.5rem",
    lineHeight: 1.2
  },
  highlight: {
    backgroundImage: "linear-gradient(45deg, #e74c3c, #f39c12)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  heroSubtitle: {
    fontSize: "1.3rem",
    opacity: 0.9,
    marginBottom: "2.5rem",
    lineHeight: 1.6
  },
  heroButtons: {
    display: "flex",
    gap: "1rem"
  },
  heroPrimaryButton: {
    backgroundImage: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    color: "white",
    border: "none",
    padding: "1.2rem 2.5rem",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(231,76,60,0.3)"
  },
  heroSecondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "1.2rem 2.5rem",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  heroRight: {
    flex: 1
  },
  heroStatsCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "2rem",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  heroStatsTitle: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    fontWeight: "700",
    textAlign: "center"
  },
  heroStatsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  heroStatItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "1rem",
    borderRadius: "12px"
  },
  heroStatIcon: {
    fontSize: "2rem",
    minWidth: "50px"
  },
  heroStatNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#ffeaa7"
  },
  heroStatLabel: {
    fontSize: "0.9rem",
    opacity: 0.9
  },

  // Navigation
  nav: {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  navContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap"
  },
  navButton: {
    backgroundColor: "white",
    border: "2px solid #ecf0f1",
    borderRadius: "20px",
    padding: "1.2rem 2rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2c3e50",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    minWidth: "160px",
    justifyContent: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
  },
  navButtonActive: {
    color: "white",
    transform: "translateY(-2px)"
  },
  navIcon: {
    fontSize: "1.4rem"
  },
  navLabel: {
    fontSize: "0.95rem"
  },

  // Content Area
  content: {
    padding: "3rem 2rem"
  },
  contentWrapper: {
    maxWidth: "1400px",
    margin: "0 auto"
  },
  section: {
    marginBottom: "3rem"
  },
  sectionTitle: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "2rem",
    fontWeight: "700",
    textAlign: "center"
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: "3rem",
    marginBottom: "3rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)"
  },
  welcomeContent: {
    textAlign: "center"
  },
  welcomeTitle: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    fontWeight: "800"
  },
  welcomeText: {
    fontSize: "1.2rem",
    color: "#7f8c8d",
    marginBottom: "3rem",
    lineHeight: 1.6
  },
  achievementShowcase: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap"
  },
  achievementItem: {
    textAlign: "center",
    padding: "1.5rem",
    backgroundImage: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    borderRadius: "15px",
    minWidth: "150px"
  },
  achievementNumber: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: "0.5rem"
  },
  achievementLabel: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "0.3rem"
  },
  achievementDesc: {
    fontSize: "0.8rem",
    color: "#7f8c8d"
  },
  achievementDivider: {
    fontSize: "2rem",
    color: "#bdc3c7",
    fontWeight: "bold"
  },
  pendingAlert: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeaa7",
    borderRadius: "12px",
    padding: "1rem",
    marginTop: "2rem"
  },
  pendingIcon: {
    fontSize: "1.5rem"
  },
  pendingText: {
    color: "#856404",
    fontWeight: "600"
  },

  // Quick Action Cards
  quickActionCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem"
  },
  quickCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden"
  },
  donateCard: {
    backgroundImage: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  },
  requestCard: {
    backgroundImage: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },

  quickCardIcon: {
    fontSize: "3.5rem",
    marginBottom: "1rem"
  },
  quickCardTitle: {
    color: "#2c3e50",
    marginBottom: "0.8rem",
    fontSize: "1.4rem",
    fontWeight: "700"
  },
  quickCardDesc: {
    color: "#5a6c7d",
    marginBottom: "1.5rem",
    lineHeight: 1.5
  },
  quickCardArrow: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    fontWeight: "bold",
    position: "absolute",
    bottom: "1.5rem",
    right: "1.5rem"
  },

  // Blood Banks Section
  bloodBanksSection: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "3rem",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
  },
  sectionSubtitle: {
    fontSize: "1.8rem",
    color: "#2c3e50",
    marginBottom: "2rem",
    fontWeight: "700",
    textAlign: "center"
  },
  bloodBanksCarousel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1rem"
  },
  bankCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: "15px",
    padding: "1.5rem",
    textAlign: "center",
    border: "2px solid #ecf0f1",
    transition: "all 0.3s ease"
  },
  bankCardIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem"
  },
  bankCardName: {
    color: "#2c3e50",
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  bankCardLocation: {
    color: "#7f8c8d",
    marginBottom: "0.3rem",
    fontSize: "0.9rem"
  },
  bankCardContact: {
    color: "#27ae60",
    fontSize: "0.9rem",
    fontWeight: "600"
  },
  showMoreBanks: {
    textAlign: "center",
    color: "#7f8c8d",
    fontStyle: "italic"
  },

  // Form Styles
  formCard: {
    backgroundColor: "white",
    padding: "3rem",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    margin: "0 auto"
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  formTitle: {
    color: "#2c3e50",
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    fontWeight: "bold"
  },
  formSubtitle: {
    color: "#7f8c8d",
    fontSize: "1.2rem",
    lineHeight: 1.6
  },
  form: {
    marginBottom: "2rem"
  },
  formRow: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem"
  },
  formGroup: {
    flex: 1,
    marginBottom: "2rem"
  },
  label: {
    display: "block",
    marginBottom: "0.8rem",
    color: "#2c3e50",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  input: {
    width: "100%",
    padding: "1.2rem",
    border: "2px solid #ecf0f1",
    borderRadius: "12px",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "#fafbfc"
  },
  submitButton: {
    backgroundImage: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    color: "white",
    border: "none",
    padding: "1.5rem 2rem",
    borderRadius: "30px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "100%",
    boxShadow: "0 10px 30px rgba(231,76,60,0.3)"
  },
  requestSubmitButton: {
    backgroundImage: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
    boxShadow: "0 10px 30px rgba(243,156,18,0.3)"
  },

  // Benefits
  benefits: {
    textAlign: "center"
  },
  benefitsTitle: {
    color: "#2c3e50",
    marginBottom: "2rem",
    fontSize: "1.8rem",
    fontWeight: "bold"
  },
  benefitsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem"
  },
  benefitItem: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "15px",
    fontSize: "1rem",
    color: "#2c3e50",
    fontWeight: "600",
    border: "2px solid #ecf0f1",
    transition: "all 0.3s ease"
  },

  // History Section
  historyHeader: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  historySummary: {
    display: "flex",
    justifyContent: "center",
    gap: "3rem",
    marginTop: "2rem",
    flexWrap: "wrap"
  },
  historyStat: {
    textAlign: "center"
  },
  historyStatNumber: {
    display: "block",
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#e74c3c"
  },
  historyStatLabel: {
    color: "#7f8c8d",
    fontSize: "1rem",
    fontWeight: "600"
  },
  historyCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    marginBottom: "2rem"
  },
  historyTitle: {
    color: "#2c3e50",
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    fontWeight: "bold"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "2px solid #ecf0f1"
  },
  historyLeft: {
    display: "flex",
    gap: "1rem",
    alignItems: "center"
  },
  historyBloodType: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1rem"
  },
  historyUnits: {
    color: "#2c3e50",
    fontWeight: "600"
  },
  historyCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  historyDate: {
    color: "#2c3e50",
    fontWeight: "600"
  },
  historyBank: {
    color: "#7f8c8d",
    fontSize: "0.9rem"
  },
  historyRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem"
  },
  historyStatus: {
    fontWeight: "bold",
    fontSize: "1rem"
  },
  livesSavedBadge: {
    backgroundColor: "#27ae60",
    color: "white",
    padding: "0.3rem 0.8rem",
    borderRadius: "15px",
    fontSize: "0.8rem"
  },
  fulfilledBadge: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "0.3rem 0.8rem",
    borderRadius: "15px",
    fontSize: "0.8rem"
  },
  emptyHistory: {
    textAlign: "center",
    padding: "3rem",
    color: "#7f8c8d"
  },

  // Urgent Section
  urgentSection: {
    backgroundImage: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
    borderRadius: "20px",
    padding: "2rem",
    color: "white",
    boxShadow: "0 20px 60px rgba(255,107,107,0.3)"
  },
  urgentSectionTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center"
  },
  urgentCarousel: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem"
  },
  urgentPreviewCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "15px",
    padding: "1.5rem",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  urgentCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  urgentBloodTypeBig: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.8rem 1.2rem",
    borderRadius: "20px",
    fontSize: "1.3rem",
    fontWeight: "bold"
  },
  urgentPriorityBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  urgentCardDetails: {
    marginBottom: "1.5rem",
    lineHeight: 1.8
  },
  urgentHelpBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: "0.8rem 1.5rem",
    borderRadius: "20px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  },
  viewAllUrgent: {
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    backdropFilter: "blur(10px)"
  },
  urgentHeader: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  urgentSubtitle: {
    color: "#e74c3c",
    fontSize: "1.3rem",
    fontWeight: "600"
  },
  urgentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem"
  },
  urgentCard: {
    backgroundImage: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    border: "3px solid #e74c3c",
    transition: "transform 0.3s ease"
  },
  urgentCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem"
  },
  urgentBloodTypeLarge: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "1rem 2rem",
    borderRadius: "25px",
    fontSize: "1.8rem",
    fontWeight: "bold"
  },
  urgentPriority: {
    backgroundColor: "#ff4757",
    color: "white",
    padding: "0.8rem 1.5rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "bold"
  },
  urgentCardBody: {
    marginBottom: "2rem",
    lineHeight: 2
  },
  urgentCardFooter: {
    textAlign: "center"
  },
  urgentHelpButton: {
    backgroundImage: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    boxShadow: "0 8px 25px rgba(39,174,96,0.3)"
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "#7f8c8d"
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes slideIn {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1); }
    50% { transform: scale(1); }
    75% { transform: scale(1.05); }
  }
  
  .quickCard:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 60px rgba(0,0,0,0.15);
  }
  
  .bankCard:hover {
    transform: translateY(-4px);
    border-color: #3498db;
    box-shadow: 0 12px 30px rgba(52,152,219,0.2);
  }
  
  .urgentHelpBtn:hover {
    background-color: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
  
  .headerButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .notificationItem:hover, .dropdownItem:hover {
    background-color: #f8f9fa;
  }
  
  .viewAllButton:hover {
    background-color: #e9ecef;
  }
`;
document.head.appendChild(styleSheet);

export default BloodPortal;

