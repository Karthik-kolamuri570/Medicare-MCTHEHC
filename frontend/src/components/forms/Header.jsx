

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

const searchData = [
  {
    id: 1,
    name: "Book an Appointment",
    link: "/appointments",
    tags: ["appointment", "book", "consultation", "schedule", "meeting", "doctor visit"]
  },
  {
    id: 2,
    name: "Find a Doctor",
    link: "/find-doctor",
    tags: ["doctor", "physician", "specialist", "search", "consult", "near me"]
  },
  {
    id: 3,
    name: "Get Second Opinion",
    link: "/second-opinion",
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
    link: "/online-consultation",
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
    link: "/blood-services",
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
  }
];

function Header() {
  const [searchInput, setSearchInput] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [showSecondaryNavbar, setShowSecondaryNavbar] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check user login status
  const checkUserLogin = async () => {
    try {
      const response = await fetch("http://localhost:1600/api/patient/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser(data.data);
      } else {
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

  // Periodic check every 30 seconds to ensure auth status is current
  useEffect(() => {
    const interval = setInterval(() => {
      checkUserLogin();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
      const response = await fetch("http://localhost:1600/api/patient/logout/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        setUser(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        navigate("/api/patient/login");
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
        <div style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 2rem",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={logo} alt="Medicare Logo" style={{ height: "40px" }} />
              <h1
                style={{ margin: 0, fontSize: "1.5rem", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Medicare
              </h1>
            </div>
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                gap: "1.5rem",
                marginLeft: 450,
                padding: 0,
              }}
            >
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/top-doctors")}>
                Find a Doctor
              </li>
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/api/get-second-opinion")}>
                Get Second Opinion
              </li>
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/api/blogs")}>
                Blogs
              </li>
              <li style={{ cursor: "pointer" }} onClick={() => navigate("/contact")}>
                Contact Us
              </li>
              {!isLoading && (
                user ? (
                  <li style={{ cursor: "pointer" }} onClick={handleLogout}>
                    Logout
                  </li>
                ) : (
                  <li style={{ cursor: "pointer" }} onClick={() => navigate("/SignUp")}>
                    Sign Up
                  </li>
                )
              )}
            </ul>
            <div
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
          </nav>
        </div>

        {/* Secondary Yellow Navbar with original inline styles and toggle display */}
        <div
          className="secondary-navbar"
          style={{
            backgroundColor: "#FFD600",
            display: showSecondaryNavbar ? "flex" : "none",
            // gap: "2rem",
            // padding: "0.7rem 2rem",
            // fontWeight: "bold",
            // fontSize: "1rem",
          }}
        >
          <a href="#" style={{ textDecoration: "none", color: "#222" }}>
            Our Hospitals
          </a>
          <a href="/api/patient/online-consultation" style={{ textDecoration: "none", color: "#222" }}>
            Online Consultancy
          </a>
          <a href="#" style={{ textDecoration: "none", color: "#222" }}>
            Treatments
          </a>
          <a href="/api/blood-bank" style={{ textDecoration: "none", color: "#222" }}>
            Blood Camps and Banks
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;

