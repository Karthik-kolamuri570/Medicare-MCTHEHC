import { useState, useEffect } from 'react';
import axios from 'axios';

function State() {
  const [data, setData] = useState([]);  // Initial state is an empty array
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);  // Set loading to true while fetching data
      console.log("Fetching data...");  // Log when fetch starts

      // Make the API request using Axios
      const response = await axios.get("http://localhost:1600/api/doctor/");
      
      console.log('Fetched Data:', response.data);  // Log the fetched data to check its structure

      // Access the array within response.data.data
      if (Array.isArray(response.data.data)) {
        setData(response.data.data);  // Set state with the fetched data if it's an array
      } else {
        console.error("Data is not an array:", response.data);  // Log an error if data is not an array
      }
    } catch (error) {
      console.error("Error fetching data:", error);  // Log any error during fetch
      setError(error);  // Set error state
    } finally {
      setLoading(false);  // Set loading to false after the fetch is complete
    }
  };

  // Trigger fetchData when the component mounts
  useEffect(() => {
    console.log("Component mounted, fetching data...");  // Log when the component mounts
    fetchData();
  }, []);  // Empty dependency array ensures it runs only once on mount

  console.log('State data:', data);  // Log the current state data

  return (
    <div>
      <h1>Doctor List</h1>

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error handling */}
      {error && <p>Error fetching data: {error.message}</p>}

      {/* Display data if available */}
      {data.length > 0 && !loading ? (
        data.map((doc, index) => (
          <div key={index}>
            <h2>{doc.name}</h2>
            {/* <p>{doc.specialization}</p> */}
            {/* <p>{doc.experience} years of experience</p> */}
          </div>
        ))
      ) : (
        !loading && <p>No doctors available</p>  // Display if data is empty after loading
      )}
    </div>
  );
}

export default State;
