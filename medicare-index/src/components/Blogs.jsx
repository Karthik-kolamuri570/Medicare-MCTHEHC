import React from "react";
import "../styles/Blogs.css";

function Blogs({ blogs = [] }) {
  return (
    <section className="blogs-section">
      <div className="blogs-container">
        <h1 className="blogs-heading">Blogs</h1>{" "}
        {/* Moved inside the section */}
        <div className="blogs-grid">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index} className="blog-card">
                <img src={blog.img} alt="blogpic" />
                <h3>{blog.title}</h3>
                <p>{blog.description}</p>
                <button>Read More</button>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
