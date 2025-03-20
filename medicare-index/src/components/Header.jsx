import React from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png";


function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" className="mlogo" />
          <a href="#" className="alogo">
            Medicare
          </a>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#">Find a Doctor</a>
          </li>
          <li>
            <a href="#">Get Second Opinion</a>
          </li>
          <li>
            <a href="#">Blogs</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="#">Sign Up</a>
          </li>
        </ul>
        <div className="search-container">
          <input type="text" placeholder="Search Your Service" />
          <button>🔍</button>
        </div>
      </nav>

      {/* Secondary Yellow Navbar */}
      <div className="secondary-navbar">
        <a href="#">Our Hospitals</a>
        <a href="#">Online Consultancy</a>
        <a href="#">Treatments</a>
        <a href="#">Blood Camps and Banks</a>
      </div>
    </header>
  );
}

export default Header;
