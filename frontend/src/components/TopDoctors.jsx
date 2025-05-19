// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import "../styles/TopDoctors.css";
// import logo from "../assets/logo.png";
// import axios from 'axios';

// import doctor1 from "../assets/doctor1.png";
// import doctor2 from "../assets/doctor2.png";
// import Bookanappointment from './Bookanappointment';

// function TopDoctors() {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);  // Initial state is an empty array
//   const [loading, setLoading] = useState(true);  // Loading state
//   const [error, setError] = useState(null);  // Error state
//   const [searchInput, setSearchInput] = useState("");  // State for search input
//   // const [searchedData, setSearchedData] = useState([]);  // State for filtered data
  
//   // Fetch data from the API
//   const fetchData = async () => {
//     try {
//       setLoading(true);  // Set loading to true while fetching data
//       console.log("Fetching data...");  // Log when fetch starts

//       // Make the API request using Axios
//       const response = await axios.get("http://localhost:1600/api/doctor/");
      
//       console.log('Fetched Data:', response.data.data);  
//       // Log the fetched data to check its structure
//       const filteredDoctors = response.data.data.filter((doc) =>
//         doc.specialization.toLowerCase().includes(searchInput.toLowerCase())
//       );  
//       const resultedData=(filteredDoctors.length > 0 ? filteredDoctors : data)

//       // Access the array within response.data.data
//       if (resultedData.length > 0) {
//         setData(resultedData);  
//       } else {
//         console.error("Data is not an array:", response.data);  // Log an error if data is not an array
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);  // Log any error during fetch
//       setError(error);  // Set error state
//     } finally {
//       setLoading(false);  // Set loading to false after the fetch is complete
//     }
//   };

//   // Trigger fetchData when the component mounts
//   useEffect(() => {
//     console.log("Component mounted, fetching data...");  // Log when the component mounts
//     fetchData();
//   }, []);  // Empty dependency array ensures it runs only once on mount

//   console.log('State data:', data);

//   return (
//     <div>
      
    
//       {/* Our Top Doctors Section */}
//       <section className="top-doctors-section">
//         <div className="top-doctors-container">
//           <div className='top-doctors-heading-bar'>
//             <h1 className="top-doctors-heading">Our Top Doctors</h1>
//             {/* Search Bar to search the Doctors based on their Specialization of the doctor */}
//             <div className="search-container">
//               <input type="text" className='search-bar'  onChange={(e) => setSearchInput(e.target.value)} placeholder="Search Doctors" />
//               <button>🔍</button>
//             </div>
//           </div>

//           <div className="doctors-grid">
//             {loading && <p>Loading...</p>}

//             {/* Error handling */}
//             {error && <p>Error fetching data: {error.message}</p>}

//             {/* Display data if available */}
//             {data.length > 0 && !loading ? (
//               data.map((doc, index) => (
//                 <div key={index} className="doctor-card">
//                   <div>
//                     <h3>Name:{doc.name}</h3>
//                     <p>Specialization:<strong>{doc.specialization}</strong></p>
//                     <p>Experience:<strong>{doc.experience} </strong>years</p>
//                   </div>
//                   <button 
//                     className="appointment-btn" 
//                     onClick={() => navigate("/book-appointment")}>
//                     Book an Appointment
//                   </button>
//                 </div>
//               ))
//             ) : (
//               !loading && <p>No doctors available</p>  // Display if data is empty after loading
//             )}
//           </div>
//         </div>
//       </section>

      
//       {/* <Bookanappointment data/> */}
//     </div>
    
//   );
// }

// export default TopDoctors;







import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/TopDoctors.css";
import axios from 'axios';

function TopDoctors() {
  const navigate = useNavigate();

  const [allDoctors, setAllDoctors] = useState([]);  // Full unfiltered list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");  // Search input

  // Fetch doctors from API once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:1600/api/doctor/");
        if (Array.isArray(response.data.data)) {
          setAllDoctors(response.data.data);
        } else {
          throw new Error("Data format invalid");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

     fetchData(); //it is called again You want to re-fetch the data after some action, like:
    //                         A new doctor is added.
    //                         A doctor’s details were updated.
    //                         A user clears the search input and you want a fresh list from the backend.
    //                         You add a "Refresh" button.
  }, []);

  // Filter doctors based on specialization by using searchInput 
  const filteredDoctors = allDoctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(searchInput.toLowerCase())
  );
  // 1.At fetch time, searchInput is still an empty string (""), and it never updates the state after typing because fetchData() runs only once!
  // 2.When you check if a string "includes" an empty string, it always returns true. 
  //3. Every string contains the empty string at every position — that’s just how .includes() is designed.
  //By the 2nd point , we are rendering the ""allData"" indirectly bcz  "specialization.includes("") is always true". so we will render all the doctor so no need to do it again.



  return (
    <div>
      <section className="top-doctors-section">
        <div className="top-doctors-container">
          <div className='top-doctors-heading-bar'>
            <h1 className="top-doctors-heading">Our Top Doctors</h1>
            <div className="search-container">
              <input
                type="text"
                className='search-bar'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Doctors"
              />
              <button>🔍</button>
            </div>
          </div>

          <div className="doctors-grid">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            {!loading && filteredDoctors.length === 0 && (
              <p>No doctors found matching your search.</p>
            )}

            {!loading && filteredDoctors.map((doc, index) => (
              <div key={index} className="doctor-card">
                <div>
                  <h3>Name: {doc.name}</h3>
                  <p>Specialization: <strong>{doc.specialization}</strong></p>
                  <p>Experience: <strong>{doc.experience}</strong> years</p>
                </div>
                <button
                  className="appointment-btn"
                  onClick={() => navigate("/book-appointment")}
                >
                  Book an Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default TopDoctors;
