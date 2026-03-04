
// Without Paginaton...

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/MedicareIndex.css";
// import bookanappointment from "../assets/bookanappointment.png";
// import searchdoctor from "../assets/searchdoctor.png";
// import Hospital from "../assets/Hospital.png";
// import specialities from "../assets/Specialities.png";
// import TopDoctors from "./TopDoctors"; // updated usage to accept doctor list & pagination props
// import Loader from "./ui/Loader";

// function MedicareIndex() {
//   const [loading, setLoading] = useState(true);

//   // Blogs state & pagination
//   const [blogData, setBlogData] = useState([]);
//   const [blogPage, setBlogPage] = useState(1);
//   const blogsPerPage = 4;

//   // Doctors state & pagination
//   const [doctorData, setDoctorData] = useState([]);
//   const [doctorPage, setDoctorPage] = useState(1);
//   const doctorsPerPage = 4;

//   // Fetch blog and doctor data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [blogsResp, doctorsResp] = await Promise.all([
//           axios.get("/api/blogs/blogs"),
//           axios.get("/api/doctor/") // example endpoint for top doctors
//         ]);
//         setBlogData(blogsResp.data || []);
//         setDoctorData(doctorsResp.data || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <Loader />;
//   }

//   // Pagination logic
//   const totalBlogs = blogData.blogs ? blogData.blogs.length : 0;
//   const totalBlogPages = Math.ceil(totalBlogs / blogsPerPage);
//   const blogStartIndex = (blogPage - 1) * blogsPerPage;
//   const currentBlogs = blogData.blogs ? blogData.blogs.slice(blogStartIndex, blogStartIndex + blogsPerPage) : [];

//   const totalDoctors = doctorData.doctors ? doctorData.doctors.length : 0;
//   const totalDoctorPages = Math.ceil(totalDoctors / doctorsPerPage);
//   const doctorStartIndex = (doctorPage - 1) * doctorsPerPage;
//   const currentDoctors = doctorData.doctors ? doctorData.doctors.slice(doctorStartIndex, doctorStartIndex + doctorsPerPage) : [];

//   const handlePageChange = (setter, totalPages, page) => {
//     if (page < 1 || page > totalPages) return;
//     setter(page);
//   };

//   // Pagination button styles (shared)
//   const paginationStyle = {
//     display: "flex",
//     justifyContent: "center",
//     marginTop: "20px",
//     gap: "8px",
//   };
//   const btnStyle = {
//     padding: "8px 14px",
//     cursor: "pointer",
//     borderRadius: "6px",
//     border: "1.5px solid #ddd",
//     backgroundColor: "#fff",
//     color: "#333",
//     transition: "background-color 0.3s, color 0.3s",
//     minWidth: "40px",
//     fontWeight: "500",
//   };
//   const activeBtnStyle = {
//     ...btnStyle,
//     fontWeight: "700",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     borderColor: "#007bff",
//   };
//   const disabledBtnStyle = {
//     ...btnStyle,
//     cursor: "not-allowed",
//     opacity: 0.5,
//   };

//   return (
//     <div>
//       <div>
//         {/* Book an Appointment */}
//         <div className="book-appointment-container">
//           <div className="book-appointment-text">
//             <h1>Booking an Appointment</h1>
//             <p>
//               Easily schedule an appointment with top healthcare professionals
//               using our Medicare platform. Whether you need a routine check-up,
//               specialist consultation, or second opinion, our seamless booking
//               system ensures you get the medical care you need at your convenience.
//             </p>
//           </div>
//           <div className="book-appointment-image">
//             <img src={bookanappointment} alt="Booking an Appointment" />
//           </div>
//         </div>

//         {/* Find a Hospital */}
//         <div className="find-hospital-container">
//           <div className="find-hospital-image">
//             <img src={Hospital} alt="Find a Hospital" />
//           </div>
//           <div className="find-hospital-text">
//             <h1>Find a Hospital</h1>
//             <p>
//               Easily locate the nearest hospitals with our Medicare platform.
//               Search by location and specialty, access emergency services, and
//               check hospital details and ratings. Find the right hospital for your needs quickly and efficiently!
//             </p>
//           </div>
//         </div>

