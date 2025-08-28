// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Heart, Users, Shield, Calendar, Phone, Mail, MapPin, Clock, Tent, Building2 } from "lucide-react"
// import DonationRequest from "./components/DonationRequest"
// import UserPortal from "./components/UserPortal"
// import "@/styles/BloodBankLanding.css";


// export default function BankHome() {
//   const [showDonationForm, setShowDonationForm] = useState(false)
//   const [showUserPortal, setShowUserPortal] = useState(false)

//   if (showUserPortal) {
//     return <UserPortal onBack={() => setShowUserPortal(false)} />
//   }

//   return (
//     <div className="landing-page">
//       {/* Header */}
//       <header className="header">
//         <div className="container header-inner">
//           <div className="logo">
//             <Heart className="logo-icon" />
//             <span className="logo-text">LifeBlood Bank</span>
//           </div>
//           <nav className="nav">
//             <a href="#services">Services</a>
//             <a href="#impact">Impact</a>
//             <a href="#safety">Safety</a>
//             <a href="#events">Events</a>
//             <Button variant="outline">Contact</Button>
//           </nav>
//         </div>
//       </header>

//       {/* Hero */}
//       <section className="hero">
//         <div className="container hero-inner">
//           <h1>Your Blood <span className="highlight">Saves Lives</span></h1>
//           <p>Every donation can save up to three lives. Join our community of heroes through our Blood Bank services and mobile Blood Camps.</p>
//           <div className="hero-actions">
//             <Button size="lg" onClick={() => setShowDonationForm(true)}>
//               <Heart className="button-icon" /> Donate Now
//             </Button>
//             <Button variant="outline" size="lg">Find Location</Button>
//           </div>
//         </div>
//       </section>

//       {/* Services */}
//       <section id="services" className="services">
//         <div className="container">
//           <div className="section-header">
//             <h2>Our Services</h2>
//             <p>Two ways to make a difference in your community</p>
//           </div>
//           <div className="services-grid">
//             <Card className="service-card">
//               <CardHeader>
//                 <div className="service-header">
//                   <div className="icon-box primary">
//                     <Building2 />
//                   </div>
//                   <div>
//                     <CardTitle>Blood Bank</CardTitle>
//                     <CardDescription>Permanent donation centers</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p>Visit our state-of-the-art blood bank facilities equipped with modern technology and staffed by certified professionals. Enjoy a comfortable, safe donation experience year-round.</p>
//                 <Button onClick={() => setShowUserPortal(true)}>Visit Blood Bank Portal</Button>
//               </CardContent>
//             </Card>

//             <Card className="service-card">
//               <CardHeader>
//                 <div className="service-header">
//                   <div className="icon-box secondary">
//                     <Tent />
//                   </div>
//                   <div>
//                     <CardTitle>Blood Camp</CardTitle>
//                     <CardDescription>Mobile donation drives</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p>Join our mobile blood camps that bring donation opportunities directly to your community, workplace, or school. Making donation convenient and accessible for everyone.</p>
//                 <Button variant="secondary">Join Blood Camp</Button>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Impact */}
//       <section id="impact" className="impact">
//         <div className="container">
//           <div className="section-header">
//             <h2>Our Community Impact</h2>
//             <p>See how your donations make a real difference</p>
//           </div>
//           <div className="impact-grid">
//             <Card className="impact-card text-center">
//               <CardContent>
//                 <div className="impact-number">15,847</div>
//                 <div>Lives Saved</div>
//               </CardContent>
//             </Card>
//             <Card className="impact-card text-center">
//               <CardContent>
//                 <div className="impact-number secondary">5,282</div>
//                 <div>Active Donors</div>
//               </CardContent>
//             </Card>
//             <Card className="impact-card text-center">
//               <CardContent>
//                 <div className="impact-number">98%</div>
//                 <div>Safety Rate</div>
//               </CardContent>
//             </Card>
//             <Card className="impact-card text-center">
//               <CardContent>
//                 <div className="impact-number secondary">24/7</div>
//                 <div>Emergency Support</div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="testimonials">
//         <div className="container">
//           <div className="section-header">
//             <h2>Stories That Matter</h2>
//             <p>Real experiences from our donor community</p>
//           </div>
//           <div className="testimonials-grid">
//             <Card className="testimonial-card">
//               <CardHeader>
//                 <div className="testimonial-header">
//                   <div className="icon-box primary">
//                     <Users />
//                   </div>
//                   <div>
//                     <CardTitle>Sarah Johnson</CardTitle>
//                     <CardDescription>Regular Donor</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p>"Donating blood has become a meaningful part of my routine. Knowing that my donation helped save someone's life gives me incredible purpose."</p>
//               </CardContent>
//             </Card>

