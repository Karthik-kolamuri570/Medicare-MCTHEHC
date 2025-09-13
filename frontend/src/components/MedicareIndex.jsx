
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/MedicareIndex.css";
import bookanappointment from "../assets/bookanappointment.png";
import searchdoctor from "../assets/searchdoctor.png";
import Hospital from "../assets/Hospital.png";
import specialities from "../assets/Specialities.png";
import TopDoctors from "./TopDoctors";
import Loader from "./ui/Loader"; // adjust path if needed



function MedicareIndex() {
  const [loading, setLoading] = useState(true);
  const [blogData,setBlogData] = useState([]);

useEffect(()=>{
  const fetchBlogs = async () => {
    try{
      const response = await axios.get('http://localhost:1600/api/blogs/blogs'); 
      setBlogData(response.data || []); 
      console.log(response.data);
    }
    catch(err){
      console.error('Error fetching blogs:', err);
    }
  }
  fetchBlogs();
},[]);

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
              {blogData.blogs.map((blog, index) => (
                <div key={index} className="blog-card">
                  <img src={blog.image_url} alt="blogpic" />
                  <h3>{blog.title}</h3>
                  <p>{blog.description}</p>
                  <button><a href={`/api/blog/${blog._id}`}>Read More</a> </button>
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
