import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // make sure this path is correct

const searchData = [
  {
    id: 1,
    name: "My Appointments",
    link: "/my-appointments",
    tags: ["appointments", "my visits", "doctor meetings", "scheduled appointments", "consult history", "patient appointments"]
  },
  {
    id: 2,
    name: "My Consultations",
    link: "/my-consultations",
    tags: ["consultations", "virtual visits", "medical advice", "doctor chat", "my consults", "consult history"]
  },
  {
    id: 3,
    name: "My Blogs",
    link: "/my-blogs",
    tags: ["my articles", "my health blogs", "my stories", "personal blogs", "health writing", "authored posts"]
  },
  {
    id: 4,
    name: "Get Second Opinion",
    link: "/second-opinion",
    tags: ["second opinion", "another diagnosis", "expert review", "confirm diagnosis", "get advice", "reconsult"]
  },
  {
    id: 5,
    name: "Organize Blood Banks",
    link: "/organize-blood-bank",
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
  const [searchInput, setSearchInput] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchedData([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);

    if (value.trim() === '') {
      setSearchedData([]);
      return;
    }

    const filtered = searchData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
    );

    setSearchedData(filtered);
  };

  const handleSuggestionClick = (link) => {
    navigate(link);
    setSearchInput('');
    setSearchedData([]);
  };

  const handleSearchButtonClick = () => {
    if (searchedData.length > 0) {
      navigate(searchedData[0].link);
      setSearchInput('');
      setSearchedData([]);
    } else {
      alert("No matching service found.");
    }
  };

  return (
    <header >
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
          <h1 style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Medicare
          </h1>
        </div>

        {/* Main Nav Links */}
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '1.5rem',
          margin: 0,
          padding: 0
        }}>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate("/my-appointments")}>My Appointments</li>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate("/my-consultation")}>My Consultation</li>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate("/my-blogs")}>My Blogs</li>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate("/contact")}>My Notification</li>
          <li style={{ cursor: 'pointer' }} onClick={() => navigate("/SignUp")}>Sign Up</li>
        </ul>

        {/* Search Box + Button */}
        <div ref={dropdownRef}  style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            placeholder="Search services..."
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
          <button
            onClick={handleSearchButtonClick}
            style={{
              marginLeft: '8px',
              padding: '0.5rem 0.75rem',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#007BFF',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔍
          </button>

          {/* Dropdown */}
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
              padding: '0'
            }}>
              {searchedData.map(item => (
                <li key={item.id}
                    onClick={() => handleSuggestionClick(item.link)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
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
