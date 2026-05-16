
import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import "../styles/MedicareIndex.css";
import bookanappointment from "../assets/bookanappointment.png";
import searchdoctor from "../assets/searchdoctor.png";
import Hospital from "../assets/Hospital.png";
import specialities from "../assets/Specialities.png";
import Loader from "./ui/Loader";
import defaultDoctorImage from "../assets/doctor1.png";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Star, Building2, Heart, Shield, Activity,
  Users, ChevronRight, Stethoscope, Calendar, ArrowRight,
  Zap, Globe, Phone, HeartPulse, Syringe, Brain,
  Search, TrendingUp, Sparkles, ArrowUpRight, Video,
  Pill, TestTubes, Eye, Bone, Baby, Droplets
} from "lucide-react";

/* ═══════════════════════════════════════
   Utilities
   ═══════════════════════════════════════ */
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || "0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
};

const AnimatedCounter = ({ end, duration = 2200, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollReveal({ threshold: 0.5 });
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    let startTime;
    const animate = (t) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * end));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ═══════════════════════════════════════
   Sub-components with hooks at top level
   ═══════════════════════════════════════ */
const ServiceTile = ({ icon: Icon, title, subtitle, color, gradient, delay, onClick }) => {
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`svc-tile ${vis ? "vis" : ""}`} style={{ "--d": `${delay}ms` }} onClick={onClick}>
      <div className="svc-tile-icon" style={{ background: gradient }}>
        <Icon size={26} color="#fff" />
      </div>
      <div className="svc-tile-text">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      <div className="svc-tile-arrow"><ArrowUpRight size={18} /></div>
    </div>
  );
};

const SpecCard = ({ icon: Icon, label, color, delay }) => {
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`spec-card ${vis ? "vis" : ""}`} style={{ "--d": `${delay}ms`, "--c": color }}>
      <div className="spec-card-icon" style={{ background: `${color}15`, color }}><Icon size={22} /></div>
      <span>{label}</span>
      <ArrowRight size={14} className="spec-arrow" />
    </div>
  );
};

const BlogCard = ({ blog, index }) => {
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`blog-card ${vis ? "vis" : ""}`} style={{ "--d": `${index * 100}ms` }}>
      <div className="blog-card-thumb">
        <img src={blog.image_url} alt={blog.title || ""} onError={(e) => { e.target.src = "https://via.placeholder.com/400x220?text=No+Image"; }} />
        <div className="blog-card-cat">Health</div>
      </div>
      <div className="blog-card-body">
        <h3>{blog.title}</h3>
        <p>{blog.description}</p>
        <a href={`/blog/${blog._id}`} className="blog-card-link">Read more <ArrowRight size={14} /></a>
      </div>
    </div>
  );
};

const DocCard = ({ doctor, delay }) => {
  const navigate = useNavigate();
  const [ref, vis] = useScrollReveal();
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [sH, sM] = (doctor.fromTime || "09:00").split(":").map(Number);
  const [eH, eM] = (doctor.toTime || "17:00").split(":").map(Number);
  const live = mins >= sH * 60 + sM && mins <= eH * 60 + eM;

  return (
    <div ref={ref} className={`doc-card ${vis ? "vis" : ""}`} style={{ "--d": `${delay}ms` }}>
      <div className="doc-card-top">
        <img src={doctor.profileImage || defaultDoctorImage} alt={doctor.name} onError={(e) => { e.target.src = defaultDoctorImage; }} />
        <span className={`doc-badge ${live ? "live" : ""}`}>
          <span className="badge-dot" />{live ? "Available" : "Offline"}
        </span>
      </div>
      <div className="doc-card-info">
        <h4>{doctor.name}</h4>
        <p className="doc-spec">{doctor.specialization}</p>
        <div className="doc-meta">
          <span><Star size={13} fill="#f59e0b" color="#f59e0b" /> {doctor.rating ? doctor.rating.toFixed(1) : "New"}</span>
          <span><MapPin size={13} /> {doctor.location || "N/A"}</span>
        </div>
        {doctor.hospital && <div className="doc-hospital"><Building2 size={12} /> {doctor.hospital}</div>}
        <div className="doc-time"><Clock size={12} /> {doctor.fromTime || "09:00"} – {doctor.toTime || "17:00"}</div>
      </div>
      <button className="doc-book-btn" onClick={() => navigate(`/book-appointment/${doctor._id}`)}>
        <Calendar size={14} /> Book • ₹{doctor.feePerConsultation || 500}
      </button>
    </div>
  );
};

