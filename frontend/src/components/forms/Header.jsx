

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png"; // keep your original path

// const searchData = [
//   {
//     id: 1,
//     name: "Book an Appointment",
//     link: "/appointments",
//     tags: ["appointment", "book", "consultation", "schedule", "meeting", "doctor visit"]
//   },
//   {
//     id: 2,
//     name: "Find a Doctor",
//     link: "/find-doctor",
//     tags: ["doctor", "physician", "specialist", "search", "consult", "near me"]
//   },
//   {
//     id: 3,
//     name: "Get Second Opinion",
//     link: "/second-opinion",
//     tags: ["second opinion", "consultation", "diagnosis", "expert advice", "review", "double check"]
//   },
//   {
//     id: 4,
//     name: "Our Hospitals",
//     link: "/hospitals",
//     tags: ["hospital", "locations", "branches", "facilities", "medical center", "infrastructure"]
//   },
//   {
//     id: 5,
//     name: "Online Consultation",
//     link: "/online-consultation",
//     tags: ["online", "consult", "virtual", "doctor", "chat", "telemedicine"]
//   },
//   {
//     id: 6,
//     name: "Treatments",
//     link: "/treatments",
//     tags: ["treatments", "procedures", "therapies", "care", "services", "surgeries"]
//   },
//   {
//     id: 7,
//     name: "Blood Camps and Banks",
//     link: "/blood-services",
//     tags: ["blood", "donation", "camp", "bank", "availability", "blood group", "save life"]
//   },
//   {
//     id: 8,
//     name: "Blogs",
//     link: "/blogs",
//     tags: ["blog", "articles", "health tips", "news", "updates", "stories"]
//   },
//   {
//     id: 9,
//     name: "Contact Us",
//     link: "/contact",
//     tags: ["contact", "help", "support", "reach out", "email", "phone", "address"]
//   }
// ];

