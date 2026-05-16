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
//         axios.get('/api/blood-bank/banks', { withCredentials: true }),
//         axios.get('/api/blood-bank-user/blood/urgent-requests', { withCredentials: true }),
//         axios.get('/api/blood-bank-user/donation-requests', { withCredentials: true }),
//         axios.get('/api/blood-bank-user/blood-requests', { withCredentials: true })
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
//       const response = await axios.post('/api/blood-bank-user/donation-request', donationData);

//       if (response.data.message) {
//         alert(' ' + response.data.message);
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
//       const response = await axios.post('/api/blood-bank-user/request-blood', requestData);

//       if (response.data.message) {
//         alert(' ' + response.data.message);
//         await refreshData();
//       }
//     } catch (error) {
//       console.error('Request submission failed:', error);
//       alert(error.response?.data?.message || 'Failed to submit blood request');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bu-loadingContainer">
//         <div className="bu-loadingContent">
//           <div className="bu-loadingIcon"></div>
//           <div className="bu-loadingText">Loading Blood Portal...</div>
//           <div className="bu-progressBar">
//             <div className="bu-progressFill"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bu-container">
//       {/* Enhanced Header with Notifications, My Donations, My Requests */}
//       <header className="bu-header">
//         <div className="bu-headerContent">
//           <div className="bu-logo">
//             <span className="bu-logoIcon"></span>
//             <span className="bu-logoText">BloodBank Portal</span>
//           </div>

//           <div className="bu-headerActions">
//             {/* Notifications Dropdown */}
//             <div className="bu-headerActionItem">
//               <button 
//                 onClick={() => setShowNotifications(!showNotifications)}
//                 className="bu-headerButton"
//               >
//                 <span className="bu-headerButtonIcon"></span>
//                 <span className="bu-headerButtonText">Notifications</span>
//                 {bloodData.notifications.length > 0 && (
//                   <span className="bu-notificationBadge">{bloodData.notifications.length}</span>
//                 )}
//               </button>

//               {showNotifications && (
//                 <div className="bu-dropdown">
//                   <div className="bu-dropdownHeader">
//                     <h4>Recent Notifications</h4>
//                   </div>
//                   <div className="bu-dropdownContent">
//                     {bloodData.notifications.length === 0 ? (
//                       <div className="bu-emptyDropdown">
//                         <span className="bu-emptyIcon"></span>
//                         <p>No notifications yet</p>
//                       </div>
//                     ) : (
//                       bloodData.notifications.map(notification => (
//                         <div key={notification.id} className="bu-notificationItem">
//                           <div className="bu-notificationIcon">
//                             {notification.type === 'donation' ? '' : ''}
//                           </div>
//                           <div className="bu-notificationContent">
//                             <h5 className="bu-notificationTitle">{notification.title}</h5>
//                             <p className="bu-notificationMessage">{notification.message}</p>
//                             <span className="bu-notificationTime">{notification.time}</span>
//                           </div>
//                           <div style={{
//                             ...styles.notificationStatus,
//                             backgroundColor: notification.status === 'accepted' ? '#27ae60' : 
//                                             notification.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                           }}>
//                             {notification.status === 'accepted' ? '' :
//                              notification.status === 'rejected' ? '' : ''}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* My Donations Dropdown */}
//             <div className="bu-headerActionItem">
//               <button 
//                 onClick={() => setShowMyDonations(!showMyDonations)}
//                 className="bu-headerButton"
//               >
//                 <span className="bu-headerButtonIcon"></span>
//                 <span className="bu-headerButtonText">My Donations</span>
//                 <span className="bu-countBadge">{bloodData.userStats.acceptedDonations}</span>
//               </button>

//               {showMyDonations && (
//                 <div className="bu-dropdown">
//                   <div className="bu-dropdownHeader">
//                     <h4>My Donations ({bloodData.myDonations.length})</h4>
//                     <div className="bu-statsRow">
//                       <span className="bu-statBadge"> {bloodData.userStats.acceptedDonations} Accepted</span>
//                       <span className="bu-statBadge"> {bloodData.userStats.pendingDonations} Pending</span>
//                     </div>
//                   </div>
//                   <div className="bu-dropdownContent">
//                     {bloodData.myDonations.length === 0 ? (
//                       <div className="bu-emptyDropdown">
//                         <span className="bu-emptyIcon"></span>
//                         <p>No donations yet</p>
//                         <button 
//                           onClick={() => setActiveSection('donate')}
//                           className="bu-emptyActionButton"
//                         >
//                           Make First Donation
//                         </button>
//                       </div>
//                     ) : (
//                       bloodData.myDonations.slice(0, 5).map(donation => (
//                         <div key={donation._id} className="bu-dropdownItem">
//                           <div className="bu-itemLeft">
//                             <span className="bu-bloodTypeSmall">{donation.blood_group}</span>
//                             <span className="bu-itemUnits">{donation.units_donated}u</span>
//                           </div>
//                           <div className="bu-itemCenter">
//                             <span className="bu-itemBank">{donation.bank_id?.name || 'Blood Bank'}</span>
//                             <span className="bu-itemDate">{new Date(donation.requested_date).toLocaleDateString()}</span>
//                           </div>
//                           <div className="bu-itemRight">
//                             <span style={{
//                               ...styles.itemStatus,
//                               color: donation.status === 'accepted' ? '#27ae60' : 
//                                      donation.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                             }}>
//                               {donation.status === 'accepted' ? '' :
//                                donation.status === 'rejected' ? '' : ''}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                     {bloodData.myDonations.length > 5 && (
//                       <div className="bu-viewAllButton" onClick={() => setActiveSection('history')}>
//                         View All Donations ({bloodData.myDonations.length})
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* My Requests Dropdown */}
//             <div className="bu-headerActionItem">
//               <button 
//                 onClick={() => setShowMyRequests(!showMyRequests)}
//                 className="bu-headerButton"
//               >
//                 <span className="bu-headerButtonIcon"></span>
//                 <span className="bu-headerButtonText">My Requests</span>
//                 <span className="bu-countBadge">{bloodData.userStats.acceptedRequests}</span>
//               </button>