const ShowcaseBlock = ({ image, title, highlight, desc, link, reverse }) => {
  const navigate = useNavigate();
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`showcase-block ${reverse ? "rev" : ""} ${vis ? "vis" : ""}`}>
      <div className="showcase-img">
        <img src={image} alt={title} />
        <div className="showcase-img-glow" />
      </div>
      <div className="showcase-content">
        <h2>{title} <span className="gradient-text">{highlight}</span></h2>
        <p>{desc}</p>
        <button className="showcase-cta" onClick={() => navigate(link || "/")}>
          Learn More <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const Pagination = ({ current, total, setter, onChange }) => (
  <div className="pg">
    <button onClick={() => onChange(setter, total, current - 1)} disabled={current === 1} className="pg-btn">← Prev</button>
    {[...Array(total)].map((_, i) => (
      <button key={i} onClick={() => onChange(setter, total, i + 1)} className={`pg-btn ${current === i + 1 ? "active" : ""}`}>{i + 1}</button>
    ))}
    <button onClick={() => onChange(setter, total, current + 1)} disabled={current === total} className="pg-btn">Next →</button>
  </div>
);


/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
function MedicareIndex() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [blogPage, setBlogPage] = useState(1);
  const blogsPerPage = 4;
  const [doctorData, setDoctorData] = useState([]);
  const [doctorPage, setDoctorPage] = useState(1);
  const doctorsPerPage = 4;

  const [heroRef, heroVis] = useScrollReveal({ threshold: 0.05 });
  const [statsRef, statsVis] = useScrollReveal();
  const [ctaRef, ctaVis] = useScrollReveal();

  useEffect(() => {
    (async () => {
      try {
        const [bResp, dResp] = await Promise.all([api.get("/api/blogs/blogs"), api.get("/api/doctor")]);
        setBlogData(bResp.data || []);
        setDoctorData(dResp.data.data || []);
      } catch (e) { console.error("Fetch error:", e); }
    })();
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 0); return () => clearTimeout(t); }, []);
  useEffect(() => { console.log("Doctors updated:", doctorData); }, [doctorData]);

  if (loading) return <Loader />;

  const totalBlogs = blogData.blogs ? blogData.blogs.length : 0;
  const totalBlogPages = Math.ceil(totalBlogs / blogsPerPage);
  const currentBlogs = blogData.blogs ? blogData.blogs.slice((blogPage - 1) * blogsPerPage, blogPage * blogsPerPage) : [];
  const totalDoctors = doctorData.length;
  const totalDoctorPages = Math.ceil(totalDoctors / doctorsPerPage);
  const currentDoctors = doctorData.slice((doctorPage - 1) * doctorsPerPage, doctorPage * doctorsPerPage);
  const handlePageChange = (setter, totalPages, page) => { if (page >= 1 && page <= totalPages) setter(page); };

  return (
    <div className="mc-landing">

      {/* ════════ HERO ════════ */}
      <section ref={heroRef} className={`hero ${heroVis ? "vis" : ""}`}>
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid-lines" />
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>#1 Healthcare Platform in India</span>
            </div>

            <h1>
              Your Health<br/>
              Deserves the <span className="gradient-text">Best Care.</span>
            </h1>

            <p className="hero-sub">
              Connect with 200+ verified specialists, book instant appointments,
              and access world-class healthcare — all from one platform.
            </p>

            {/* Quick action search */}
            <div className="hero-search">
              <div className="hero-search-icon"><Search size={20} /></div>
              <input type="text" placeholder="Search doctors, specialties, hospitals..." />
              <button onClick={() => navigate("/top-doctors")}>Search</button>
            </div>

            {/* Quick action pills */}
            <div className="hero-pills">
              <button className="hero-pill" onClick={() => navigate("/top-doctors")}>
                <Stethoscope size={15} /> Find Doctor
              </button>
              <button className="hero-pill" onClick={() => navigate("/patient/online-consultation")}>
                <Video size={15} /> Video Consult
              </button>
              <button className="hero-pill" onClick={() => navigate("/hospitals")}>
                <Building2 size={15} /> Hospitals
              </button>
              <button className="hero-pill" onClick={() => navigate("/blood-bank")}>
                <Droplets size={15} /> Blood Bank
              </button>
            </div>

            {/* Trust metrics */}
            <div className="hero-metrics">
              <div className="metric"><strong>5,000+</strong><span>Happy Patients</span></div>
              <div className="metric-divider" />
              <div className="metric"><strong>200+</strong><span>Verified Doctors</span></div>
              <div className="metric-divider" />
              <div className="metric"><strong>4.9★</strong><span>User Rating</span></div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-img-wrap">
              <img src={bookanappointment} alt="Book Appointment" className="hero-main-img" />
              
              {/* Floating glass elements */}
              <div className="hero-glass g-1">
                <div className="hg-icon hg-green"><Shield size={18} color="#fff" /></div>
                <div><b>100% Secure</b><small>HIPAA Compliant</small></div>
              </div>
              <div className="hero-glass g-2">
                <div className="hg-icon hg-blue"><Zap size={18} color="#fff" /></div>
                <div><b>Instant</b><small>Booking</small></div>
              </div>
              <div className="hero-glass g-3">
                <div className="hg-icon hg-purple"><Heart size={18} color="#fff" /></div>
                <div><b>Trusted</b><small>By Millions</small></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,40 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section ref={statsRef} className={`stats-section ${statsVis ? "vis" : ""}`}>
        <div className="stats-row">
          {[
            { icon: Users, n: totalDoctors > 0 ? totalDoctors * 25 : 5000, s: "+", label: "Patients Served", color: "#6366f1", bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)" },
            { icon: Stethoscope, n: totalDoctors || 200, s: "+", label: "Expert Doctors", color: "#059669", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)" },
            { icon: Building2, n: totalBlogs || 50, s: "+", label: "Health Articles", color: "#d97706", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)" },
            { icon: Star, n: doctorData.length > 0 ? Math.round(doctorData.reduce((sum, d) => sum + (d.rating || 4.5), 0) / doctorData.length * 10) / 10 : 4.9, s: "★", label: "Avg. Rating", color: "#dc2626", bg: "linear-gradient(135deg, #fef2f2, #fee2e2)" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ "--d": `${i * 80}ms`, background: s.bg }}>
              <div className="stat-icon" style={{ color: s.color, background: `${s.color}15` }}><s.icon size={22} /></div>
              <div className="stat-val" style={{ color: s.color }}><AnimatedCounter end={s.n} suffix={s.s} /></div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <section className="services-section">
        <div className="section-head">
          <div className="section-chip"><Zap size={13} /> Our Services</div>
          <h2>Everything You Need, <span className="gradient-text">In One Place</span></h2>
          <p>Comprehensive healthcare solutions designed around your needs</p>
        </div>
        <div className="svc-grid">
          <ServiceTile icon={Calendar} title="Book Appointment" subtitle="Schedule visits with top specialists instantly" color="#6366f1" gradient="linear-gradient(135deg, #6366f1, #818cf8)" delay={0} onClick={() => navigate("/top-doctors")} />
          <ServiceTile icon={Building2} title="Find Hospital" subtitle="Locate nearest hospitals with ratings" color="#059669" gradient="linear-gradient(135deg, #059669, #34d399)" delay={80} onClick={() => navigate("/hospitals")} />
          <ServiceTile icon={Video} title="Online Consult" subtitle="Video consult from the comfort of home" color="#2563eb" gradient="linear-gradient(135deg, #2563eb, #60a5fa)" delay={160} onClick={() => navigate("/patient/online-consultation")} />
          <ServiceTile icon={Stethoscope} title="Specialities" subtitle="20+ specialities from cardiology to neuro" color="#d97706" gradient="linear-gradient(135deg, #d97706, #fbbf24)" delay={240} onClick={() => navigate("/treatments")} />
          <ServiceTile icon={Droplets} title="Blood Banks" subtitle="Find blood banks and check availability" color="#dc2626" gradient="linear-gradient(135deg, #dc2626, #f87171)" delay={320} onClick={() => navigate("/blood-bank")} />
          <ServiceTile icon={TestTubes} title="Lab Tests" subtitle="Book diagnostic tests at certified labs" color="#7c3aed" gradient="linear-gradient(135deg, #7c3aed, #a78bfa)" delay={400} onClick={() => navigate("/treatments")} />
        </div>
      </section>

      {/* ════════ SPECIALTIES ════════ */}
      <section className="spec-section">
        <div className="section-head">
          <div className="section-chip"><Brain size={13} /> Specialties</div>
          <h2>Find the Right <span className="gradient-text">Specialist</span></h2>
          <p>Access 20+ medical specialties with top-rated doctors</p>
        </div>
        <div className="spec-grid">
          {[
            { icon: HeartPulse, label: "Cardiology", color: "#ef4444" },
            { icon: Brain, label: "Neurology", color: "#8b5cf6" },
            { icon: Bone, label: "Orthopedics", color: "#0891b2" },
            { icon: Baby, label: "Pediatrics", color: "#ec4899" },
            { icon: Eye, label: "Ophthalmology", color: "#0d9488" },
            { icon: Syringe, label: "Oncology", color: "#6366f1" },
            { icon: Activity, label: "Pulmonology", color: "#059669" },
            { icon: Pill, label: "Dermatology", color: "#d97706" },
            { icon: Stethoscope, label: "Gynecology", color: "#be185d" },
            { icon: Globe, label: "Psychiatry", color: "#7c3aed" },
          ].map((s, i) => <SpecCard key={i} icon={s.icon} label={s.label} color={s.color} delay={i * 60} />)}
        </div>
      </section>

      {/* ════════ SHOWCASE ════════ */}
      <section className="showcase-section">
        <ShowcaseBlock image={bookanappointment} title="Book an" highlight="Appointment" link="/top-doctors" desc="Easily schedule appointments with top healthcare professionals. Whether you need a routine check-up, specialist consultation, or second opinion, our seamless booking ensures you get care at your convenience." />
        <ShowcaseBlock image={Hospital} title="Find a" highlight="Hospital" link="/hospitals" desc="Locate the nearest hospitals with our platform. Search by location and specialty, access emergency services, and check hospital details and ratings instantly." reverse />
        <ShowcaseBlock image={specialities} title="Explore" highlight="Specialities" link="/treatments" desc="Connect with top specialists in cardiology, neurology, orthopedics, pediatrics, dermatology, oncology, and more. Find the right specialist with ease." />
        <ShowcaseBlock image={searchdoctor} title="Find Your" highlight="Doctor" link="/top-doctors" desc="Search qualified doctors by name, specialty, or location. View doctor profiles, check patient reviews, and book appointments easily." reverse />
      </section>

      {/* ════════ BLOGS ════════ */}
      <section className="blogs-sec">
        <div className="section-head">
          <div className="section-chip"><TrendingUp size={13} /> Health Insights</div>
          <h2>Latest <span className="gradient-text">Articles</span></h2>
          <p>Expert health tips, breakthroughs, and wellness advice</p>
        </div>
        <div className="blog-grid">
          {currentBlogs.map((b, i) => <BlogCard key={b._id || i} blog={b} index={i} />)}
        </div>
        {totalBlogPages > 1 && <Pagination current={blogPage} total={totalBlogPages} setter={setBlogPage} onChange={handlePageChange} />}
      </section>

      {/* ════════ DOCTORS ════════ */}
      <section className="docs-sec">
        <div className="section-head">
          <div className="section-chip"><Stethoscope size={13} /> Top Doctors</div>
          <h2>Meet Our <span className="gradient-text">Experts</span></h2>
          <p>Top-rated doctors ready to help you today</p>
        </div>
        <div className="doc-grid">
          {currentDoctors.length === 0
            ? <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#94a3b8", padding: "40px" }}>No doctors found.</p>
            : currentDoctors.map((d, i) => <DocCard key={d._id || i} doctor={d} delay={i * 100} />)
          }
        </div>
        {totalDoctorPages > 1 && <Pagination current={doctorPage} total={totalDoctorPages} setter={setDoctorPage} onChange={handlePageChange} />}
      </section>

      {/* ════════ CTA ════════ */}
      <section ref={ctaRef} className={`cta-sec ${ctaVis ? "vis" : ""}`}>
        <div className="cta-bg">
          <div className="cta-orb co-1" />
          <div className="cta-orb co-2" />
        </div>
        <div className="cta-inner">
          <h2>Ready to take charge of your <span className="gradient-text">health?</span></h2>
          <p>Join thousands of patients who trust Medicare for quality healthcare</p>
          <div className="cta-btns">
            <button className="cta-primary" onClick={() => navigate("/SignUp")}>
              <Sparkles size={16} /> Get Started — It's Free
            </button>
            <button className="cta-secondary" onClick={() => navigate("/top-doctors")}>
              <Phone size={16} /> Talk to a Doctor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedicareIndex;
