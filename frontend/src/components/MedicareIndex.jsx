// import React from "react";
// import "../styles/MedicareIndex.css";
// import bookanappointment from "../assets/bookanappointment.png";
// import searchdoctor from "../assets/searchdoctor.png";
// import Hospital from "../assets/Hospital.png";
// import specialities from "../assets/Specialities.png";
// import TopDoctors from "./TopDoctors";
// const blogData = [
//   {
//     img: "image1.jpg",
//     title: "Blog 1",
//     description: "This is the description for blog 1.",
//   },
//   {
//     img: "image2.jpg",
//     title: "Blog 2",
//     description: "This is the description for blog 2.",
//   },
//   {
//     img: "image3.jpg",
//     title: "Blog 3",
//     description: "This is the description for blog 3.",
//   },
//   {
//     img: "image4.jpg",
//     title: "Blog 4",
//     description: "This is the description for blog 4.",
//   },
// ];

// function   MedicareIndex() {
  
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
//               system ensures you get the medical care you need at your
//               convenience.
//             </p>
//             <ul>
//               <li>
//                 Find a Doctor - Search for experienced doctors across various
//                 specialties.
//               </li>
//               <li>
//                 Online & In-Person Consultations - Book virtual or physical
//                 appointments.
//               </li>
//               <li>Instant Confirmation - Receive real-time booking updates.</li>
//               <li>
//                 Your health is our priority! Book your appointment today and
//                 take a step towards better healthcare.
//               </li>
//             </ul>
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
//               check hospital details and ratings. Find the right hospital for
//               your needs quickly and efficiently!
//             </p>
//           </div>
//         </div>

//         {/* Specialities */}
//         <div className="specialities-container">
//           <div className="specialities-text">
//             <h1>Specialities We Offer</h1>
//             <p>
//               Our Medicare platform connects you with top specialists in
//               cardiology for heart health, neurology for brain and nerve care,
//               orthopedics for bones and joints, and pediatrics for child
//               healthcare. We also provide expert consultations in dermatology
//               for skin and hair care, gynecology for women's health, oncology
//               for cancer treatment, psychiatry for mental health support,
//               gastroenterology for digestive issues, and endocrinology for
//               hormonal disorders. Find the right specialist with ease and get
//               the care you need.
//             </p>
//           </div>
//           <div className="specialities-image">
//             <img src={specialities} alt="Specialities" />
//           </div>
//         </div>

//         {/* Find a Doctor */}
//         <div className="find-a-doctor-container">
//           <div className="find-a-doctor-image">
//             <img src={searchdoctor} alt="" />
//           </div>
//           <div className="find-a-doctor-text">
//             <h1>Find a Doctor</h1>
//             <p>
//               Our Medicare platform helps you connect with qualified doctors
//               across multiple specialties. Search by name, specialty, or
//               location to find the right expert for your health needs. View
//               doctor profiles, check patient reviews, and book appointments with
//               ease. Whether you need a general consultation or a specialist
//               opinion, we make healthcare accessible and convenient for you.
//             </p>
//           </div>
//         </div>

//         {/* Blogs */}
//         <section className="blogs-section">
//           <div className="blogs-container">
//             <h1>Blogs</h1>
//             <div className="blogs-grid">
//               {blogData.map((blog, index) => (
//                 <div key={index} className="blog-card">
//                   <img src={blog.img} alt="blogpic" />
//                   <h3>{blog.title}</h3>
//                   <p>{blog.description}</p>
//                   <button>Read More</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Top Doctors */}
//         {/* <section className="top-doctors-section">
//           <div className="top-doctors-container">
//             <h1 className="top-doctors-heading">Our Top Doctors</h1>
//             <div className="doctors-grid">
//               {doctorsData.map((doctor, index) => (
//                 <div key={index} className="doctor-card">
//                   <img
//                     src={doctor.img}
//                     alt={doctor.name}
//                     className="doctor-img"
//                   />
//                   <h3 className="doctor-name">{doctor.name}</h3>
//                   <p className="doctor-description">{doctor.description}</p>
//                   <button className="appointment-btn">
//                     Book an Appointment
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section> */}
//         <TopDoctors/>
       
