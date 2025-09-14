

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png"; // make sure this path is correct

// const searchData = [
//   {
//     id: 1,
//     name: "Book an Appointment",
//     link: "/appointments",
//     tags: [
//       "appointment",
//       "book",
//       "consultation",
//       "schedule",
//       "meeting",
//       "doctor visit",
//     ],
//   },
//   {
//     id: 2,
//     name: "Find a Doctor",
//     link: "/find-doctor",
//     tags: ["doctor", "physician", "specialist", "search", "consult", "near me"],
//   },
//   {
//     id: 3,
//     name: "Get Second Opinion",
//     link: "/second-opinion",
//     tags: [
//       "second opinion",
//       "consultation",
//       "diagnosis",
//       "expert advice",
//       "review",
//       "double check",
//     ],
//   },
//   {
//     id: 4,
//     name: "Our Hospitals",
//     link: "/hospitals",
//     tags: [
//       "hospital",
//       "locations",
//       "branches",
//       "facilities",
//       "medical center",
//       "infrastructure",
//     ],
//   },
//   {
//     id: 5,
//     name: "Online Consultation",
//     link: "/online-consultation",
//     tags: ["online", "consult", "virtual", "doctor", "chat", "telemedicine"],
//   },
//   {
//     id: 6,
//     name: "Treatments",
//     link: "/treatments",
//     tags: [
//       "treatments",
//       "procedures",
//       "therapies",
//       "care",
//       "services",
//       "surgeries",
//     ],
//   },
//   {
//     id: 7,
//     name: "Blood Camps and Banks",
//     link: "/blood-services",
//     tags: [
//       "blood",
//       "donation",
//       "camp",
//       "bank",
//       "availability",
//       "blood group",
//       "save life",
//     ],
//   },
//   {
//     id: 8,
//     name: "Blogs",
//     link: "/api/blogs",
//     tags: ["blog", "articles", "health tips", "news", "updates", "stories"],
//   },
//   {
//     id: 9,
//     name: "Contact Us",
//     link: "/contact",
//     tags: [
//       "contact",
//       "help",
//       "support",
//       "reach out",
//       "email",
//       "phone",
//       "address",
//     ],
//   },
// ];

// function Header() {
//   const navigate = useNavigate();
//   const [searchInput, setSearchInput] = useState("");
//   const [searchedData, setSearchedData] = useState([]);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setSearchedData([]);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
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

//   const handleSuggestionClick = (link) => {
//     navigate(link);
//     setSearchInput("");
//     setSearchedData([]);
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

//   return (
//     <header style={{marginBottom: 140}}>
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
//             {/* Logo */}
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <img src={logo} alt="Medicare Logo" style={{ height: "40px" }} />
//               <h1
//                 style={{ margin: 0, fontSize: "1.5rem", cursor: "pointer" }}
//                 onClick={() => navigate("/")}
//               >
//                 Medicare
//               </h1>
//             </div>

//             {/* Main Nav Links */}
//             <ul
//               style={{
//                 display: "flex",
//                 listStyle: "none",
//                 gap: "1.5rem",
//                 marginLeft: 450,
//                 padding: 0,
//               }}
//             >
//               <li
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/top-doctors")}
//               >
//                 Find a Doctor
//               </li>
//               <li
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/api/get-second-opinion")}
//               >
//                 Get Second Opinion
//               </li>
//               <li
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/api/blogs")}
//               >
//                 Blogs
//               </li>
//               <li
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/contact")}
//               >
//                 Contact Us
//               </li>
//               <li
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/SignUp")}
//               >
//                 Sign Up
//               </li>
//             </ul>

//             {/* Search Box + Button */}
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

//               {/* Dropdown */}
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
//                     padding: "0",
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
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#f0f0f0")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.backgroundColor = "#fff")
//                       }
//                     >
//                       {item.name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </nav>
//         </div>