//         {/* Specialities */}
//         <div className="specialities-container">
//           <div className="specialities-text">
//             <h1>Specialities We Offer</h1>
//             <p>
//               Our Medicare platform connects you with top specialists in cardiology for heart health,
//               neurology for brain and nerve care, orthopedics for bones and joints, and pediatrics for child healthcare.
//               We also provide expert consultations in dermatology for skin and hair care, gynecology for women's health,
//               oncology for cancer treatment, psychiatry for mental health support, gastroenterology for digestive issues,
//               and endocrinology for hormonal disorders. Find the right specialist with ease and get the care you need.
//             </p>
//           </div>
//           <div className="specialities-image">
//             <img src={specialities} alt="Specialities" />
//           </div>
//         </div>

//         {/* Find a Doctor */}
//         <div className="find-a-doctor-container">
//           <div className="find-a-doctor-image">
//             <img src={searchdoctor} alt="Find a Doctor" />
//           </div>
//           <div className="find-a-doctor-text">
//             <h1>Find a Doctor</h1>
//             <p>
//               Our Medicare platform helps you connect with qualified doctors across multiple specialties.
//               Search by name, specialty, or location to find the right expert for your health needs.
//               View doctor profiles, check patient reviews, and book appointments with ease.
//               Whether you need a general consultation or a specialist opinion, we make healthcare accessible and convenient for you.
//             </p>
//           </div>
//         </div>

//         {/* Blogs */}
//         <section className="blogs-section">
//           <div className="blogs-container">
//             <h1>Blogs</h1>
//             <div className="blogs-grid">
//               {currentBlogs.map((blog, index) => (
//                 <div key={blog._id || index} className="blog-card">
//                   <img src={blog.image_url} alt="blogpic" />
//                   <h3>{blog.title}</h3>
//                   <p>{blog.description}</p>
//                   <button>
//                     <a href={`/api/blog/${blog._id}`}>Read More</a>
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {totalBlogPages > 1 && (
//               <div style={paginationStyle}>
//                 <button
//                   onClick={() => handlePageChange(setBlogPage, totalBlogPages, blogPage - 1)}
//                   disabled={blogPage === 1}
//                   style={blogPage === 1 ? disabledBtnStyle : btnStyle}
//                 >
//                   Prev
//                 </button>
//                 {[...Array(totalBlogPages)].map((_, i) => {
//                   const pageNum = i + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(setBlogPage, totalBlogPages, pageNum)}
//                       style={blogPage === pageNum ? activeBtnStyle : btnStyle}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => handlePageChange(setBlogPage, totalBlogPages, blogPage + 1)}
//                   disabled={blogPage === totalBlogPages}
//                   style={blogPage === totalBlogPages ? disabledBtnStyle : btnStyle}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Top Doctors */}
//         <section className="top-doctors-section">
//           <div className="top-doctors-container">
//             <h1>Top Doctors</h1>
//             <div className="doctors-grid">
//               {currentDoctors.map((doctor, index) => (
//                 <TopDoctors key={doctor._id || index} doctor={doctor} />
//               ))}
//             </div>
//             {totalDoctorPages > 1 && (
//               <div style={paginationStyle}>
//                 <button
//                   onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, doctorPage - 1)}
//                   disabled={doctorPage === 1}
//                   style={doctorPage === 1 ? disabledBtnStyle : btnStyle}
//                 >
//                   Prev
//                 </button>
//                 {[...Array(totalDoctorPages)].map((_, i) => {
//                   const pageNum = i + 1;
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, pageNum)}
//                       style={doctorPage === pageNum ? activeBtnStyle : btnStyle}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, doctorPage + 1)}
//                   disabled={doctorPage === totalDoctorPages}
//                   style={doctorPage === totalDoctorPages ? disabledBtnStyle : btnStyle}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

// export default MedicareIndex;




// With Pagination