//             <Card className="testimonial-card">
//               <CardHeader>
//                 <div className="testimonial-header">
//                   <div className="icon-box secondary">
//                     <Heart />
//                   </div>
//                   <div>
//                     <CardTitle>Michael Chen</CardTitle>
//                     <CardDescription>Recipient Family</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p>"When my daughter needed emergency surgery, blood donors literally saved her life. We're forever grateful to this amazing community."</p>
//               </CardContent>
//             </Card>

//             <Card className="testimonial-card">
//               <CardHeader>
//                 <div className="testimonial-header">
//                   <div className="icon-box primary">
//                     <Shield />
//                   </div>
//                   <div>
//                     <CardTitle>Dr. Emily Rodriguez</CardTitle>
//                     <CardDescription>Medical Director</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p>"Our safety protocols and community of dedicated donors make this one of the most trusted blood banks in the region."</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Safety */}
//       <section id="safety" className="safety">
//         <div className="container">
//           <div className="section-header">
//             <h2>Your Safety is Our Priority</h2>
//             <p>Comprehensive protocols ensure a safe donation experience</p>
//           </div>
//           <div className="safety-grid">
//             <div className="safety-card">
//               <div className="icon-box primary"><Shield /></div>
//               <h3>Sterile Equipment</h3>
//               <p>All equipment is single-use and sterile for maximum safety</p>
//             </div>
//             <div className="safety-card">
//               <div className="icon-box secondary"><Users /></div>
//               <h3>Trained Staff</h3>
//               <p>Certified professionals guide you through every step</p>
//             </div>
//             <div className="safety-card">
//               <div className="icon-box primary"><Heart /></div>
//               <h3>Health Screening</h3>
//               <p>Comprehensive health checks before every donation</p>
//             </div>
//             <div className="safety-card">
//               <div className="icon-box secondary"><Clock /></div>
//               <h3>Quick Process</h3>
//               <p>Efficient donation process respects your valuable time</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Events */}
//       <section id="events" className="events">
//         <div className="container">
//           <div className="section-header">
//             <h2>Upcoming Events</h2>
//             <p>Blood Bank visits and mobile Blood Camp locations</p>
//           </div>
//           <div className="events-grid">
//             <Card className="event-card">
//               <CardHeader>
//                 <div className="event-header">
//                   <Badge variant="secondary">Blood Camp</Badge>
//                   <Tent />
//                 </div>
//                 <CardTitle>Community Center Drive</CardTitle>
//                 <CardDescription>Mobile Blood Camp</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="event-info">
//                   <Clock /> Saturday, 9:00 AM - 4:00 PM
//                   <MapPin /> 123 Main Street
//                 </div>
//                 <Button>Register Now</Button>
//               </CardContent>
//             </Card>
//             {/* Add other event cards similarly */}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="cta">
//         <div className="container cta-inner">
//           <h2>Ready to Save Lives?</h2>
//           <p>Your donation today could be someone's second chance at life tomorrow.</p>
//           <div className="cta-actions">
//             <Button size="lg" variant="secondary" onClick={() => setShowDonationForm(true)}>Schedule Donation</Button>
//             <Button size="lg" variant="outline">Learn More</Button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="container footer-grid">
//           <div>
//             <div className="footer-logo">
//               <Heart /> LifeBlood Bank
//             </div>
//             <p>Connecting donors with those in need, saving lives one donation at a time.</p>
//           </div>
//           <div>
//             <h3>Quick Links</h3>
//             <ul>
//               <li><a href="#">Donate Blood</a></li>
//               <li><a href="#">Find Location</a></li>
//               <li><a href="#">Eligibility</a></li>
//               <li><a href="#">FAQs</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3>Support</h3>
//             <ul>
//               <li><a href="#">Safety Guidelines</a></li>
//               <li><a href="#">After Donation</a></li>
//               <li><a href="#">Contact Us</a></li>
//               <li><a href="#">Emergency</a></li>
//             </ul>
//           </div>
//           <div>
//             <h3>Contact Info</h3>
//             <div className="contact-info">
//               <Phone /> (555) 123-BLOOD
//               <Mail /> info@lifebloodbank.org
//               <MapPin /> 456 Health Ave, Medical District
//             </div>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           &copy; 2024 LifeBlood Bank. All rights reserved. Saving lives together.
//         </div>
//       </footer>

//       <DonationRequest isOpen={showDonationForm} onClose={() => setShowDonationForm(false)} />
//     </div>
//   )
// }






import React from "react";
import { motion } from "framer-motion";

