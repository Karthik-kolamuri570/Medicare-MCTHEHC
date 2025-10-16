// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import logo from '../../assets/logo.png'; // make sure this path is correct

// const searchData = [
//   {
//     id: 1,
//     name: "My Appointments",
//     link: "/my-appointments",
//     tags: ["appointments", "my visits", "doctor meetings", "scheduled appointments", "consult history", "patient appointments"]
//   },
//   {
//     id: 2,
//     name: "My Consultations",
//     link: "/my-consultations",
//     tags: ["consultations", "virtual visits", "medical advice", "doctor chat", "my consults", "consult history"]
//   },
//   {
//     id: 3,
//     name: "My Blogs",
//     link: "/my-blogs",
//     tags: ["my articles", "my health blogs", "my stories", "personal blogs", "health writing", "authored posts"]
//   },
//   {
//     id: 4,
//     name: "Get Second Opinion",
//     link: "/second-opinion",
//     tags: ["second opinion", "another diagnosis", "expert review", "confirm diagnosis", "get advice", "reconsult"]
//   },
//   {
//     id: 5,
//     name: "Organize Blood Banks",
//     link: "/organize-blood-bank",
//     tags: ["blood bank", "organize donation", "host blood camp", "manage donors", "blood service", "blood supply"]
//   },
//   {
//     id: 6,
//     name: "Appointment Scheduler",
//     link: "/appointment-scheduler",
//     tags: ["schedule", "doctor slots", "book appointment", "timing", "set appointment", "calendar"]
//   }
// ];