import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "../styles/MedicareIndex.css";
import bookanappointment from "../assets/bookanappointment.png";
import searchdoctor from "../assets/searchdoctor.png";
import Hospital from "../assets/Hospital.png";
import specialities from "../assets/Specialities.png";
import Loader from "./ui/Loader";
import defaultDoctorImage from "../assets/Anu.jpg"
import { useNavigate } from "react-router-dom";

// Updated DoctorCard to render full profile details with fallback image and clear styling
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <div className="modern-doctor-card">
      <img
        src={doctor.profileImage || defaultDoctorImage}
        alt={doctor.name}
        onError={(e) => { e.target.src = defaultDoctorImage; }}
      />
      <h3>{doctor.name}</h3>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Experience:</strong> {doctor.experience} years</p>
      <p><strong>Hospital:</strong> {doctor.hospital}</p>
      <p><strong>Consultation Fee:</strong> ₹{doctor.feePerConsultation}</p>

      <div className="modern-doctor-rating">
        <span className="star-icon">⭐</span>
        <span className="rating-value">{doctor.rating ? doctor.rating.toFixed(1) : "New"}</span>
        <span className="total-ratings">({doctor.totalRatings || 0} reviews)</span>
      </div>
      
      <button
        className="modern-doctor-btn"
        onClick={() => navigate(`/book-appointment/${doctor._id}`)}
      >
        Book an Appointment
      </button>
    </div>
  );
};