//               {showMyRequests && (
//                 <div className="bu-dropdown">
//                   <div className="bu-dropdownHeader">
//                     <h4>My Requests ({bloodData.myRequests.length})</h4>
//                     <div className="bu-statsRow">
//                       <span className="bu-statBadge"> {bloodData.userStats.acceptedRequests} Fulfilled</span>
//                       <span className="bu-statBadge"> {bloodData.userStats.pendingRequests} Pending</span>
//                     </div>
//                   </div>
//                   <div className="bu-dropdownContent">
//                     {bloodData.myRequests.length === 0 ? (
//                       <div className="bu-emptyDropdown">
//                         <span className="bu-emptyIcon"></span>
//                         <p>No requests yet</p>
//                         <button 
//                           onClick={() => setActiveSection('request')}
//                           className="bu-emptyActionButton"
//                         >
//                           Make First Request
//                         </button>
//                       </div>
//                     ) : (
//                       bloodData.myRequests.slice(0, 5).map(request => (
//                         <div key={request._id} className="bu-dropdownItem">
//                           <div className="bu-itemLeft">
//                             <span className="bu-bloodTypeSmall">{request.blood_group}</span>
//                             <span className="bu-itemUnits">{request.units_requested}u</span>
//                           </div>
//                           <div className="bu-itemCenter">
//                             <span className="bu-itemBank">{request.bank_id?.name || 'Blood Bank'}</span>
//                             <span className="bu-itemDate">{new Date(request.requested_date).toLocaleDateString()}</span>
//                           </div>
//                           <div className="bu-itemRight">
//                             <span style={{
//                               ...styles.itemStatus,
//                               color: request.status === 'accepted' ? '#27ae60' : 
//                                      request.status === 'rejected' ? '#e74c3c' : '#f39c12'
//                             }}>
//                               {request.status === 'accepted' ? '' :
//                                request.status === 'rejected' ? '' : ''}
//                             </span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                     {bloodData.myRequests.length > 5 && (
//                       <div className="bu-viewAllButton" onClick={() => setActiveSection('history')}>
//                         View All Requests ({bloodData.myRequests.length})
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Quick Stats */}
//             <div className="bu-quickStats">
//               <div className="bu-quickStat">
//                 <span className="bu-quickStatNumber">{bloodData.userStats.livesSaved}</span>
//                 <span className="bu-quickStatLabel">Lives Saved</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Click outside to close dropdowns */}
//       {(showNotifications || showMyDonations || showMyRequests) && (
//         <div 
//           className="bu-overlay" 
//           onClick={() => {
//             setShowNotifications(false);
//             setShowMyDonations(false);
//             setShowMyRequests(false);
//           }}
//         />
//       )}

//       {/* Enhanced Hero Section */}
//       <section className="bu-hero">
//         <div className="bu-heroContent">
//           <div className="bu-heroLeft">
//             <h1 className="bu-heroTitle">
//               Save Lives Through <span className="bu-highlight">Blood Donation</span>
//             </h1>
//             <p className="bu-heroSubtitle">
//               Your contribution can save up to 3 lives. Join our community of life-savers!
//             </p>
//             <div className="bu-heroButtons">
//               <button 
//                 onClick={() => setActiveSection('donate')}
//                 className="bu-heroPrimaryButton"
//               >
//                  Donate Now
//               </button>
//               <button 
//                 onClick={() => setActiveSection('request')}
//                 className="bu-heroSecondaryButton"
//               >
//                  Request Blood
//               </button>
//             </div>
//           </div>
//           <div className="bu-heroRight">
//             <div className="bu-heroStatsCard">
//               <h3 className="bu-heroStatsTitle">Your Impact</h3>
//               <div className="bu-heroStatsList">
//                 <div className="bu-heroStatItem">
//                   <span className="bu-heroStatIcon"></span>
//                   <div>
//                     <div className="bu-heroStatNumber">{bloodData.userStats.acceptedDonations}</div>
//                     <div className="bu-heroStatLabel">Successful Donations</div>
//                   </div>
//                 </div>
//                 <div className="bu-heroStatItem">
//                   <span className="bu-heroStatIcon"></span>
//                   <div>
//                     <div className="bu-heroStatNumber">{bloodData.userStats.acceptedRequests}</div>
//                     <div className="bu-heroStatLabel">Fulfilled Requests</div>
//                   </div>
//                 </div>
//                 <div className="bu-heroStatItem">
//                   <span className="bu-heroStatIcon"></span>
//                   <div>
//                     <div className="bu-heroStatNumber">{bloodData.userStats.livesSaved}</div>
//                     <div className="bu-heroStatLabel">Lives Saved</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Enhanced Navigation */}
//       <nav className="bu-nav">
//         <div className="bu-navContent">
//           {[
//             { id: "home", label: "Dashboard", icon: "", color: "#3498db" },
//             { id: "donate", label: "Donate Blood", icon: "", color: "#e74c3c" },
//             { id: "request", label: "Request Blood", icon: "", color: "#f39c12" },
//             { id: "history", label: "My History", icon: "", color: "#9b59b6" },
//             { id: "urgent", label: "Urgent Needs", icon: "", color: "#e67e22" }
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
//               <span className="bu-navIcon">{item.icon}</span>
//               <span className="bu-navLabel">{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Content with better styling */}
//       <div className="bu-content">
//         <div className="bu-contentWrapper">
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
//     <div className="bu-section">
//       <div className="bu-welcomeCard">
//         <div className="bu-welcomeContent">
//           <h2 className="bu-welcomeTitle">Your Blood Bank Journey </h2>
//           <p className="bu-welcomeText">
//             Track your life-saving contributions and make a real difference in your community!
//           </p>

//           <div className="bu-achievementShowcase">
//             <div className="bu-achievementItem">
//               <div className="bu-achievementNumber">{userStats.acceptedDonations}</div>
//               <div className="bu-achievementLabel">Successful Donations</div>
//               <div className="bu-achievementDesc">Accepted by blood banks</div>
//             </div>
//             <div className="bu-achievementDivider"></div>
//             <div className="bu-achievementItem">
//               <div className="bu-achievementNumber">{userStats.livesSaved}</div>
//               <div className="bu-achievementLabel">Lives Saved</div>
//               <div className="bu-achievementDesc">Through your donations</div>
//             </div>
//             <div className="bu-achievementDivider"></div>
//             <div className="bu-achievementItem">
//               <div className="bu-achievementNumber">{userStats.acceptedRequests}</div>
//               <div className="bu-achievementLabel">Requests Fulfilled</div>
//               <div className="bu-achievementDesc">When you needed help</div>
//             </div>
//           </div>