function BankHome() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#faf6f7", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", background: "#e74c3c", color: "#fff" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>BloodLife</div>
        <nav>
          <a href="#blood-bank" style={{ color: "#fff", marginRight: "1.5rem" }}>Blood Bank</a>
          <a href="#blood-camp" style={{ color: "#fff", marginRight: "1.5rem" }}>Blood Camp</a>
          <a href="#about" style={{ color: "#fff", marginRight: "1.5rem" }}>About</a>
          <a href="#contact" style={{ color: "#fff" }}>Contact</a>
        </nav>
      </header>
      
      {/* Hero Section */}
      <section style={{ padding: "3rem 2rem", textAlign: "center", position: "relative" }}>
        {/* Animated Blood Drop */}
        <motion.div
          initial={{ y: -70, scale: 0.7 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 8 }}
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          <svg width="60" height="90" viewBox="0 0 60 90" style={{ display: "block" }}>
            <motion.ellipse
              cx="30"
              cy="60"
              rx="22"
              ry="30"
              fill="#e74c3c"
              initial={{ scaleY: 0.8 }}
              animate={{ scaleY: [0.8, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            />
            <ellipse cx="30" cy="70" rx="9" ry="6" fill="#fff" opacity=".4" />
          </svg>
        </motion.div>
        <h1 style={{ color: "#e74c3c", fontSize: "2.5rem", marginBottom: "1rem" }}>Donate Blood, Save Lives</h1>
        <p style={{ color: "#333", fontSize: "1.2rem", marginBottom: "2rem" }}>
          Join our mission to ensure safe and timely blood for all. Search blood, join a camp, or become a volunteer.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
          <motion.a
            href="/api/blood-bank/bank"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: "#e74c3c", color: "#fff", padding: "0.8rem 2rem", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}
          >
            Find/Request Blood
          </motion.a>
          <motion.a
            href="#blood-camp"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: "#fff", color: "#e74c3c", padding: "0.8rem 2rem", borderRadius: "6px", textDecoration: "none", border: "2px solid #e74c3c", fontWeight: "bold" }}
          >
            Join a Blood Camp
          </motion.a>
        </div>
      </section>
      
      {/* Features */}
      <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
        <motion.div
          whileHover={{ y: -10, scale: 1.04, boxShadow: "0 4px 32px #d9746a" }}
          style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 24px #ddd", padding: "2rem", width: "350px", minHeight: "280px", cursor: "pointer", transition: "box-shadow 0.3s" }}
        >
          <h2 id="blood-bank" style={{ color: "#e74c3c", marginBottom: "1rem" }}>Blood Bank</h2>
          <ul style={{ listStyle: "inside", color: "#555" }}>
            <li>Search blood by group, city, or availability</li>
            <li>Request urgent blood donations</li>
            <li>Register as a donor & track history</li>
            <li>Learn about eligibility and safety</li>
          </ul>
          <a href="#blood-bank-form" style={{ marginTop: "1.5rem", display: "inline-block", background: "#e74c3c", color: "#fff", padding: "0.6rem 1.3rem", borderRadius: "5px", fontWeight: "bold", textDecoration: "none" }}>Access Blood Bank</a>
        </motion.div>

        <motion.div
          whileHover={{ y: -10, scale: 1.04, boxShadow: "0 4px 32px #d9746a" }}
          style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 2px 24px #ddd", padding: "2rem", width: "350px", minHeight: "280px", cursor: "pointer", transition: "box-shadow 0.3s" }}
        >
          <h2 id="blood-camp" style={{ color: "#e74c3c", marginBottom: "1rem" }}>Blood Camps</h2>
          <ul style={{ listStyle: "inside", color: "#555" }}>
            <li>Upcoming & recent camps</li>
            <li>Sign up as donor or volunteer</li>
            <li>Host or propose a new camp</li>
            <li>View camp stories and gallery</li>
          </ul>
          <a href="#blood-camp-list" style={{ marginTop: "1.5rem", display: "inline-block", background: "#fff", color: "#e74c3c", padding: "0.6rem 1.3rem", borderRadius: "5px", fontWeight: "bold", border: "2px solid #e74c3c", textDecoration: "none" }}>View Blood Camps</a>
        </motion.div>
      </section>
      
      {/* Trust & Compliance */}
      <section style={{ padding: "2rem", textAlign: "center", background: "#ffe5e0" }}>
        <h3 style={{ color: "#e74c3c" }}>Why Donate?</h3>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ color: "#555" }}
        >
          Every donation saves up to three lives. Help us make a difference today.
        </motion.p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem", color: "#e74c3c", fontWeight: "bold" }}>
          <span>Certified Secure</span>
          <span>Trusted Partners</span>
          <span>100% Privacy</span>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ background: "#e74c3c", color: "#fff", textAlign: "center", padding: "1.2rem", marginTop: "2rem" }}>
        <div>Emergency Helpline: 1800-000-000 | contact@bloodlife.org</div>
        <div>&copy; {new Date().getFullYear()} BloodLife</div>
      </footer>
    </div>
  );
}

export default BankHome;