function MedicareIndex() {
  const [loading, setLoading] = useState(true);

  // Blogs state & pagination
  const [blogData, setBlogData] = useState([]);
  const [blogPage, setBlogPage] = useState(1);
  const blogsPerPage = 4;

  // Doctors state & pagination
  const [doctorData, setDoctorData] = useState([]);
  const [doctorPage, setDoctorPage] = useState(1);
  const doctorsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResp, doctorsResp] = await Promise.all([
          api.get("/api/blogs/blogs"),
          api.get("/api/doctor"),
        ]);
        setBlogData(blogsResp.data || []);
        setDoctorData(doctorsResp.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Doctors updated:", doctorData);
  }, [doctorData]);

  if (loading) {
    return <Loader />;
  }

  // Pagination logic for blogs
  const totalBlogs = blogData.blogs ? blogData.blogs.length : 0;
  const totalBlogPages = Math.ceil(totalBlogs / blogsPerPage);
  const blogStartIndex = (blogPage - 1) * blogsPerPage;
  const currentBlogs = blogData.blogs ? blogData.blogs.slice(blogStartIndex, blogStartIndex + blogsPerPage) : [];

  // Pagination logic for doctors
  const totalDoctors = doctorData.length;
  const totalDoctorPages = Math.ceil(totalDoctors / doctorsPerPage);
  const doctorStartIndex = (doctorPage - 1) * doctorsPerPage;
  const currentDoctors = doctorData.slice(doctorStartIndex, doctorStartIndex + doctorsPerPage);

  const handlePageChange = (setter, totalPages, page) => {
    if (page < 1 || page > totalPages) return;
    setter(page);
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  };

  const btnStyle = {
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: 6,
    border: "1.5px solid #ddd",
    backgroundColor: "#fff",
    color: "#333",
    minWidth: 40,
    fontWeight: 500,
    transition: "background-color 0.3s, color 0.3s",
  };

  const activeBtnStyle = {
    ...btnStyle,
    fontWeight: 700,
    backgroundColor: "#007bff",
    color: "#fff",
    borderColor: "#007bff",
  };

  const disabledBtnStyle = {
    ...btnStyle,
    cursor: "not-allowed",
    opacity: 0.5,
  };

  return (
    <div style={{ marginTop: '130px', paddingBottom: '40px' }}>
      <div>
        {/* Book an Appointment (Hero Section) */}
        <div className="hero-container">
          <div className="hero-text-content">
            <h1>Booking an <span className="highlight">Appointment</span></h1>
            <p>
              Easily schedule an appointment with top healthcare professionals
              using our Medicare platform. Whether you need a routine check-up,
              specialist consultation, or second opinion, our seamless booking
              system ensures you get the medical care you need at your convenience.
            </p>
          </div>
          <div className="hero-image-content">
            <img src={bookanappointment} alt="Booking an Appointment" />
          </div>
        </div>

        {/* Find a Hospital */}
        <div className="home-section-container row-reverse alt-bg">
          <div className="section-text-content">
            <h1>Find a <span className="highlight">Hospital</span></h1>
            <p>
              Easily locate the nearest hospitals with our Medicare platform.
              Search by location and specialty, access emergency services, and
              check hospital details and ratings. Find the right hospital for your needs quickly and efficiently!
            </p>
          </div>
          <div className="section-image-content">
            <img src={Hospital} alt="Find a Hospital" />
          </div>
        </div>

        {/* Specialities */}
        <div className="home-section-container">
          <div className="section-text-content">
            <h1>Specialities <span className="highlight">We Offer</span></h1>
            <p>
              Our Medicare platform connects you with top specialists in cardiology for heart health,
              neurology for brain and nerve care, orthopedics for bones and joints, and pediatrics for child healthcare.
              We also provide expert consultations in dermatology, gynecology,
              oncology, psychiatry, gastroenterology,
              and endocrinology. Find the right specialist with ease and get the care you need.
            </p>
          </div>
          <div className="section-image-content">
            <img src={specialities} alt="Specialities" />
          </div>
        </div>

        {/* Find a Doctor */}
        <div className="home-section-container row-reverse alt-bg">
           <div className="section-text-content">
            <h1>Find a <span className="highlight">Doctor</span></h1>
            <p>
              Our Medicare platform helps you connect with qualified doctors across multiple specialties.
              Search by name, specialty, or location to find the right expert for your health needs.
              View doctor profiles, check patient reviews, and book appointments with ease.
              Whether you need a general consultation or a specialist opinion, we make healthcare accessible and convenient for you.
            </p>
          </div>
          <div className="section-image-content">
            <img src={searchdoctor} alt="Find a Doctor" />
          </div>
        </div>

        {/* Blogs */}
        <section className="blogs-section">
          <div className="blogs-container">
            <h1>Blogs</h1>
            <div className="blogs-grid">
              {currentBlogs.map((blog, index) => (
                <div key={blog._id || index} className="blog-card">
                  <img
                    src={blog.image_url}
                    alt={blog.title || "blog image"}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  />
                  <div className="blog-card-content">
                    <h3>{blog.title}</h3>
                    <p>{blog.description}</p>
                    <div className="blog-card-footer">
                      <button>
                        <a href={`/blog/${blog._id}`}>Read More</a>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalBlogPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => handlePageChange(setBlogPage, totalBlogPages, blogPage - 1)}
                  disabled={blogPage === 1}
                  style={blogPage === 1 ? disabledBtnStyle : btnStyle}
                >
                  Prev
                </button>
                {[...Array(totalBlogPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(setBlogPage, totalBlogPages, pageNum)}
                      style={blogPage === pageNum ? activeBtnStyle : btnStyle}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(setBlogPage, totalBlogPages, blogPage + 1)}
                  disabled={blogPage === totalBlogPages}
                  style={blogPage === totalBlogPages ? disabledBtnStyle : btnStyle}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Top Doctors */}
        <section className="top-doctors-section">
          <div className="top-doctors-container">
            <h1>Top Doctors</h1>
            <div className="doctors-grid">
              {currentDoctors.length === 0 ? (
                <p>No doctors found.</p>
              ) : (
                currentDoctors.map((doctor, index) => (
                  <DoctorCard key={doctor._id || index} doctor={doctor} />
                ))
              )}
            </div>
            {totalDoctorPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, doctorPage - 1)}
                  disabled={doctorPage === 1}
                  style={doctorPage === 1 ? disabledBtnStyle : btnStyle}
                >
                  Prev
                </button>
                {[...Array(totalDoctorPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, pageNum)}
                      style={doctorPage === pageNum ? activeBtnStyle : btnStyle}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(setDoctorPage, totalDoctorPages, doctorPage + 1)}
                  disabled={doctorPage === totalDoctorPages}
                  style={doctorPage === totalDoctorPages ? disabledBtnStyle : btnStyle}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MedicareIndex;
