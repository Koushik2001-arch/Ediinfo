import React, { useState, useEffect } from "react";  // Fixed: Added useEffect
import { Routes, Route, Navigate } from "react-router-dom";
import { Mail, Phone, PlayCircle, Award, Clock, UserCheck, Star, Search, Plus, Trash2, Edit3, Heart } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import AdminLogin from './component/AdminLogin';
import AdminDashboard from './component/AdminDashboard';
import ContactForm from './component/ContactForm';
import './index.css';

// Sample Data
const sampleJobs = [
  { id: 1, title: 'EDI Developer', company: 'RetailCorp', location: 'Remote', type: 'Full-time', experience: '2-4 yrs', desc: 'Map 850/856/810 transactions and support production.', email: '' },
  { id: 2, title: 'Sterling Integrator Engineer', company: 'LogiTech', location: 'Bengaluru', type: 'Contract', experience: '3+ yrs', desc: 'Design BPs, adapters and mappings in IBM Sterling.', email: '' }
];

const sampleQna = [
  { id: 1, q: 'What is EDI and why is it used?', a: 'EDI (Electronic Data Interchange) is a standard format for exchanging business documents between systems to automate B2B transactions and reduce manual processes.' },
  { id: 2, q: 'Explain EDI 850 and EDI 856.', a: '850 is a Purchase Order, 856 is an Advance Ship Notice (ASN). 850 initiates a purchase; 856 informs shipment details.' }
];