// function DHeader() {
//   const navigate = useNavigate();
//   const [searchInput, setSearchInput] = useState('');
//   const [searchedData, setSearchedData] = useState([]);
//   const dropdownRef = useRef(null);
  
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setSearchedData([]);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSearchInputChange = (value) => {
//     setSearchInput(value);

//     if (value.trim() === '') {
//       setSearchedData([]);
//       return;
//     }

//     const filtered = searchData.filter((item) =>
//       item.name.toLowerCase().includes(value.toLowerCase()) ||
//       item.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
//     );

//     setSearchedData(filtered);
//   };

//   const handleSuggestionClick = (link) => {
//     navigate(link);
//     setSearchInput('');
//     setSearchedData([]);
//   };

//   const handleSearchButtonClick = () => {
//     if (searchedData.length > 0) {
//       navigate(searchedData[0].link);
//       setSearchInput('');
//       setSearchedData([]);
//     } else {
//       alert("No matching service found.");
//     }
//   };

//   return (
//     <header style={{position:'fixed', width: '100%', top: 0, zIndex: 1000}}>
//       <div style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
//       <nav style={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '1rem 2rem',
//         backgroundColor: '#fff'
//       }}>
//         {/* Logo */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <img src={logo} alt="Medicare Logo" style={{ height: '40px' }} />
//           <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/api/doctor/')}>
//             Medicare
//           </h1>
//         </div>

//         {/* Main Nav Links */}
//         <ul style={{
//           display: 'flex',
//           listStyle: 'none',
//           gap: '1.5rem',
//           margin: 0,
//           padding: 0
//         }}>
//           <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/my-appointments")}>My Appointments</li>
//           <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/my-consultations")}>My Consultation</li>
//           <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/doc/blogs")}>My Blogs</li>
//           <li style={{ cursor: 'pointer' }} onClick={() => navigate("/contact")}>My Notification</li>
//           <li style={{ cursor: 'pointer' }} onClick={() => navigate("/SignUp")}>Sign Up</li>
//         </ul>

//         {/* Search Box + Button */}
//         <div ref={dropdownRef}  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//           <input
//             type="text"
//             value={searchInput}
//             onChange={(e) => handleSearchInputChange(e.target.value)}
//             placeholder="Search services..."
//             style={{
//               padding: '0.5rem',
//               borderRadius: '4px',
//               border: '1px solid #ccc',
//               width: '200px'
//             }}
//           />
//           <button
//             onClick={handleSearchButtonClick}
//             style={{
//               marginLeft: '8px',
//               padding: '0.5rem 0.75rem',
//               border: 'none',
//               borderRadius: '4px',
//               backgroundColor: '#007BFF',
//               color: '#fff',
//               cursor: 'pointer',
//               fontWeight: 'bold'
//             }}
//           >
//             🔍
//           </button>

//           {/* Dropdown */}
//           {searchedData.length > 0 && (
//             <ul style={{
//               position: 'absolute',
//               top: '100%',
//               left: 0,
//               right: 0,
//               backgroundColor: '#fff',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               zIndex: 999,
//               maxHeight: '200px',
//               overflowY: 'auto',
//               marginTop: '4px',
//               padding: '0'
//             }}>
//               {searchedData.map(item => (
//                 <li key={item.id}
//                     onClick={() => handleSuggestionClick(item.link)}
//                     style={{
//                       padding: '10px',
//                       cursor: 'pointer',
//                       borderBottom: '1px solid #eee',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
//                 >
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </nav>
//       </div>


//     </header>
//   );
// }

// export default DHeader;





import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png'; // make sure this path is correct

const searchData = [
  {
    id: 1,
    name: "My Appointments",
    link: "/api/doctor/my-appointments",
    tags: ["appointments", "my visits", "doctor meetings", "scheduled appointments", "consult history", "patient appointments"]
  },
  {
    id: 2,
    name: "My Consultations",
    link: "/api/doctor/my-consultations",
    tags: ["consultations", "virtual visits", "medical advice", "doctor chat", "my consults", "consult history"]
  },
  {
    id: 3,
    name: "My Blogs",
    link: "/api/doctor/doc/blogs",
    tags: ["my articles", "my health blogs", "my stories", "personal blogs", "health writing", "authored posts"]
  },
  {
    id: 4,
    name: "Get Second Opinion",
    link: "/api/doctor/second-opinion",
    tags: ["second opinion", "another diagnosis", "expert review", "confirm diagnosis", "get advice", "reconsult"]
  },
  {
    id: 5,
    name: "Organize Blood Camps",
    link: "/api/doctor/blood-camp/admin",
    tags: ["blood bank", "organize donation", "host blood camp", "manage donors", "blood service", "blood supply"]
  },
  {
    id: 6,
    name: "Appointment Scheduler",
    link: "/appointment-scheduler",
    tags: ["schedule", "doctor slots", "book appointment", "timing", "set appointment", "calendar"]
  }
];

function DHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkDoctorLogin = async () => {
      try {
        const response = await fetch("http://localhost:1600/api/doctor/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (data.success && data.data) setDoctor(data.data);
        else setDoctor(null);
      } catch {
        setDoctor(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkDoctorLogin();
  }, []);

  useEffect(() => {
    setSearchedData([]);
    setSearchInput('');
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchedData([]);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    if (!value.trim()) {
      setSearchedData([]);
      return;
    }
    const filtered = searchData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setSearchedData(filtered);
  };

  const handleSuggestionSelect = (link) => {
    navigate(link);
    setSearchInput('');
    setSearchedData([]);
  };

  const handleSearchSubmit = () => {
    if (searchedData.length > 0) {
      navigate(searchedData[0].link);
      setSearchInput('');
      setSearchedData([]);
    } else alert("No matching service found.");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:1600/api/doctor/logout/", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        setDoctor(null);
        // Clear tokens if applicable
        // Navigate to login
        navigate("/api/doctor/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header style={{ position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
      <div style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          backgroundColor: '#fff'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Medicare Logo" style={{ height: '40px' }} />
            <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/api/doctor')}>
              Medicare
            </h1>
          </div>

          {/* Navigation Links */}
          <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', margin: 0, padding: 0 }}>
            
            <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/my-appointments")}>My Appointments</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/my-consultations")}>My Consultations</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/doc/blogs")}>My Blogs</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/blood-camp/admin")}>Blood Camp</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate("/contact")}>Notifications</li>
            {!isLoading && (doctor ?
              <li style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</li> :
              <li style={{ cursor: 'pointer' }} onClick={() => navigate("/api/doctor/login")}>Login</li>)}
          </ul>

          {/* Search Box */}
          <div ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search services..."
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '200px' }}
              aria-label="Search services"
              aria-autocomplete="list"
            />
            <button
              onClick={handleSearchSubmit}
              style={{ marginLeft: '8px', padding: '0.5rem 0.75rem', border: 'none', borderRadius: '4px', backgroundColor: '#007BFF', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              aria-label="Submit search"
            >
              🔍
            </button>
            {searchedData.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                zIndex: 999,
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '4px',
                padding: 0,
                listStyleType: 'none'
              }} role="listbox" aria-label="Search suggestions">
                {searchedData.map(item => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionSelect(item.link)}
                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}
                    role="option"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default DHeader;