//           {(userStats.pendingDonations > 0 || userStats.pendingRequests > 0) && (
//             <div className="bu-pendingAlert">
//               <span className="bu-pendingIcon"></span>
//               <div className="bu-pendingText">
//                 {userStats.pendingDonations > 0 && (
//                   <span>{userStats.pendingDonations} donation{userStats.pendingDonations > 1 ? 's' : ''} pending approval</span>
//                 )}
//                 {userStats.pendingDonations > 0 && userStats.pendingRequests > 0 && <span>  </span>}
//                 {userStats.pendingRequests > 0 && (
//                   <span>{userStats.pendingRequests} request{userStats.pendingRequests > 1 ? 's' : ''} pending approval</span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Action Cards */}
//       <div className="bu-quickActionCards">
//         <div 
//           onClick={() => setActiveSection('donate')}
//           style={{...styles.quickCard, ...styles.donateCard}}
//         >
//           <div className="bu-quickCardIcon"></div>
//           <h3 className="bu-quickCardTitle">Donate Blood</h3>
//           <p className="bu-quickCardDesc">Save up to 3 lives with one donation</p>
//           <div className="bu-quickCardArrow"></div>
//         </div>

//         <div 
//           onClick={() => setActiveSection('request')}
//           style={{...styles.quickCard, ...styles.requestCard}}
//         >
//           <div className="bu-quickCardIcon"></div>
//           <h3 className="bu-quickCardTitle">Request Blood</h3>
//           <p className="bu-quickCardDesc">Get help when you need it most</p>
//           <div className="bu-quickCardArrow"></div>
//         </div>

//         <div 
//           onClick={() => setActiveSection('urgent')}
//           style={{...styles.quickCard, ...styles.urgentCard}}
//         >
//           <div className="bu-quickCardIcon"></div>
//           <h3 className="bu-quickCardTitle">Urgent Needs</h3>
//           <p className="bu-quickCardDesc">Help someone in critical need</p>
//           <div className="bu-quickCardArrow"></div>
//         </div>
//       </div>

//       {/* Available Blood Banks Carousel */}
//       {bloodBanks.length > 0 && (
//         <div className="bu-bloodBanksSection">
//           <h3 className="bu-sectionSubtitle"> Available Blood Banks ({bloodBanks.length})</h3>
//           <div className="bu-bloodBanksCarousel">
//             {bloodBanks.slice(0, 6).map(bank => (
//               <div key={bank._id} className="bu-bankCard">
//                 <div className="bu-bankCardIcon"></div>
//                 <h4 className="bu-bankCardName">{bank.name}</h4>
//                 <p className="bu-bankCardLocation"> {bank.location || bank.address}</p>
//                 {bank.phone && (
//                   <p className="bu-bankCardContact"> {bank.phone}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//           {bloodBanks.length > 6 && (
//             <div className="bu-showMoreBanks">
//               <span>And {bloodBanks.length - 6} more blood banks available...</span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Urgent Requests Preview */}
//       {urgentRequests.length > 0 && (
//         <div className="bu-urgentSection">
//           <h3 className="bu-urgentSectionTitle"> Critical Blood Needs</h3>
//           <div className="bu-urgentCarousel">
//             {urgentRequests.slice(0, 3).map(request => (
//               <div key={request._id} className="bu-urgentPreviewCard">
//                 <div className="bu-urgentCardTop">
//                   <span className="bu-urgentBloodTypeBig">{request.blood_group}</span>
//                   <span className="bu-urgentPriorityBadge">
//                     {request.urgency === 'critical' ? ' CRITICAL' : ' URGENT'}
//                   </span>
//                 </div>
//                 <div className="bu-urgentCardDetails">
//                   <p> {request.location}</p>
//                   <p> {request.units_requested} units needed</p>
//                   <p> {request.timeAgo}</p>
//                 </div>
//                 <button className="bu-urgentHelpBtn"> Help Now</button>
//               </div>
//             ))}
//           </div>
//           <div className="bu-viewAllUrgent" onClick={() => setActiveSection('urgent')}>
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
import { Heart, Droplet, Calendar, Building2, Activity, MapPin } from "lucide-react";
import "../../styles/BloodBankUserPortal.css";
import { useLocation } from "react-router-dom";
import api from "../../utils/api";