//         {/* Secondary Yellow Navbar */}
//         <div className="secondary-navbar">
//           <a href="#">Our Hospitals</a>
//           <a href="/api/patient/online-consultation">Online Consultancy</a>
//           <a href="#">Treatments</a>
//           <a href="/api/blood-bank">Blood Camps and Banks</a>
//         </div>
//       </div>
//     </header>
//   );
// }
// export default Header;

































import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // make sure this path is correct

const searchData = [
  {
    id: 1,
    name: "Book an Appointment",
    link: "/appointments",
    tags: [
      "appointment",
      "book",
      "consultation",
      "schedule",
      "meeting",
      "doctor visit",
    ],
  },
  {
    id: 2,
    name: "Find a Doctor",
    link: "/find-doctor",
    tags: ["doctor", "physician", "specialist", "search", "consult", "near me"],
  },
  {
    id: 3,
    name: "Get Second Opinion",
    link: "/second-opinion",
    tags: [
      "second opinion",
      "consultation",
      "diagnosis",
      "expert advice",
      "review",
      "double check",
    ],
  },
  {
    id: 4,
    name: "Our Hospitals",
    link: "/hospitals",
    tags: [
      "hospital",
      "locations",
      "branches",
      "facilities",
      "medical center",
      "infrastructure",
    ],
  },
  {
    id: 5,
    name: "Online Consultation",
    link: "/online-consultation",
    tags: ["online", "consult", "virtual", "doctor", "chat", "telemedicine"],
  },
  {
    id: 6,
    name: "Treatments",
    link: "/treatments",
    tags: [
      "treatments",
      "procedures",
      "therapies",
      "care",
      "services",
      "surgeries",
    ],
  },
  {
    id: 7,
    name: "Blood Camps and Banks",
    link: "/blood-services",
    tags: [
      "blood",
      "donation",
      "camp",
      "bank",
      "availability",
      "blood group",
      "save life",
    ],
  },
  {
    id: 8,
    name: "Blogs",
    link: "/api/blogs",
    tags: ["blog", "articles", "health tips", "news", "updates", "stories"],
  },
  {
    id: 9,
    name: "Contact Us",
    link: "/contact",
    tags: [
      "contact",
      "help",
      "support",
      "reach out",
      "email",
      "phone",
      "address",
    ],
  },
];

function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const dropdownRef = useRef(null);

  // Visibility state for secondary navbar
  const [showSecondaryNavbar, setShowSecondaryNavbar] = useState(true);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchedData([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const scrollThreshold = 300;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > scrollThreshold) {
            setShowSecondaryNavbar(false);
          } else {
            setShowSecondaryNavbar(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
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

  const handleSuggestionClick = (link) => {
    navigate(link);
    setSearchInput("");
    setSearchedData([]);
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
  const secondaryNavbarHeight = 48; 

  return (
    <header style={{ marginBottom: showSecondaryNavbar ? secondaryNavbarHeight : 0, position: "fixed", width: "100%", top: 0, zIndex: 1000 }}>
      <div >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 2rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="Medicare Logo" style={{ height: "40px" }} />
            <h1 style={{ margin: 0, fontSize: "1.5rem", cursor: "pointer" }} onClick={() => navigate("/")}>
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
            <li style={{ cursor: "pointer" }} onClick={() => navigate("/SignUp")}>
              Sign Up
            </li>
          </ul>
          <div ref={dropdownRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Search services..."
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }}
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
                  padding: "0",
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

        {/* Secondary Yellow Navbar - no style changes, simple fade with inline style */}
        <div
          className="secondary-navbar"
          style={{
            transition: "opacity 0.3s ease",
            opacity: showSecondaryNavbar ? 1 : 0,
            pointerEvents: showSecondaryNavbar ? "auto" : "none",
            height: 48,
          }}
        >
          <a href="#">Our Hospitals</a>
          <a href="/api/patient/online-consultation">Online Consultancy</a>
          <a href="#">Treatments</a>
          <a href="/api/blood-bank">Blood Camps and Banks</a>
        </div>
      </div>
    </header>
  );
}

export default Header;