// function Header() {
//   const [searchInput, setSearchInput] = useState("");
//   const [searchedData, setSearchedData] = useState([]);
//   const [showSecondaryNavbar, setShowSecondaryNavbar] = useState(true);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setSearchedData([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const onScroll = () => {
//       if (window.scrollY > 250) {
//         setShowSecondaryNavbar(false);
//       } else {
//         setShowSecondaryNavbar(true);
//       }
//     };
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleSearchInputChange = (value) => {
//     setSearchInput(value);
//     if (value.trim() === "") {
//       setSearchedData([]);
//       return;
//     }
//     const filtered = searchData.filter(
//       (item) =>
//         item.name.toLowerCase().includes(value.toLowerCase()) ||
//         item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
//     );
//     setSearchedData(filtered);
//   };

//   const handleSearchButtonClick = () => {
//     if (searchedData.length > 0) {
//       navigate(searchedData[0].link);
//       setSearchInput("");
//       setSearchedData([]);
//     } else {
//       alert("No matching service found.");
//     }
//   };

//   const handleSuggestionClick = (link) => {
//     setSearchInput("");
//     setSearchedData([]);
//     navigate(link);
//   };

//   return (
//     <header style={{ marginBottom: 140 }}>
//       <div
//         style={{
//           position: "fixed",
//           width: "100%",
//           top: 0,
//           zIndex: 1000,
//         }}
//       >
//         <div style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
//           <nav
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "1rem 2rem",
//               backgroundColor: "#fff",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <img src={logo} alt="Medicare Logo" style={{ height: "40px" }} />
//               <h1
//                 style={{ margin: 0, fontSize: "1.5rem", cursor: "pointer" }}
//                 onClick={() => navigate("/")}
//               >
//                 Medicare
//               </h1>
//             </div>
//             <ul
//               style={{
//                 display: "flex",
//                 listStyle: "none",
//                 gap: "1.5rem",
//                 marginLeft: 450,
//                 padding: 0,
//               }}
//             >
//               <li style={{ cursor: "pointer" }} onClick={() => navigate("/top-doctors")}>
//                 Find a Doctor
//               </li>
//               <li style={{ cursor: "pointer" }} onClick={() => navigate("/api/get-second-opinion")}>
//                 Get Second Opinion
//               </li>
//               <li style={{ cursor: "pointer" }} onClick={() => navigate("/api/blogs")}>
//                 Blogs
//               </li>
//               <li style={{ cursor: "pointer" }} onClick={() => navigate("/contact")}>
//                 Contact Us
//               </li>
//               <li style={{ cursor: "pointer" }} onClick={() => navigate("/SignUp")}>
//                 Sign Up
//               </li>
//             </ul>
//             <div
//               ref={dropdownRef}
//               style={{
//                 position: "relative",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <input
//                 type="text"
//                 value={searchInput}
//                 onChange={(e) => handleSearchInputChange(e.target.value)}
//                 placeholder="Search services..."
//                 style={{
//                   padding: "0.5rem",
//                   borderRadius: "4px",
//                   border: "1px solid #ccc",
//                   width: "200px",
//                 }}
//               />
//               <button
//                 onClick={handleSearchButtonClick}
//                 style={{
//                   marginLeft: "8px",
//                   padding: "0.5rem 0.75rem",
//                   border: "none",
//                   borderRadius: "4px",
//                   backgroundColor: "#007BFF",
//                   color: "#fff",
//                   cursor: "pointer",
//                   fontWeight: "bold",
//                 }}
//               >
//                 🔍
//               </button>
//               {searchedData.length > 0 && (
//                 <ul
//                   style={{
//                     position: "absolute",
//                     top: "100%",
//                     left: 0,
//                     right: 0,
//                     backgroundColor: "#fff",
//                     border: "1px solid #ccc",
//                     borderRadius: "4px",
//                     zIndex: 999,
//                     maxHeight: "200px",
//                     overflowY: "auto",
//                     marginTop: "4px",
//                     padding: 0,
//                     listStyle: "none",
//                   }}
//                 >
//                   {searchedData.map((item) => (
//                     <li
//                       key={item.id}
//                       onClick={() => handleSuggestionClick(item.link)}
//                       style={{
//                         padding: "10px",
//                         cursor: "pointer",
//                         borderBottom: "1px solid #eee",
//                         transition: "background-color 0.2s",
//                       }}
//                       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
//                       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
//                     >
//                       {item.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </nav>
//         </div>

//         {/* Secondary Yellow Navbar with original inline styles and toggle display */}
//         <div
//           className="secondary-navbar"
//           style={{
//             backgroundColor: "#FFD600",
//             display: showSecondaryNavbar ? "flex" : "none",
//             // gap: "2rem",
//             // padding: "0.7rem 2rem",
//             // fontWeight: "bold",
//             // fontSize: "1rem",
//           }}
//         >
//           <a href="#" style={{ textDecoration: "none", color: "#222" }}>
//             Our Hospitals
//           </a>
//           <a href="/api/patient/online-consultation" style={{ textDecoration: "none", color: "#222" }}>
//             Online Consultancy
//           </a>
//           <a href="#" style={{ textDecoration: "none", color: "#222" }}>
//             Treatments
//           </a>
//           <a href="/api/blood-bank" style={{ textDecoration: "none", color: "#222" }}>
//             Blood Camps and Banks
//           </a>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;





























import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png"; // keep your original path
import ContactModal from "../ContactModal";
import socket, { connectSocket, disconnectSocket } from "../../utils/socket";
import toast from "react-hot-toast";

const searchData = [
  {
    id: 1,
    name: "Book an Appointment",
    link: "/top-doctors",
    tags: ["appointment", "book", "consultation", "schedule", "meeting", "doctor visit"]
  },
  {
    id: 2,
    name: "Find a Doctor",
    link: "/top-doctors",
    tags: ["doctor", "physician", "specialist", "search", "consult", "near me"]
  },
  {
    id: 3,
    name: "Get Second Opinion",
    link: "/get-second-opinion",
    tags: ["second opinion", "consultation", "diagnosis", "expert advice", "review", "double check"]
  },
  {
    id: 4,
    name: "Our Hospitals",
    link: "/hospitals",
    tags: ["hospital", "locations", "branches", "facilities", "medical center", "infrastructure"]
  },
  {
    id: 5,
    name: "Online Consultation",
    link: "/patient/online-consultation",
    tags: ["online", "consult", "virtual", "doctor", "chat", "telemedicine"]
  },
  {
    id: 6,
    name: "Treatments",
    link: "/treatments",
    tags: ["treatments", "procedures", "therapies", "care", "services", "surgeries"]
  },
  {
    id: 7,
    name: "Blood Camps and Banks",
    link: "/blood-bank",
    tags: ["blood", "donation", "camp", "bank", "availability", "blood group", "save life"]
  },
  {
    id: 8,
    name: "Blogs",
    link: "/blogs",
    tags: ["blog", "articles", "health tips", "news", "updates", "stories"]
  },
  {
    id: 9,
    name: "Contact Us",
    link: "/contact",
    tags: ["contact", "help", "support", "reach out", "email", "phone", "address"]
  },
  {
    id: 10,
    name: "My Prescriptions",
    link: "/patient/prescriptions",
    tags: ["prescription", "medicine", "scripts", "doctor orders", "my drugs", "medical documents"]
  }
];

function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [showSecondaryNavbar, setShowSecondaryNavbar] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  const dropdownRef = useRef(null);
  const connectedUserIdRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check user login status
  const checkUserLogin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const response = await fetch("/api/patient/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          setUser(null);
        }
      } else {
        // Clear user if auth check fails (e.g. 401)
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check user login on component mount
  useEffect(() => {
    checkUserLogin();
  }, []);

  // Re-check authentication whenever the route/location changes
  useEffect(() => {
    setIsLoading(true);
    checkUserLogin();
  }, [location.pathname, location.search]);

  // Check auth status when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      checkUserLogin();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchedData([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 250) {
        setShowSecondaryNavbar(false);
      } else {
        setShowSecondaryNavbar(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Socket Notification listener
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/patient/notifications/count", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            setNotifCount(data.count || 0);
          } catch (parseError) {
            console.error("Error parsing notification count:", parseError);
          }
        }
      } catch (e) {
        // silent fail
      }
    };

    if (user && user._id) {
      fetchCount(); // Initial fetch

      // Only connect socket if not already connected for this user
      if (connectedUserIdRef.current !== user._id) {
        connectSocket(user._id);
        connectedUserIdRef.current = user._id;
      }
      
      const handleNewNotification = (data) => {
        setNotifCount(data.count);
        if (data.notification && data.notification.message) {
          toast.success(data.notification.message, {
            duration: 5000,
            icon: '🔔',
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              fontWeight: '500',
              border: '1px solid #334155'
            }
          });
        }
      };

      socket.on('newNotification', handleNewNotification);

      return () => {
        socket.off('newNotification', handleNewNotification);
      };
    } else {
      if (connectedUserIdRef.current) {
        disconnectSocket();
        connectedUserIdRef.current = null;
      }
    }
  }, [user]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    if (value.trim() === "") {
      setSearchedData([]);
      return;
    }
    const filtered = searchData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setSearchedData(filtered);
  };

  const handleSearchButtonClick = () => {
    if (searchedData.length > 0) {
      navigate(searchedData[0].link);
      setSearchInput("");
      setSearchedData([]);
    } else {
      alert("No matching service found.");
    }
  };

  const handleSuggestionClick = (link) => {
    setSearchInput("");
    setSearchedData([]);
    navigate(link);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/patient/logout/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        disconnectSocket();
        navigate("/login");
        setTimeout(() => {
          checkUserLogin();
        }, 100);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header style={{ marginBottom: 140 }}>
      <div
        style={{
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="navbar-container" style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <nav className="navbar">
            <div className="left-nav-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={logo} alt="Medicare Logo" style={{ height: "40px" }} />
              <h1
                style={{ margin: 0, fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Medicare
              </h1>
            </div>

            <div className="right-nav-group" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
              <ul
                className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}
              >
                {isMobileMenuOpen && (
                   <div className="mobile-drawer-header">
                      <h2>Medicare<span className="dot">.</span></h2>
                      <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
                   </div>
                )}
                {/* Mobile Search Bar */}
                {isMobileMenuOpen && (
                  <div className="mobile-search-wrapper" style={{ width: '100%', marginBottom: '10px', position: 'relative' }}>
                    <div style={{ display: 'flex', width: '100%' }}>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        placeholder="Search services..."
                        style={{
                          flex: 1,
                          padding: "8px 10px",
                          borderRadius: "6px 0 0 6px",
                          border: "1px solid rgba(0,0,0,0.1)",
                          outline: "none",
                          fontSize: "13px",
                          backgroundColor: "rgba(0,0,0,0.02)",
                          color: "#0f172a"
                        }}
                      />
                      <button
                        onClick={handleSearchButtonClick}
                        style={{
                          padding: "8px 10px",
                          border: "none",
                          borderRadius: "0 6px 6px 0",
                          backgroundColor: "#2074d4",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        🔍
                      </button>
                    </div>
                    {/* Mobile Search Suggestions */}
                    {searchedData.length > 0 && (
                      <ul
                        style={{
                          width: '100%',
                          backgroundColor: "#fff",
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                          marginTop: "5px",
                          padding: 0,
                          listStyle: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          maxHeight: "300px",
                          overflowY: "auto",
                          position: "absolute",
                          zIndex: 2001
                        }}
                      >
                        {searchedData.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => { handleSuggestionClick(item.link); setIsMobileMenuOpen(false); }}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid rgba(0,0,0,0.05)",
                              fontSize: "12px",
                              color: "#475569",
                              fontWeight: 500
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                <li style={{ cursor: "pointer" }} onClick={() => { navigate("/top-doctors"); setIsMobileMenuOpen(false); }}>
                  <span>Find a Doctor</span>
                </li>
                <li style={{ cursor: "pointer" }} onClick={() => { navigate("/get-second-opinion"); setIsMobileMenuOpen(false); }}>
                  <span>Get Second Opinion</span>
                </li>
                <li style={{ cursor: "pointer" }} onClick={() => { navigate("/blogs"); setIsMobileMenuOpen(false); }}>
                  <span>Blogs</span>
                </li>
                <li style={{ cursor: "pointer" }} onClick={() => { setIsContactModalOpen(true); setIsMobileMenuOpen(false); }}>
                  <span>Contact Us</span>
                </li>
                {user && (
                  <li style={{ cursor: "pointer" }} onClick={() => { navigate("/patient/prescriptions"); setIsMobileMenuOpen(false); }}>
                    <span>My Prescriptions</span>
                  </li>
                )}
                {user && (
                  <li
                    style={{ cursor: "pointer", position: "relative", display: "flex", alignItems: "center" }}
                    onClick={() => { navigate("/notifications"); setIsMobileMenuOpen(false); }}
                    title="Notifications"
                  >
                    <span>🔔</span>
                    {notifCount > 0 && (
                      <span style={{
                        position: "absolute", top: -6, right: -10,
                        background: "#ef4444", color: "#fff",
                        fontSize: "0.65rem", fontWeight: 800,
                        width: 18, height: 18, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid #fff",
                        animation: "ntfPulse 2s infinite"
                      }}>{notifCount > 99 ? '99+' : notifCount}</span>
                    )}
                  </li>
                )}
                <li className="mobile-only-link" style={{ cursor: "pointer" }} onClick={() => { navigate("/hospitals"); setIsMobileMenuOpen(false); }}>
                  <span>Our Hospitals</span>
                </li>
                <li className="mobile-only-link" style={{ cursor: "pointer" }} onClick={() => { navigate("/patient/online-consultation"); setIsMobileMenuOpen(false); }}>
                  <span>Online Consultancy</span>
                </li>
                <li className="mobile-only-link" style={{ cursor: "pointer" }} onClick={() => { navigate("/treatments"); setIsMobileMenuOpen(false); }}>
                  <span>Treatments</span>
                </li>
                <li className="mobile-only-link" style={{ cursor: "pointer" }} onClick={() => { navigate("/blood-bank"); setIsMobileMenuOpen(false); }}>
                  <span>Blood Camps and Banks</span>
                </li>
                {!isLoading && (
                  user ? (
                    <li style={{ cursor: "pointer" }} onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                      <span>Logout</span>
                    </li>
                  ) : (
                    <li style={{ cursor: "pointer" }} onClick={() => { navigate("/SignUp"); setIsMobileMenuOpen(false); }}>
                      <span>Sign Up</span>
                    </li>
                  )
                )}
              </ul>

            {/* Hamburger Icon for Mobile */}
            <div className="hamburger-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
              <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
              <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
            </div>
            <div
              className="search-wrapper"
              ref={dropdownRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Search services..."
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "200px",
                }}
              />
              <button
                onClick={handleSearchButtonClick}
                style={{
                  marginLeft: "8px",
                  padding: "0.5rem 0.75rem",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🔍
              </button>
              {searchedData.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    zIndex: 999,
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginTop: "4px",
                    padding: 0,
                    listStyle: "none",
                  }}
                >
                  {searchedData.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.link)}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Secondary Yellow Navbar with original inline styles and toggle display */}
        <div
          className="secondary-navbar"
          style={{
            display: showSecondaryNavbar ? "flex" : "none",
          }}
        >
          <a href="/hospitals" style={{ textDecoration: "none", color: "#222" }}>
            Our Hospitals
          </a>
          <a href="/patient/online-consultation" style={{ textDecoration: "none", color: "#222" }}>
            Online Consultancy
          </a>
          <a href="/treatments" style={{ textDecoration: "none", color: "#222" }}>
            Treatments
          </a>
          <a href="/blood-bank" style={{ textDecoration: "none", color: "#222" }}>
            Blood Camps and Banks
          </a>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </header>
  );
}

export default Header;