function BloodPortal() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('section') || "home";

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyDonations, setShowMyDonations] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);

  useEffect(() => {
    const currentSection = new URLSearchParams(location.search).get('section');
    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [location.search]);
  const [bloodData, setBloodData] = useState({
    bloodBanks: [],
    urgentRequests: [],
    camps: [],
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

      const [banksRes, urgentRes, donationsRes, requestsRes, campsRes] = await Promise.all([
        api.get('/api/blood-bank/banks'),
        api.get('/api/blood-bank-user/blood/urgent-requests'),
        api.get('/api/blood-bank-user/donation-requests'),
        api.get('/api/blood-bank-user/blood-requests'),
        api.get('/api/blood-camp/camps')
      ]);

      const donations = donationsRes.data.donations || [];
      const requests = requestsRes.data.requests || [];
      const allCamps = campsRes.data || [];
      // Filter: only show camps whose end_date (or start_date) is today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const camps = allCamps.filter(camp => {
        const endDate = camp.end_date ? new Date(camp.end_date) : new Date(camp.start_date);
        return endDate >= today;
      });

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
        camps: camps,
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
        camps: [],
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
      const response = await api.post('/api/blood-bank-user/donation-request', donationData);

      if (response.data.message) {
        alert(' ' + response.data.message);
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
      const response = await api.post('/api/blood-bank-user/request-blood', requestData);

      if (response.data.message) {
        alert(' ' + response.data.message);
        await refreshData();
      }
    } catch (error) {
      console.error('Request submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit blood request');
    }
  };

  const handleCampRegister = async (campId, bloodGroup) => {
    try {
      const response = await api.post(`/api/blood-camp/${campId}/register`, { blood_group: bloodGroup });
      if (response.data.message) {
        alert(' ' + response.data.message);
        await refreshData();
      }
    } catch (error) {
      console.error('Camp registration failed:', error);
      alert(error.response?.data?.message || 'Failed to register for camp');
    }
  };

  if (loading) {
    return (
      <div className="bu-loadingContainer">
        <div className="bu-loadingContent">
          <div className="bu-loadingIcon"></div>
          <div className="bu-loadingText">Loading Blood Portal...</div>
          <div className="bu-progressBar">
            <div className="bu-progressFill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bu-container">
      {/* Enhanced Header with Notifications, My Donations, My Requests */}
      <header className="bu-header">
        <div className="bu-headerContent">
          <div className="bu-logo">
            <span className="bu-logoIcon"></span>
            <span className="bu-logoText">BloodBank Portal</span>
          </div>

          <div className="bu-headerActions">
            {/* Notifications Dropdown */}
            <div className="bu-headerActionItem">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="bu-headerButton"
              >
                <span className="bu-headerButtonIcon"></span>
                <span className="bu-headerButtonText">Notifications</span>
                {bloodData.notifications.length > 0 && (
                  <span className="bu-notificationBadge">{bloodData.notifications.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="bu-dropdown">
                  <div className="bu-dropdownHeader">
                    <h4>Recent Notifications</h4>
                  </div>
                  <div className="bu-dropdownContent">
                    {bloodData.notifications.length === 0 ? (
                      <div className="bu-emptyDropdown">
                        <span className="bu-emptyIcon"></span>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      bloodData.notifications.map(notification => (
                        <div key={notification.id} className="bu-notificationItem">
                          <div className="bu-notificationIcon">
                            {notification.type === 'donation' ? '' : ''}
                          </div>
                          <div className="bu-notificationContent">
                            <h5 className="bu-notificationTitle">{notification.title}</h5>
                            <p className="bu-notificationMessage">{notification.message}</p>
                            <span className="bu-notificationTime">{notification.time}</span>
                          </div>
                          <div style={{
                            ...styles.notificationStatus,
                            backgroundColor: notification.status === 'accepted' ? '#27ae60' :
                              notification.status === 'rejected' ? '#e74c3c' : '#f39c12'
                          }}>
                            {notification.status === 'accepted' ? '' :
                              notification.status === 'rejected' ? '' : ''}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Donations Dropdown */}
            <div className="bu-headerActionItem">
              <button
                onClick={() => setShowMyDonations(!showMyDonations)}
                className="bu-headerButton"
              >
                <span className="bu-headerButtonIcon"></span>
                <span className="bu-headerButtonText">My Donations</span>
                <span className="bu-countBadge">{bloodData.userStats.acceptedDonations}</span>
              </button>

              {showMyDonations && (
                <div className="bu-dropdown">
                  <div className="bu-dropdownHeader">
                    <h4>My Donations ({bloodData.myDonations.length})</h4>
                    <div className="bu-statsRow">
                      <span className="bu-statBadge"> {bloodData.userStats.acceptedDonations} Accepted</span>
                      <span className="bu-statBadge"> {bloodData.userStats.pendingDonations} Pending</span>
                    </div>
                  </div>
                  <div className="bu-dropdownContent">
                    {bloodData.myDonations.length === 0 ? (
                      <div className="bu-emptyDropdown">
                        <span className="bu-emptyIcon"></span>
                        <p>No donations yet</p>
                        <button
                          onClick={() => setActiveSection('donate')}
                          className="bu-emptyActionButton"
                        >
                          Make First Donation
                        </button>
                      </div>
                    ) : (
                      bloodData.myDonations.slice(0, 5).map(donation => (
                        <div key={donation._id} className="bu-dropdownItem">
                          <div className="bu-itemLeft">
                            <span className="bu-bloodTypeSmall">{donation.blood_group}</span>
                            <span className="bu-itemUnits">{donation.units_donated}u</span>
                          </div>
                          <div className="bu-itemCenter">
                            <span className="bu-itemBank">{donation.bank_id?.name || 'Blood Bank'}</span>
                            <span className="bu-itemDate">{new Date(donation.requested_date).toLocaleDateString()}</span>
                          </div>
                          <div className="bu-itemRight">
                            <span style={{
                              ...styles.itemStatus,
                              color: donation.status === 'accepted' ? '#27ae60' :
                                donation.status === 'rejected' ? '#e74c3c' : '#f39c12'
                            }}>
                              {donation.status === 'accepted' ? '' :
                                donation.status === 'rejected' ? '' : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {bloodData.myDonations.length > 5 && (
                      <div className="bu-viewAllButton" onClick={() => setActiveSection('history')}>
                        View All Donations ({bloodData.myDonations.length})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* My Requests Dropdown */}
            <div className="bu-headerActionItem">
              <button
                onClick={() => setShowMyRequests(!showMyRequests)}
                className="bu-headerButton"
              >
                <span className="bu-headerButtonIcon"></span>
                <span className="bu-headerButtonText">My Requests</span>
                <span className="bu-countBadge">{bloodData.userStats.acceptedRequests}</span>
              </button>

              {showMyRequests && (
                <div className="bu-dropdown">
                  <div className="bu-dropdownHeader">
                    <h4>My Requests ({bloodData.myRequests.length})</h4>
                    <div className="bu-statsRow">
                      <span className="bu-statBadge"> {bloodData.userStats.acceptedRequests} Fulfilled</span>
                      <span className="bu-statBadge"> {bloodData.userStats.pendingRequests} Pending</span>
                    </div>
                  </div>
                  <div className="bu-dropdownContent">
                    {bloodData.myRequests.length === 0 ? (
                      <div className="bu-emptyDropdown">
                        <span className="bu-emptyIcon"></span>
                        <p>No requests yet</p>
                        <button
                          onClick={() => setActiveSection('request')}
                          className="bu-emptyActionButton"
                        >
                          Make First Request
                        </button>
                      </div>
                    ) : (
                      bloodData.myRequests.slice(0, 5).map(request => (
                        <div key={request._id} className="bu-dropdownItem">
                          <div className="bu-itemLeft">
                            <span className="bu-bloodTypeSmall">{request.blood_group}</span>
                            <span className="bu-itemUnits">{request.units_requested}u</span>
                          </div>
                          <div className="bu-itemCenter">
                            <span className="bu-itemBank">{request.bank_id?.name || 'Blood Bank'}</span>
                            <span className="bu-itemDate">{new Date(request.requested_date).toLocaleDateString()}</span>
                          </div>
                          <div className="bu-itemRight">
                            <span style={{
                              ...styles.itemStatus,
                              color: request.status === 'accepted' ? '#27ae60' :
                                request.status === 'rejected' ? '#e74c3c' : '#f39c12'
                            }}>
                              {request.status === 'accepted' ? '' :
                                request.status === 'rejected' ? '' : ''}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    {bloodData.myRequests.length > 5 && (
                      <div className="bu-viewAllButton" onClick={() => setActiveSection('history')}>
                        View All Requests ({bloodData.myRequests.length})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bu-quickStats">
              <div className="bu-quickStat">
                <span className="bu-quickStatNumber">{bloodData.userStats.livesSaved}</span>
                <span className="bu-quickStatLabel">Lives Saved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showMyDonations || showMyRequests) && (
        <div
          className="bu-overlay"
          onClick={() => {
            setShowNotifications(false);
            setShowMyDonations(false);
            setShowMyRequests(false);
          }}
        />
      )}

      {/* Enhanced Hero Section */}
      <section className="bu-hero">
        <div className="bu-heroContent">
          <div className="bu-heroLeft">
            <h1 className="bu-heroTitle">
              Save Lives Through <span className="bu-highlight">Blood Donation</span>
            </h1>
            <p className="bu-heroSubtitle">
              Your contribution can save up to 3 lives. Join our community of life-savers!
            </p>
            <div className="bu-heroButtons">
              <button
                onClick={() => setActiveSection('donate')}
                className="bu-heroPrimaryButton"
              >
                 Donate Now
              </button>
              <button
                onClick={() => setActiveSection('request')}
                className="bu-heroSecondaryButton"
              >
                 Request Blood
              </button>
            </div>
          </div>
          <div className="bu-heroRight">
            <div className="bu-heroStatsCard">
              <h3 className="bu-heroStatsTitle">Your Impact</h3>
              <div className="bu-heroStatsList">
                <div className="bu-heroStatItem">
                  <span className="bu-heroStatIcon"></span>
                  <div>
                    <div className="bu-heroStatNumber">{bloodData.userStats.acceptedDonations}</div>
                    <div className="bu-heroStatLabel">Successful Donations</div>
                  </div>
                </div>
                <div className="bu-heroStatItem">
                  <span className="bu-heroStatIcon"></span>
                  <div>
                    <div className="bu-heroStatNumber">{bloodData.userStats.acceptedRequests}</div>
                    <div className="bu-heroStatLabel">Fulfilled Requests</div>
                  </div>
                </div>
                <div className="bu-heroStatItem">
                  <span className="bu-heroStatIcon"></span>
                  <div>
                    <div className="bu-heroStatNumber">{bloodData.userStats.livesSaved}</div>
                    <div className="bu-heroStatLabel">Lives Saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Navigation */}
      <nav style={{
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)',
        borderRadius: '50px', padding: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.6)',
        marginBottom: '32px',
        display: 'flex', justifyContent: 'center',
        margin: '0 auto 32px auto',
        width: 'fit-content',
        maxWidth: '100%',
      }}>
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          padding: '0 4px'
        }}>
          {[
            { id: "home", label: "Dashboard", icon: <Building2 size={18} />, activeGrad: 'linear-gradient(135deg, #3b82f6, #2563eb)', hoverBg: '#eff6ff', hoverColor: '#2563eb' },
            { id: "donate", label: "Donate Blood", icon: <Heart size={18} />, activeGrad: 'linear-gradient(135deg, #ef4444, #dc2626)', hoverBg: '#fef2f2', hoverColor: '#dc2626' },
            { id: "request", label: "Request Blood", icon: <Droplet size={18} />, activeGrad: 'linear-gradient(135deg, #f59e0b, #d97706)', hoverBg: '#fffbeb', hoverColor: '#d97706' },
            { id: "camps", label: "Blood Camps", icon: <MapPin size={18} />, activeGrad: 'linear-gradient(135deg, #10b981, #059669)', hoverBg: '#f0fdf4', hoverColor: '#059669' },
            { id: "history", label: "My History", icon: <Activity size={18} />, activeGrad: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', hoverBg: '#f5f3ff', hoverColor: '#7c3aed' },
            { id: "urgent", label: "Urgent Needs", icon: <Heart size={18} />, activeGrad: 'linear-gradient(135deg, #ef4444, #b91c1c)', hoverBg: '#fef2f2', hoverColor: '#b91c1c' }
          ].map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '50px',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '700',
                  whiteSpace: 'nowrap', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? item.activeGrad : 'transparent',
                  color: isActive ? '#fff' : '#64748b',
                  boxShadow: isActive ? '0 6px 20px rgba(0,0,0,0.15)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  flex: '0 0 auto'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = item.hoverBg;
                    e.currentTarget.style.color = item.hoverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content with better styling */}
      <div className="bu-content">
        <div className="bu-contentWrapper">
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
          {activeSection === "camps" && (
            <CampsSection camps={bloodData.camps} onRegister={handleCampRegister} userId={JSON.parse(localStorage.getItem('user') || '{}')._id} />
          )}
        </div>
      </div>
    </div>
  );
}

// HOME SECTION
function HomeSection({ urgentRequests, bloodBanks, userStats, setActiveSection }) {
  return (
    <div className="bu-section">
      <div className="bu-welcomeCard">
        <div className="bu-welcomeContent">
          <h2 className="bu-welcomeTitle">Your Blood Bank Journey </h2>
          <p className="bu-welcomeText">
            Track your life-saving contributions and make a real difference in your community!
          </p>

          <div className="bu-achievementShowcase">
            <div className="bu-achievementItem">
              <div className="bu-achievementNumber">{userStats.acceptedDonations}</div>
              <div className="bu-achievementLabel">Successful Donations</div>
              <div className="bu-achievementDesc">Accepted by blood banks</div>
            </div>
            <div className="bu-achievementDivider"></div>
            <div className="bu-achievementItem">
              <div className="bu-achievementNumber">{userStats.livesSaved}</div>
              <div className="bu-achievementLabel">Lives Saved</div>
              <div className="bu-achievementDesc">Through your donations</div>
            </div>
            <div className="bu-achievementDivider"></div>
            <div className="bu-achievementItem">
              <div className="bu-achievementNumber">{userStats.acceptedRequests}</div>
              <div className="bu-achievementLabel">Requests Fulfilled</div>
              <div className="bu-achievementDesc">When you needed help</div>
            </div>
          </div>

          {(userStats.pendingDonations > 0 || userStats.pendingRequests > 0) && (
            <div className="bu-pendingAlert">
              <span className="bu-pendingIcon"></span>
              <div className="bu-pendingText">
                {userStats.pendingDonations > 0 && (
                  <span>{userStats.pendingDonations} donation{userStats.pendingDonations > 1 ? 's' : ''} pending approval</span>
                )}
                {userStats.pendingDonations > 0 && userStats.pendingRequests > 0 && <span>  </span>}
                {userStats.pendingRequests > 0 && (
                  <span>{userStats.pendingRequests} request{userStats.pendingRequests > 1 ? 's' : ''} pending approval</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="bu-quickActionCards">
        <div
          onClick={() => setActiveSection('donate')}
          style={{ ...styles.quickCard, ...styles.donateCard }}
        >
          <div className="bu-quickCardIcon"></div>
          <h3 className="bu-quickCardTitle">Donate Blood</h3>
          <p className="bu-quickCardDesc">Save up to 3 lives with one donation</p>
          <div className="bu-quickCardArrow"></div>
        </div>

        <div
          onClick={() => setActiveSection('request')}
          style={{ ...styles.quickCard, ...styles.requestCard }}
        >
          <div className="bu-quickCardIcon"></div>
          <h3 className="bu-quickCardTitle">Request Blood</h3>
          <p className="bu-quickCardDesc">Get help when you need it most</p>
          <div className="bu-quickCardArrow"></div>
        </div>

        <div
          onClick={() => setActiveSection('urgent')}
          style={{ ...styles.quickCard, ...styles.urgentCard }}
        >
          <div className="bu-quickCardIcon"></div>
          <h3 className="bu-quickCardTitle">Urgent Needs</h3>
          <p className="bu-quickCardDesc">Help someone in critical need</p>
          <div className="bu-quickCardArrow"></div>
        </div>
      </div>

      {/* Available Blood Banks */}
      {bloodBanks.length > 0 && (
        <div className="bu-bloodBanksSection">
          <h3 className="bu-sectionSubtitle"> Available Blood Banks ({bloodBanks.length})</h3>
          <div className="bu-bloodBanksCarousel">
            {bloodBanks.slice(0, 6).map(bank => (
              <div key={bank._id} className="bu-bankCard">
                <div className="bu-bankCardIcon"></div>
                <h4 className="bu-bankCardName">{bank.name}</h4>
                <p className="bu-bankCardLocation"> {bank.location || bank.address}</p>
                {bank.phone && (
                  <p className="bu-bankCardContact"> {bank.phone}</p>
                )}
              </div>
            ))}
          </div>
          {bloodBanks.length > 6 && (
            <div className="bu-showMoreBanks">
              <span>And {bloodBanks.length - 6} more blood banks available...</span>
            </div>
          )}
        </div>
      )}

      {/* Urgent Requests Preview */}
      {urgentRequests.length > 0 && (
        <div className="bu-urgentSection">
          <h3 className="bu-urgentSectionTitle"> Critical Blood Needs</h3>
          <div className="bu-urgentCarousel">
            {urgentRequests.slice(0, 3).map(request => (
              <div key={request._id} className="bu-urgentPreviewCard">
                <div className="bu-urgentCardTop">
                  <span className="bu-urgentBloodTypeBig">{request.blood_group}</span>
                  <span className="bu-urgentPriorityBadge">
                    {request.urgency === 'critical' ? ' CRITICAL' : ' URGENT'}
                  </span>
                </div>
                <div className="bu-urgentCardDetails">
                  <p> {request.location}</p>
                  <p> {request.units_requested} units needed</p>
                  <p> {request.timeAgo}</p>
                </div>
                <button className="bu-urgentHelpBtn"> Help Now</button>
              </div>
            ))}
          </div>
          <div className="bu-viewAllUrgent" onClick={() => setActiveSection('urgent')}>
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
    <div className="bu-section">
      <div className="bu-formCard">
        <div className="bu-formHeader">
          <h2 className="bu-formTitle"><Heart className="bu-formTitleIcon" size={32} color="#dc2626" /> Donate Blood</h2>
          <p className="bu-formSubtitle">Your donation can save up to 3 lives!</p>
        </div>

        <form onSubmit={handleSubmit} className="bu-form">
          <div className="bu-formRow">
            <div className="bu-formGroup">
              <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Droplet size={16} color="#ef4444" /> Blood Group *</label>
              <select
                value={donationForm.blood_group}
                onChange={(e) => setDonationForm({ ...donationForm, blood_group: e.target.value })}
                className="bu-input"
                required
                disabled={submitting}
              >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="bu-formGroup">
              <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Activity size={16} color="#ef4444" /> Units to Donate *</label>
              <select
                value={donationForm.units}
                onChange={(e) => setDonationForm({ ...donationForm, units: parseInt(e.target.value) })}
                className="bu-input"
                required
                disabled={submitting}
              >
                <option value={1}>1 Unit (450ml)</option>
                <option value={2}>2 Units (900ml)</option>
              </select>
            </div>
          </div>

          <div className="bu-formGroup">
            <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Building2 size={16} color="#ef4444" /> Select Blood Bank * ({bloodBanks?.length || 0} available)</label>
            <select
              value={donationForm.bankId}
              onChange={(e) => setDonationForm({ ...donationForm, bankId: e.target.value })}
              className="bu-input"
              required
              disabled={submitting}
            >
              <option value="">Choose a blood bank</option>
              {bloodBanks && bloodBanks.map(bank => (
                <option key={bank._id} value={bank._id}>
                   {bank.name || 'Blood Bank'} - {bank.location || bank.address || 'Location not specified'}
                  {bank.phone ? ` (${bank.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="bu-formGroup">
            <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={16} color="#ef4444" /> Requested Date *</label>
            <input
              type="date"
              value={donationForm.requestedDate}
              onChange={(e) => setDonationForm({ ...donationForm, requestedDate: e.target.value })}
              className="bu-input"
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
            {submitting ? "Submitting..." : " Submit Donation Request"}
          </button>
        </form>

        <div className="bu-benefits">
          <h3 className="bu-benefitsTitle">Why Donate Blood?</h3>
          <div className="bu-benefitsList">
            <div className="bu-benefitItem"> Improves your health</div>
            <div className="bu-benefitItem"> Saves up to 3 lives</div>
            <div className="bu-benefitItem"> Builds community</div>
            <div className="bu-benefitItem"> Gives satisfaction</div>
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
    <div className="bu-section">
      <div className="bu-formCard">
        <div className="bu-formHeader">
          <h2 className="bu-formTitle"><Activity className="bu-formTitleIcon" size={32} color="#dc2626" /> Request Blood</h2>
          <p className="bu-formSubtitle">Get the help you need from our community</p>
        </div>

        <form onSubmit={handleSubmit} className="bu-form">
          <div className="bu-formRow">
            <div className="bu-formGroup">
              <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Droplet size={16} color="#ef4444" /> Blood Group Needed *</label>
              <select
                value={requestForm.blood_group}
                onChange={(e) => setRequestForm({ ...requestForm, blood_group: e.target.value })}
                className="bu-input"
                required
                disabled={submitting}
              >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="bu-formGroup">
              <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Activity size={16} color="#ef4444" /> Units Needed *</label>
              <select
                value={requestForm.units}
                onChange={(e) => setRequestForm({ ...requestForm, units: parseInt(e.target.value) })}
                className="bu-input"
                required
                disabled={submitting}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Unit{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bu-formGroup">
            <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Building2 size={16} color="#ef4444" /> Select Blood Bank * ({bloodBanks?.length || 0} available)</label>
            <select
              value={requestForm.bankId}
              onChange={(e) => setRequestForm({ ...requestForm, bankId: e.target.value })}
              className="bu-input"
              required
              disabled={submitting}
            >
              <option value="">Choose a blood bank</option>
              {bloodBanks && bloodBanks.map(bank => (
                <option key={bank._id} value={bank._id}>
                   {bank.name || 'Blood Bank'} - {bank.location || bank.address || 'Location not specified'}
                  {bank.phone ? ` (${bank.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="bu-formGroup">
            <label className="bu-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={16} color="#ef4444" /> Needed By Date *</label>
            <input
              type="date"
              value={requestForm.requestedDate}
              onChange={(e) => setRequestForm({ ...requestForm, requestedDate: e.target.value })}
              className="bu-input"
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
            {submitting ? "Submitting..." : " Submit Blood Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

// HISTORY SECTION
function HistorySection({ myDonations, myRequests, userStats, setActiveSection }) {
  const [activeTab, setActiveTab] = useState('donations');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return { bg: '#e8f8f0', color: '#27ae60', border: '#b8e6cd' };
      case 'rejected': return { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' };
      case 'pending': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
    }
  };

  return (
    <div className="bu-section">
      {/* Achievement Stats Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '24px', padding: '32px', marginBottom: '24px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(239,68,68,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(59,130,246,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        {[
          { value: userStats?.acceptedDonations || 0, label: 'Successful Donations', icon: <Heart size={24} color="#ef4444" />, gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))' },
          { value: userStats?.livesSaved || 0, label: 'Lives Saved', icon: <Activity size={24} color="#10b981" />, gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' },
          { value: userStats?.acceptedRequests || 0, label: 'Requests Fulfilled', icon: <Droplet size={24} color="#3b82f6" />, gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: stat.gradient, backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
            padding: '24px', textAlign: 'center', position: 'relative', zIndex: 1
          }}>
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', lineHeight: 1, marginBottom: '6px' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'donations', label: `Donations (${myDonations?.length || 0})`, icon: <Heart size={16} /> },
          { id: 'requests', label: `Requests (${myRequests?.length || 0})`, icon: <Droplet size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '50px', border: 'none',
            fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '800',
            cursor: 'pointer', transition: 'all 0.2s ease',
            background: activeTab === tab.id ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : '#ffffff',
            color: activeTab === tab.id ? '#fff' : '#64748b',
            boxShadow: activeTab === tab.id ? '0 4px 16px rgba(220,38,38,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
            border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0'
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: '28px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.03)'
        }}>
          {!myDonations || myDonations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Heart size={48} color="#e2e8f0" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>No Donations Yet</h3>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>Start saving lives today with your first donation!</p>
              <button onClick={() => setActiveSection('donate')} style={{
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff',
                border: 'none', padding: '12px 28px', borderRadius: '50px',
                fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: '800',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(220,38,38,0.25)'
              }}>Make Your First Donation</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myDonations.map(donation => {
                const s = getStatusStyle(donation.status);
                return (
                  <div key={donation._id || Math.random()} style={{
                    display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center', gap: '20px', padding: '16px 20px',
                    background: '#f8fafc', borderRadius: '16px',
                    border: '1px solid #f1f5f9', transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '0.95rem', color: '#dc2626'
                    }}>{donation.blood_group || '?'}</div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                        {donation.units_donated || 1} Unit{(donation.units_donated || 1) > 1 ? 's' : ''} Donated
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {donation.requested_date ? new Date(donation.requested_date).toLocaleDateString() : 'Unknown'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={13} /> {donation.bank_id?.name || 'Blood Bank'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{
                        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                        padding: '4px 14px', borderRadius: '50px',
                        fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.3px'
                      }}>{(donation.status || 'unknown').toUpperCase()}</span>
                      {donation.status === 'accepted' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>
                          +{(donation.units_donated || 1) * 3} lives saved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: '28px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.03)'
        }}>
          {!myRequests || myRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Droplet size={48} color="#e2e8f0" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>No Requests Yet</h3>
              <p style={{ color: '#64748b' }}>You haven't made any blood requests.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myRequests.map(request => {
                const s = getStatusStyle(request.status);
                return (
                  <div key={request._id || Math.random()} style={{
                    display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center', gap: '20px', padding: '16px 20px',
                    background: '#f8fafc', borderRadius: '16px',
                    border: '1px solid #f1f5f9', transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '0.95rem', color: '#2563eb'
                    }}>{request.blood_group || '?'}</div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                        {request.units_requested || 1} Unit{(request.units_requested || 1) > 1 ? 's' : ''} Requested
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> {request.requested_date ? new Date(request.requested_date).toLocaleDateString() : 'Unknown'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={13} /> {request.bank_id?.name || 'Blood Bank'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{
                        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                        padding: '4px 14px', borderRadius: '50px',
                        fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.3px'
                      }}>{(request.status || 'unknown').toUpperCase()}</span>
                      {request.status === 'accepted' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981' }}>
                          Request fulfilled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// URGENT SECTION
function UrgentSection({ urgentRequests }) {
  return (
    <div className="bu-section">
      {/* Urgent Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 40%, #991b1b 100%)',
        borderRadius: '24px', padding: '32px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden', textAlign: 'center'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(239,68,68,0.3) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(252,165,165,0.1) 0%, transparent 40%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)',
            padding: '6px 16px', borderRadius: '50px', marginBottom: '16px',
            fontSize: '0.78rem', fontWeight: '800', color: '#fca5a5',
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 0 0 0 rgba(239,68,68,0.4)'
            }} />
            Live Urgent Needs
          </div>
          <h2 style={{
            fontSize: '2rem', fontWeight: '900', color: '#fff',
            margin: '0 0 8px', letterSpacing: '-0.02em'
          }}>Urgent Blood Needs</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0, fontWeight: '500' }}>
            Someone needs your help right now. Every minute counts.
          </p>
        </div>
      </div>

      {!urgentRequests || urgentRequests.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: '60px 24px', textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.03)'
        }}>
          <Activity size={56} color="#10b981" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>All Clear!</h3>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            No urgent blood requests right now. Everyone is safe!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px'
        }}>
          {urgentRequests.map(request => {
            const isCritical = request.urgency === 'critical';
            return (
              <div key={request._id || Math.random()} style={{
                background: '#ffffff', borderRadius: '20px',
                border: isCritical ? '2px solid #fecaca' : '1px solid #e2e8f0',
                boxShadow: isCritical
                  ? '0 10px 30px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,1)'
                  : '0 4px 16px rgba(0,0,0,0.04)',
                overflow: 'hidden', transition: 'all 0.3s ease',
                display: 'flex', flexDirection: 'column'
              }}>
                {/* Card Top Accent */}
                <div style={{
                  height: '4px',
                  background: isCritical
                    ? 'linear-gradient(90deg, #ef4444, #f87171, #ef4444)'
                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  backgroundSize: '200% 100%',
                  animation: isCritical ? 'shimmer 2s linear infinite' : 'none'
                }} />

                <div style={{ padding: '24px' }}>
                  {/* Blood Type + Priority Row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '18px',
                      background: isCritical
                        ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                        : 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '1.3rem',
                      color: isCritical ? '#dc2626' : '#d97706',
                      border: isCritical ? '2px solid #fecaca' : '2px solid #fde68a'
                    }}>{request.blood_group || '?'}</div>

                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: isCritical
                        ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                        : 'linear-gradient(135deg, #d97706, #f59e0b)',
                      color: '#fff', padding: '6px 16px', borderRadius: '50px',
                      fontSize: '0.72rem', fontWeight: '800',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      boxShadow: isCritical
                        ? '0 4px 12px rgba(220,38,38,0.3)'
                        : '0 4px 12px rgba(217,119,6,0.3)'
                    }}>
                      {isCritical && <span style={{
                        width: '6px', height: '6px', borderRadius: '50%', background: '#fff',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }} />}
                      {isCritical ? 'CRITICAL' : 'HIGH PRIORITY'}
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <MapPin size={16} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{request.location || 'Unknown location'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Droplet size={16} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Units Needed</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{request.units_requested || 0} Unit{(request.units_requested || 0) > 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Calendar size={16} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Posted</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{request.timeAgo || 'Recently'}</div>
                      </div>
                    </div>

                    {request.patient_condition && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '10px',
                          background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Activity size={16} color="#ef4444" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Condition</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#dc2626' }}>{request.patient_condition}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button style={{
                    width: '100%', padding: '14px',
                    background: isCritical
                      ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                      : 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: '#fff', border: 'none', borderRadius: '14px',
                    fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: '800',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: isCritical
                      ? '0 6px 20px rgba(220,38,38,0.25)'
                      : '0 6px 20px rgba(22,163,74,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                    <Heart size={18} /> I Can Help!
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shimmer animation for critical accent bar */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// CAMPS SECTION
function CampsSection({ camps, onRegister, userId }) {
  if (!camps || camps.length === 0) {
    return (
      <div className="bu-section">
        <div className="bu-emptyContainer">
          <span style={{ fontSize: "4rem", marginBottom: "1rem", display: "inline-block" }}></span>
          <h3 style={{ fontSize: "1.8rem", color: "#2c3e50" }}>No Upcoming Blood Camps</h3>
          <p style={{ color: "#7f8c8d" }}>There are currently no upcoming blood camps. Please check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bu-section">
      <h3 className="bu-sectionTitle">Upcoming Blood Camps</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2rem",
        marginBottom: "2rem"
      }}>
        {camps.map(camp => {
          // Check if user is already registered for this camp
          const isRegistered = userId && camp.donations && camp.donations.some(
            d => (d.donor === userId || d.donor?._id === userId)
          );

          return (
            <div key={camp._id} style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
              border: isRegistered ? "2px solid #27ae60" : "1px solid rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              
              {isRegistered && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                  color: "white", padding: "4px 14px", borderRadius: "50px",
                  fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.5px",
                  boxShadow: "0 4px 12px rgba(39, 174, 96, 0.3)"
                }}>REGISTERED</div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ backgroundColor: "#e2f0d9", color: "#27ae60", padding: "0.4rem 1rem", borderRadius: "15px", fontWeight: "bold", fontSize: "0.8rem" }}>
                  {camp.status.toUpperCase()}
                </div>
                <div style={{ backgroundColor: "#fdeced", color: "#e74c3c", padding: "0.4rem 1rem", borderRadius: "15px", fontWeight: "bold", fontSize: "0.8rem" }}>
                  {camp.location?.city || 'Local'}
                </div>
              </div>

              <h4 style={{ fontSize: "1.4rem", color: "#2c3e50", marginBottom: "0.5rem" }}>{camp.name}</h4>
              <p style={{ color: "#7f8c8d", fontSize: "0.9rem", marginBottom: "1.5rem", flexGrow: 1 }}>{camp.description || 'Join us and save lives.'}</p>
              
              <div style={{ backgroundColor: "#f8f9fa", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <MapPin size={16} color="#e74c3c" />
                  <span style={{ color: "#2c3e50", fontWeight: "600", fontSize: "0.9rem" }}>{camp.location?.address}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar size={16} color="#3498db" />
                  <span style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                    {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isRegistered ? (
                <div style={{
                  backgroundColor: "#e8f8f0",
                  color: "#27ae60",
                  border: "1px solid #b8e6cd",
                  padding: "1rem 1.5rem",
                  borderRadius: "15px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "0.95rem"
                }}>
                  You are registered for this camp
                </div>
              ) : (
                <button 
                  onClick={() => {
                    const bloodGroup = prompt('Optional: What is your blood group (leave blank if unknown)?');
                    onRegister(camp._id, bloodGroup || 'Unknown');
                  }}
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    padding: "1rem 1.5rem",
                    borderRadius: "15px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    boxShadow: "0 8px 20px rgba(39, 174, 96, 0.3)"
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = 0.9}
                  onMouseLeave={(e) => e.target.style.opacity = 1}
                >
                  Register to Donate
                </button>
              )}
            </div>
          );
        })}
      </div>
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