const alumni = [
  { name: 'Rahul Kumar', role: 'EDI Analyst', company: 'LogiShip Inc.', story: 'Started as a fresher with no experience; the hands-on mapping labs helped me build a portfolio that landed me a role in just 8 weeks.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80' },
  { name: 'Sana Patel', role: 'Integration Engineer', company: 'HealthData Solutions', story: 'Transitioned from QA testing to EDI specialist after the Sterling module—mock interviews boosted my confidence for the switch.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80' },
  { name: 'Arjun Reddy', role: 'Supply Chain Developer', company: 'GlobalTrade Corp.', story: 'From non-tech background, the free essentials module got me hooked; placed in a remote role with 20% salary hike.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
  { name: 'Priya Singh', role: 'EDI Consultant', company: 'BizConnect Ltd.', story: 'The placement pack with resume reviews turned my side hustle into a full-time consulting gig—grateful for the job board!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' }
];

const testimonials = [
  { name: 'Vikram Desai', role: 'EDI Dev', company: 'RetailCorp', feedback: 'The practical labs on AS2 and adapters were a game-changer—landed my dream job after one mock interview session.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80' },
  { name: 'Neha Gupta', role: 'Integration Engineer', company: 'LogiTech', feedback: 'Short, focused modules fit my work schedule; the Q&A section prepared me perfectly for technical rounds.', avatar: 'https://images.unsplash.com/photo-1524504388940-7b8e4a8c0e3e?w=150&q=80' },
  { name: 'Kiran Rao', role: 'Supply Chain Specialist', company: 'TradeFlow', feedback: 'Alumni network connected me to opportunities; success rate is real—78% placed, including me in under 3 months.', avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&q=80' },
  { name: 'Aisha Khan', role: 'EDI Support Lead', company: 'DataLink Global', feedback: 'From zero to hero: The production support module simulated real issues, making my transition seamless.', avatar: 'https://images.unsplash.com/photo-1499951360447-7b5f9a4c74a1?w=150&q=80' }
];

// Helper Components
function Stat({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function ProgressLine({ label, percent }) {
  return (
    <div>
      <div className="progress-label">{label} <span>{percent}%</span></div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function CourseOutcome({ title, bullets, price, highlight }) {
  return (
    <div className={`course-card ${highlight ? 'highlight' : ''}`}>
      <div className="course-content">
        <div>
          <div className="course-title">{title}</div>
          <ul className="course-bullets">
            {bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="course-price">{price}</div>
      </div>
    </div>
  );
}

// Enhanced Carousel for Stories/Success Stories
function Carousel({ items, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = items.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % slideCount);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [slideCount, isPaused]);

  const goToSlide = (index) => setCurrentIndex(index);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);

  return (
    <section className="carousel-section">
      <div className="app-container">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-wrapper" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <motion.div 
            className="carousel-slides" 
            animate={{ x: `-${currentIndex * (100 / Math.min(3, slideCount))}%` }} 
            style={{ cursor: 'pointer' }}
          >
            {items.map((item, index) => (
              <motion.div key={index} className="carousel-slide" whileHover={{ scale: 1.05, y: -5 }}>
                <div className="carousel-card">
                  <img src={item.avatar} alt={item.name} className="carousel-avatar" />
                  <h3 className="carousel-name">{item.name}</h3>
                  <p className="carousel-role">{item.role} at <span className="carousel-company">{item.company}</span></p>
                  <p className="carousel-text">"{item.story || item.feedback}"</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <button onClick={prevSlide} className="carousel-arrow carousel-arrow-left">‹</button>
          <button onClick={nextSlide} className="carousel-arrow carousel-arrow-right">›</button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`carousel-dot ${index === currentIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Main App Content
function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('token'));

  const handleAdminClick = () => setShowLogin(true);

  const ProtectedRoute = ({ children }) => {
    return localStorage.getItem('token') ? children : <Navigate to="/" />;
  };

  return (
    <MotionConfig>
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo">E</div>
              <div>
                <a href="#" className="logo-text">EDIINFO</a>
                <p className="logo-subtext">From beginner to placement — EDI training that works</p>
              </div>
            </div>
            <nav className="nav">
              <a href="#courses" className="nav-link">Courses</a>
              <a href="#jobs" className="nav-link">Jobs</a>
              <a href="#qna" className="nav-link">Interview Q&A</a>
              <a href="#students" className="nav-link">Alumni</a>
              <a href="#contact" className="join-button">Join Now</a>
              <button onClick={handleAdminClick} className={`admin-button ${isAdmin ? 'admin-active' : ''}`}>Admin</button>
            </nav>
          </div>
        </header>

        {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}

        <main className="main">
          <Routes>
            <Route path="/" element={
              <>
                <section className="hero">
                  <motion.h1 initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="hero-title">
                    Transform your career — <span className="highlight-text">Learn EDI</span> with hands-on projects and real job support
                  </motion.h1>
                  <p className="hero-description">Start small: complete a free module in 30 minutes. Build confidence, finish projects, and get placement guidance — everything designed for working professionals.</p>
                  <div className="hero-buttons">
                    <a href="#courses" className="start-button">Start Free Module <PlayCircle size={18} /></a>
                    <a href="#contact" className="call-button">Book Free Career Call</a>
                  </div>
                  <div className="stats">
                    <Stat icon={<Award size={18} />} value="92%" label="Course Completion" />
                    <Stat icon={<UserCheck size={18} />} value="78%" label="Placed Students" />
                    <Stat icon={<Clock size={18} />} value="6 wks" label="Avg Time to Job" />
                  </div>
                  <div className="motivation-strip">
                    <div className="motivation-icon"><Star size={22} className="star-icon" /></div>
                    <div>
                      <div className="motivation-title">Why this works</div>
                      <div className="motivation-text">Short lessons, hands-on labs, mock interviews, and job-focused projects — designed to get you hired.</div>
                    </div>
                  </div>
                </section>

                <section id="courses" className="courses">
                  <h2 className="section-title">Carefully designed courses — career-first</h2>
                  <p className="section-description">Each module ends with a project you can add to your portfolio. We focus on outcomes — not just theory.</p>
                  <div className="course-grid">
                    <CourseOutcome title="Beginner: EDI Essentials" bullets={["Free module — 30 min start","Understand 850, 856, 810","Mini-project included"]} price="Free" />
                    <CourseOutcome title="Professional: Sterling Mapping" bullets={["30 hours of labs","Build 10 maps","BP & Adapter setup"]} price="Contact for pricing" highlight />
                    <CourseOutcome title="Placement Pack" bullets={["Resume review","Mock interviews","Job board access"]} price="Contact for pricing" />
                  </div>
                </section>

                <Carousel items={alumni} title="Alumni Success Stories" />

                <section id="jobs" className="job-board">
                  <div className="job-board-header">
                    <div>
                      <h2 className="section-title">EDI Job Board</h2>
                      <p className="section-description">Curated EDI job openings with quick-apply and tips on tailoring your resume.</p>
                    </div>
                    <div className="job-board-controls">
                      <div className="search-container">
                        <input className="search-input" placeholder="Search jobs, company, location..." />
                        <div className="search-icon"><Search size={16} /></div>
                      </div>
                      {isAdmin && <button className="post-job-button"><Plus size={16} /> Post Job</button>}
                    </div>
                  </div>
                  <div className="job-list">
                    {sampleJobs.map(job => (
                      <article key={job.id} className="job-card">
                        <div>
                          <div className="job-header">
                            <div className="job-logo">{job.company?.charAt(0) || 'C'}</div>
                            <div>
                              <div className="job-title">{job.title}</div>
                              <div className="job-details">{job.company} • {job.location} • {job.type} • {job.experience}</div>
                            </div>
                          </div>
                          <p className="job-description">{job.desc}</p>
                        </div>
                        <div className="job-actions">
                          <a className="apply-button" href={`mailto:${job.email || 'hello@ediinfo.com'}`}>Quick Apply</a>
                          <button className="save-button">Save <Heart size={14} /></button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section id="qna" className="qna">
                  <div className="qna-header">
                    <div>
                      <h2 className="section-title">Interview Questions — Practice & Master</h2>
                      <p className="section-description">Short, powerful answers to common EDI interview questions. Practice by speaking aloud or using them in mock interviews.</p>
                    </div>
                    <div className="qna-tip">Tip: Turn answers into short bullet points for interview delivery.</div>
                  </div>
                  <div className="qna-list">
                    {sampleQna.map((qa) => (
                      <details key={qa.id} className="qna-item">
                        <summary className="qna-question">{qa.q}</summary>
                        <p className="qna-answer">{qa.a}</p>
                      </details>
                    ))}
                  </div>
                </section>

                <Carousel items={testimonials} title="What our students achieved" />

                <section id="contact" className="contact">
                  <h2 className="section-title">Ready to start your EDI career?</h2>
                  <p className="section-description">Book a free career call and we’ll map a learning plan for you.</p>
                  <div className="contact-grid">
                    <ContactForm />
                    <aside className="contact-info">
                      <div className="contact-item">
                        <div className="contact-icon"><Mail /></div>
                        <div>
                          <div className="contact-title">hello@ediinfo.com</div>
                          <div className="contact-subtext">We reply within 24 hours</div>
                        </div>
                      </div>
                      <div className="contact-item">
                        <div className="contact-icon"><Phone /></div>
                        <div>
                          <div className="contact-title">+91 98xxxxxxx</div>
                          <div className="contact-subtext">WhatsApp / Call</div>
                        </div>
                      </div>
                      <div className="contact-location">
                        <div className="contact-title">Location</div>
                        <div>Guntur, Andhra Pradesh, India</div>
                      </div>
                    </aside>
                  </div>
                </section>

                <footer className="footer">
                  <div className="footer-content">
                    <div>© {new Date().getFullYear()} EDIINFO — All rights reserved.</div>
                    <div className="footer-links">
                      <a href="#" className="footer-link">Privacy</a>
                      <a href="#" className="footer-link">Terms</a>
                      <a href="#" className="footer-link">Contact</a>
                    </div>
                  </div>
                </footer>
              </>
            } />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  );
}

export default AppContent;