//       </div>
//     </div>
//   );
// }

// export default MedicareIndex;




import React, { useState, useEffect } from "react";
import "../styles/MedicareIndex.css";
import bookanappointment from "../assets/bookanappointment.png";
import searchdoctor from "../assets/searchdoctor.png";
import Hospital from "../assets/Hospital.png";
import specialities from "../assets/Specialities.png";
import TopDoctors from "./TopDoctors";
import Loader from "./ui/Loader"; // adjust path if needed

const blogData = [
  { img: "image1.jpg", title: "Blog 1", description: "This is the description for blog 1." },
  { img: "image2.jpg", title: "Blog 2", description: "This is the description for blog 2." },
  { img: "image3.jpg", title: "Blog 3", description: "This is the description for blog 3." },
  { img: "image4.jpg", title: "Blog 4", description: "This is the description for blog 4." },
];

function MedicareIndex() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch or initialization delay
    const timer = setTimeout(() => setLoading(false), 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Existing content below */}
      <div>
        {/* Book an Appointment */}
        <div className="book-appointment-container">
          <div className="book-appointment-text">
            <h1>Booking an Appointment</h1>
            <p>
              Easily schedule an appointment with top healthcare professionals
              using our Medicare platform. Whether you need a routine check-up,
              specialist consultation, or second opinion, our seamless booking
              system ensures you get the medical care you need at your
              convenience.
            </p>
            <ul>
              <li>
                Find a Doctor - Search for experienced doctors across various
                specialties.
              </li>
              <li>
                Online & In-Person Consultations - Book virtual or physical
                appointments.
              </li>
              <li>Instant Confirmation - Receive real-time booking updates.</li>
              <li>
                Your health is our priority! Book your appointment today and
                take a step towards better healthcare.
              </li>
            </ul>
          </div>
          <div className="book-appointment-image">
            <img src={bookanappointment} alt="Booking an Appointment" />
          </div>
        </div>

        {/* Find a Hospital */}
        <div className="find-hospital-container">
          <div className="find-hospital-image">
            <img src={Hospital} alt="Find a Hospital" />
          </div>
          <div className="find-hospital-text">
            <h1>Find a Hospital</h1>
            <p>
              Easily locate the nearest hospitals with our Medicare platform.
              Search by location and specialty, access emergency services, and
              check hospital details and ratings. Find the right hospital for
              your needs quickly and efficiently!
            </p>
          </div>
        </div>

        {/* Specialities */}
        <div className="specialities-container">
          <div className="specialities-text">
            <h1>Specialities We Offer</h1>
            <p>
              Our Medicare platform connects you with top specialists in
              cardiology for heart health, neurology for brain and nerve care,
              orthopedics for bones and joints, and pediatrics for child
              healthcare. We also provide expert consultations in dermatology
              for skin and hair care, gynecology for women's health, oncology
              for cancer treatment, psychiatry for mental health support,
              gastroenterology for digestive issues, and endocrinology for
              hormonal disorders. Find the right specialist with ease and get
              the care you need.
            </p>
          </div>
          <div className="specialities-image">
            <img src={specialities} alt="Specialities" />
          </div>
        </div>

        {/* Find a Doctor */}
        <div className="find-a-doctor-container">
          <div className="find-a-doctor-image">
            <img src={searchdoctor} alt="" />
          </div>
          <div className="find-a-doctor-text">
            <h1>Find a Doctor</h1>
            <p>
              Our Medicare platform helps you connect with qualified doctors
              across multiple specialties. Search by name, specialty, or
              location to find the right expert for your health needs. View
              doctor profiles, check patient reviews, and book appointments with
              ease. Whether you need a general consultation or a specialist
              opinion, we make healthcare accessible and convenient for you.
            </p>
          </div>
        </div>

        {/* Blogs */}
        <section className="blogs-section">
          <div className="blogs-container">
            <h1>Blogs</h1>
            <div className="blogs-grid">
              {blogData.map((blog, index) => (
                <div key={index} className="blog-card">
                  <img src={blog.img} alt="blogpic" />
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <button>Read More</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Doctors */}
        <TopDoctors />
      </div>
    </div>
  );
}

export default MedicareIndex;
