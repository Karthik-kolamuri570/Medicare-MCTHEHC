import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Heart, Droplets, Users, Shield, Clock, Phone, Mail, MapPin,
  Building2, Tent, ArrowRight, Sparkles, Activity, ChevronLeft,
  CheckCircle, Quote, ClipboardList, Syringe, TestTubes, HeartHandshake
} from "lucide-react";
import "../../styles/BloodBankLanding.css";

/* ── Animated counter ── */
const AnimatedCounter = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── Scroll reveal hook ── */
const useScrollReveal = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis];
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } })
};

export default function BankHome() {
  const navigate = useNavigate();
  const [statsRef, statsVis] = useScrollReveal();
  const [svcRef, svcVis] = useScrollReveal();
  const [processRef, processVis] = useScrollReveal();
  const [whyRef, whyVis] = useScrollReveal();
  const [typesRef, typesVis] = useScrollReveal();
  const [testiRef, testiVis] = useScrollReveal();

  return (
    <div className="bb-page">

      {/* ════════ HEADER ════════ */}
      <header className="bb-header">
        <a href="/blood-bank" className="bb-logo">
          <div className="bb-logo-icon"><Droplets size={18} color="#fff" /></div>
          <span className="bb-logo-text">BloodLife</span>
        </a>
        <nav className="bb-nav">
          <a href="/" className="bb-back-btn"><ChevronLeft size={14} /> Medicare Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#why-donate">Why Donate</a>
          <a href="/blood-bank/user" className="bb-nav-cta">
            <Droplets size={14} /> Find Blood
          </a>
        </nav>
      </header>

      {/* ════════ HERO ════════ */}
      <section className="bb-hero">
        {/* Animated blood drop background */}
        <div className="bb-hero-drops" aria-hidden="true">
          <svg className="bb-drop bb-drop-1" viewBox="0 0 40 56" fill="none"><path d="M20 0C20 0 0 28 0 38a20 20 0 0040 0C40 28 20 0 20 0z" fill="rgba(220,38,38,0.08)"/></svg>
          <svg className="bb-drop bb-drop-2" viewBox="0 0 40 56" fill="none"><path d="M20 0C20 0 0 28 0 38a20 20 0 0040 0C40 28 20 0 20 0z" fill="rgba(225,29,72,0.06)"/></svg>
          <svg className="bb-drop bb-drop-3" viewBox="0 0 40 56" fill="none"><path d="M20 0C20 0 0 28 0 38a20 20 0 0040 0C40 28 20 0 20 0z" fill="rgba(220,38,38,0.05)"/></svg>
        </div>

        <div className="bb-hero-content">
          {/* Animated blood drop icon */}
          <motion.div
            className="bb-hero-drop-icon"
            initial={{ y: -60, scale: 0.6, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
          >
            <svg width="52" height="72" viewBox="0 0 52 72">
              <defs>
                <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <motion.path
                d="M26 4C26 4 2 32 2 46a24 24 0 0048 0C50 32 26 4 26 4z"
                fill="url(#dropGrad)"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatType: "reverse" }}
              />
              <ellipse cx="26" cy="52" rx="10" ry="6" fill="#fff" opacity="0.25" />
              <Heart className="bb-drop-heart" x="14" y="32" width="24" height="24" color="#fff" style={{ position: 'absolute' }} />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bb-hero-badge">
              <div className="bb-hero-badge-dot" />
              <span>Every Drop Counts — Save Lives Today</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Your Blood<br />Can Be Someone's <span>Lifeline.</span>
          </motion.h1>

          <motion.p
            className="bb-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            Join our life-saving mission. Search for blood, request donations,
            register as a donor, or participate in blood camps — all from one platform.
          </motion.p>

          <motion.div
            className="bb-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a href="/blood-bank/user" className="bb-btn-primary">
              <Droplets size={18} /> Find / Request Blood
            </a>
            <a href="/blood-bank/bank" className="bb-btn-outline">
              <Building2 size={18} /> Blood Bank Portal
            </a>
          </motion.div>

          {/* Urgency ticker */}
          <motion.div
            className="bb-urgency-ticker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span className="bb-urgency-dot" />
            <span>Urgent need: <strong>O−</strong> and <strong>AB−</strong> blood types are in high demand right now</span>
          </motion.div>
        </div>

        {/* Floating glass elements */}
        <div className="bb-hero-float bb-float-1">
          <div className="bb-float-icon bb-float-red"><Heart size={18} color="#f87171" /></div>
          <div><b>15,000+</b><small>Lives Saved</small></div>
        </div>
        <div className="bb-hero-float bb-float-2">
          <div className="bb-float-icon bb-float-green"><Shield size={18} color="#34d399" /></div>
          <div><b>100% Safe</b><small>Certified Process</small></div>
        </div>
        <div className="bb-hero-float bb-float-3">
          <div className="bb-float-icon bb-float-amber"><Clock size={18} color="#fbbf24" /></div>
          <div><b>24/7</b><small>Emergency Ready</small></div>
        </div>

        {/* Wave divider */}
        <div className="bb-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--bb-light)" />
          </svg>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section ref={statsRef} className="bb-stats" style={{ opacity: statsVis ? 1 : 0, transform: statsVis ? 'translateY(0)' : 'translateY(20px)', transition: 'var(--bb-transition)' }}>
        {[
          { icon: Heart, val: 15847, suffix: "+", label: "Lives Saved", color: "#dc2626", bg: "linear-gradient(135deg, #fef2f2, #ffe4e6)" },
          { icon: Users, val: 5282, suffix: "+", label: "Active Donors", color: "#059669", bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)" },
          { icon: Shield, val: 98, suffix: "%", label: "Safety Rate", color: "#4f46e5", bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)" },
          { icon: Clock, val: 24, suffix: "/7", label: "Emergency Support", color: "#d97706", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)" },
        ].map((s, i) => (
          <div key={i} className="bb-stat-card" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="bb-stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
            <div className="bb-stat-val" style={{ color: s.color }}><AnimatedCounter end={s.val} suffix={s.suffix} /></div>
            <div className="bb-stat-lbl">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ════════ SERVICES ════════ */}
      <section id="services" ref={svcRef} className="bb-services" style={{ opacity: svcVis ? 1 : 0, transform: svcVis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="bb-section-head">
          <div className="bb-section-chip"><Activity size={12} /> Our Services</div>
          <h2>Two Ways to <span>Save Lives</span></h2>
          <p>Access our blood bank facilities or join mobile blood camps in your community</p>
        </div>

        <div className="bb-svc-grid">
          <div className="bb-svc-card svc-bank">
            <div className="bb-svc-icon"><Building2 size={26} /></div>
            <h3>Blood Bank</h3>
            <div className="bb-svc-sub">Permanent Donation Centers</div>
            <ul className="bb-svc-list">
              <li>Search blood by group, city, or availability</li>
              <li>Request urgent blood donations instantly</li>
              <li>Register as a donor & track your history</li>
              <li>Learn about eligibility and safety guidelines</li>
            </ul>
            <a onClick={(e) => { e.preventDefault(); navigate('/blood-bank/user'); }} className="bb-svc-btn bb-svc-btn-bank" style={{cursor: 'pointer'}}>
              Access Blood Bank <ArrowRight size={16} />
            </a>
          </div>

          <div className="bb-svc-card svc-camp">
            <div className="bb-svc-icon"><Tent size={26} /></div>
            <h3>Blood Camps</h3>
            <div className="bb-svc-sub">Mobile Donation Drives</div>
            <ul className="bb-svc-list">
              <li>Discover upcoming & recent camp events</li>
              <li>Sign up as a donor or volunteer</li>
              <li>Host or propose a new community camp</li>
              <li>View camp stories, photos, and results</li>
            </ul>
            <a onClick={(e) => { e.preventDefault(); navigate('/blood-bank/user?section=camps'); }} className="bb-svc-btn bb-svc-btn-camp" style={{cursor: 'pointer'}}>
              Explore Blood Camps <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section id="how-it-works" ref={processRef} className="bb-process">
        <div className="bb-section-head">
          <div className="bb-section-chip"><CheckCircle size={12} /> How It Works</div>
          <h2>Donate in <span>4 Simple Steps</span></h2>
          <p>The entire process takes just 30 minutes of your time</p>
        </div>

        <div className="bb-process-grid" style={{ opacity: processVis ? 1 : 0, transform: processVis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
          {[
            { step: 1, icon: ClipboardList, title: "Registration", desc: "Fill out a quick health questionnaire and provide basic identification details.", color: "#6366f1" },
            { step: 2, icon: Activity, title: "Health Check", desc: "Our certified staff performs a quick check — blood pressure, hemoglobin, and pulse.", color: "#059669" },
            { step: 3, icon: Syringe, title: "Donation", desc: "Relax while we collect your blood. The actual donation takes only 8-10 minutes.", color: "#dc2626" },
            { step: 4, icon: HeartHandshake, title: "Recovery", desc: "Enjoy refreshments and rest briefly. You've just saved up to 3 lives!", color: "#d97706" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bb-process-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className="bb-process-num" style={{ color: item.color }}>{String(item.step).padStart(2, '0')}</div>
              <div className="bb-process-icon" style={{ background: `${item.color}12`, color: item.color }}>
                <item.icon size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              {i < 3 && <div className="bb-process-arrow"><ArrowRight size={16} /></div>}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ WHY DONATE ════════ */}
      <section id="why-donate" ref={whyRef} className="bb-why">
        <div className="bb-section-head">
          <div className="bb-section-chip"><Sparkles size={12} /> Why Donate</div>
          <h2>Every Donation <span>Matters</span></h2>
          <p>Your single act of generosity creates a ripple of hope</p>
        </div>

        <div className="bb-why-grid" style={{ opacity: whyVis ? 1 : 0, transform: whyVis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
          {[
            { icon: Heart, title: "Save 3 Lives", desc: "One donation can help save up to three people in need of blood transfusions.", color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
            { icon: Shield, title: "Certified Safe", desc: "All equipment is sterile, single-use, and operated by certified medical professionals.", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
            { icon: Users, title: "Join 5,000+ Donors", desc: "Become part of a community that's actively saving lives across the country.", color: "#818cf8", bg: "rgba(129,140,248,0.15)" },
            { icon: Clock, title: "Only 30 Minutes", desc: "The entire donation process takes just 30 minutes. Quick, easy, and life-changing.", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bb-why-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className="bb-why-icon" style={{ background: item.bg, color: item.color }}>
                <item.icon size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ BLOOD TYPES ════════ */}
      <section id="blood-types" ref={typesRef} className="bb-types">
        <div className="bb-section-head">
          <div className="bb-section-chip"><Droplets size={12} /> Blood Types</div>
          <h2>Know Your <span>Blood Group</span></h2>
          <p>All major blood groups available and ready for donation</p>
        </div>

        <div className="bb-types-grid" style={{ opacity: typesVis ? 1 : 0, transform: typesVis ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
          {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((type, i) => (
            <motion.div
              key={type}
              className="bb-type-card"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="bb-type-label">{type}</div>
              <div className="bb-type-name">Type {type}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section ref={testiRef} className="bb-testimonials">
        <div className="bb-section-head">
          <div className="bb-section-chip"><Quote size={12} /> Stories</div>
          <h2>Voices That <span>Inspire</span></h2>
          <p>Real experiences from our donor community</p>
        </div>

        <div className="bb-testi-grid" style={{ opacity: testiVis ? 1 : 0, transform: testiVis ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)' }}>
          {[
            { name: "Priya Sharma", role: "Regular Donor — 12 donations", quote: "Donating blood has become a meaningful part of my routine. Knowing my donation helped save someone's life gives me incredible purpose and joy.", color: "#dc2626" },
            { name: "Rahul Mehta", role: "Recipient Family", quote: "When my daughter needed emergency surgery, blood donors literally saved her life. Words can't express our gratitude to this amazing community.", color: "#4f46e5" },
            { name: "Dr. Ananya Reddy", role: "Medical Director", quote: "Our safety protocols and dedicated donor community make BloodLife one of the most trusted blood services in the region. Every unit matters.", color: "#059669" },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bb-testi-card"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              <div className="bb-testi-quote-icon" style={{ color: t.color }}><Quote size={24} /></div>
              <p className="bb-testi-text">{t.quote}</p>
              <div className="bb-testi-author">
                <div className="bb-testi-avatar" style={{ background: `${t.color}18`, color: t.color }}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="bb-testi-name">{t.name}</div>
                  <div className="bb-testi-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="bb-cta">
        <div className="bb-cta-box">
          <motion.div
            className="bb-cta-drop"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <Droplets size={40} color="rgba(255,255,255,0.15)" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Save Lives?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your donation today could be someone's second chance at life tomorrow.
          </motion.p>
          <div className="bb-cta-actions">
            <a href="/blood-bank/user" className="bb-btn-primary">
              <Droplets size={18} /> Donate / Find Blood
            </a>
            <a href="/" className="bb-btn-outline">
              <ArrowRight size={18} /> Back to Medicare
            </a>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="bb-footer">
        <div className="bb-footer-inner">
          <div>
            <div className="bb-footer-brand">
              <div className="bb-footer-brand-icon"><Droplets size={16} color="#fff" /></div>
              <span>BloodLife</span>
            </div>
            <p>Connecting donors with those in need, saving lives one donation at a time. Part of the Medicare healthcare ecosystem.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="bb-footer-links">
              <li><a href="/blood-bank/user">Donate Blood</a></li>
              <li><a href="/blood-bank/bank">Blood Bank</a></li>
              <li><a href="#blood-types">Blood Types</a></li>
              <li><a href="#why-donate">Why Donate</a></li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul className="bb-footer-links">
              <li><a href="#safety">Safety Guidelines</a></li>
              <li><a href="#services">Our Services</a></li>
              <li><a href="/">Medicare Home</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Emergency Contact</h4>
            <div className="bb-footer-contact">
              <div className="bb-footer-contact-item">
                <div className="bb-footer-contact-icon"><Phone size={14} /></div>
                <span>1800-000-BLOOD (24/7)</span>
              </div>
              <div className="bb-footer-contact-item">
                <div className="bb-footer-contact-icon"><Mail size={14} /></div>
                <span>contact@bloodlife.org</span>
              </div>
              <div className="bb-footer-contact-item">
                <div className="bb-footer-contact-icon"><MapPin size={14} /></div>
                <span>Medicare Health District</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bb-footer-bottom">
          © {new Date().getFullYear()} BloodLife — A Medicare Initiative. All rights reserved. Saving lives together.
        </div>
      </footer>
    </div>
  );
}
