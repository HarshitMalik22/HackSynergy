import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
// Squid Game Colors
const SQUID_PINK = '#FF357A';
const SQUID_GREEN = '#00FFB0';
const SQUID_BLACK = '#18181B';
const SQUID_WHITE = '#fff';

// Custom Cursor (Neon Pink Dot)
function CustomCursor() {
  const cursorRef = useRef(null);
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${SQUID_PINK} 70%, transparent 100%)`,
        boxShadow: `0 0 16px 4px ${SQUID_PINK}`,
        border: `2px solid ${SQUID_PINK}`,
        transform: 'translate3d(-100px, -100px, 0)'
      }}
    />
  );
}

// Animated Squid Game Shapes Background
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Neon Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#18181B] via-[#1a0022] to-[#0a021a] opacity-95" />
      {/* Animated Squid Game Shapes */}
      <svg className="absolute top-10 left-10 w-32 h-32 opacity-70 animate-spin-slow" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke={SQUID_PINK} strokeWidth="8" fill="none" filter="url(#glow)" />
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <svg className="absolute bottom-20 right-24 w-24 h-24 opacity-60 animate-pulse" viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" stroke={SQUID_GREEN} strokeWidth="8" fill="none" filter="url(#glow2)" />
        <defs>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <svg className="absolute top-1/2 left-1/2 w-20 h-20 opacity-50 animate-bounce" style={{transform: 'translate(-50%, -50%)'}} viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" stroke={SQUID_WHITE} strokeWidth="8" fill="none" filter="url(#glow3)" rx="12" />
        <defs>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

const features = [
  { title: 'Find Teammates', desc: 'Discover new team members or join projects.', icon: <svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" stroke={SQUID_PINK} strokeWidth="4" fill="none" /></svg> },
  { title: 'Manage Projects', desc: 'Stay organized with built-in tools.', icon: <svg width="36" height="36" viewBox="0 0 36 36"><polygon points="18,4 34,32 2,32" stroke={SQUID_GREEN} strokeWidth="4" fill="none" /></svg> },
  { title: 'Build Network', desc: 'Connect with students, mentors, and pros.', icon: <svg width="36" height="36" viewBox="0 0 36 36"><rect x="6" y="6" width="24" height="24" rx="6" stroke={SQUID_WHITE} strokeWidth="4" fill="none" /></svg> },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  const logoutHandler = async ()=>{

    try{

      const response = await axios.post("http://localhost:8080/api/auth/logout", {},{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log("RESPONSE = ", response);
      if(response.data.success){
        localStorage.removeItem("token");
        navigate("/login");
      }

    }catch(err){
      console.error("Error in logout", err);
      return;
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="font-sans min-h-screen relative overflow-x-hidden" style={{ background: SQUID_BLACK }}>
      <AnimatedBackground />
      <CustomCursor />
      {/* Sticky Navbar */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/80 border-b border-pink-500/30 shadow-glass"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <span className="font-extrabold text-2xl tracking-widest" style={{ color: SQUID_PINK, letterSpacing: '0.15em', fontFamily: 'Montserrat, sans-serif', textShadow: `0 0 8px ${SQUID_PINK}33` }}>H△CKSYNERGY</span>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 border border-pink-500 text-white font-semibold hover:bg-pink-600 transition"
            >
              <img
                src="https://i.pravatar.cc/40?img=1"
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-pink-400"
              />
              <span className="hidden sm:inline">Profile</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-black border border-pink-500 rounded-xl shadow-lg z-50">
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-pink-600 rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center relative pt-32 pb-16">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-6"
          style={{ color: SQUID_WHITE, textShadow: `0 2px 24px #000, 0 0 8px ${SQUID_PINK}33` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span style={{ color: SQUID_PINK }}>HackSynergy</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8 max-w-xl mx-auto"
          style={{ color: '#e5e7eb', textShadow: `0 1px 8px #000` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Find teammates, manage projects, and build your network with <span className="font-semibold" style={{ color: SQUID_PINK }}>HackSynergy</span>.<br />
          <span style={{ color: SQUID_GREEN }}>Inspired by Squid Game.</span>
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            whileHover={{ scale: 1.08, boxShadow: `0 0 24px 4px ${SQUID_PINK}` }}
            whileTap={{ scale: 0.98 }}
            href="/signup"
            className="px-10 py-4 rounded-2xl font-bold text-lg shadow-glass transition border-2 border-pink-500 bg-pink-600 hover:bg-pink-700 text-white neon-glow"
            style={{ boxShadow: `0 0 16px 2px ${SQUID_PINK}` }}
          >
            Join Now
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.08, boxShadow: `0 0 24px 4px ${SQUID_GREEN}` }}
            whileTap={{ scale: 0.98 }}
            href="#features"
            className="px-10 py-4 rounded-2xl font-bold text-lg border-2 border-green-400 bg-black/60 text-green-300 hover:bg-green-900/40 transition neon-glow"
            style={{ boxShadow: `0 0 16px 2px ${SQUID_GREEN}` }}
          >
            Explore Features
          </motion.a>
        </div>
        {/* Floating Start Game Button */}
        <motion.a
          href="#features"
          className="fixed bottom-10 right-10 px-8 py-4 rounded-full font-bold text-xl bg-pink-600 text-white border-4 border-pink-400 shadow-xl neon-glow z-50 animate-bounce hover:scale-110 hover:bg-pink-700 transition"
          style={{ boxShadow: `0 0 32px 8px ${SQUID_PINK}` }}
          whileHover={{ scale: 1.12 }}
        >
          ▶ Start Game
        </motion.a>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: SQUID_GREEN, textShadow: `0 1px 8px #000` }}>Why HackSynergy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="rounded-2xl bg-black/80 shadow-glass p-8 text-center hover:scale-105 transition border-2 neon-glow"
                style={{
                  borderColor: i === 0 ? SQUID_PINK : i === 1 ? SQUID_GREEN : SQUID_WHITE,
                  boxShadow: `0 0 24px 2px ${i === 0 ? SQUID_PINK : i === 1 ? SQUID_GREEN : SQUID_WHITE}`,
                  color: SQUID_WHITE
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                whileHover={{ scale: 1.08, boxShadow: `0 0 32px 8px ${i === 0 ? SQUID_PINK : i === 1 ? SQUID_GREEN : SQUID_WHITE}` }}
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-2xl font-semibold mb-2" style={{ color: i === 0 ? SQUID_PINK : i === 1 ? SQUID_GREEN : SQUID_WHITE, textShadow: '0 1px 8px #000' }}>{f.title}</h3>
                <p className="text-slate-300" style={{ color: '#e5e7eb' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 bg-black/90 border-t border-pink-900">
        &copy; {new Date().getFullYear()} HackSynergy. All rights reserved.
      </footer>
      {/* Extra styles for neon glow */}
      <style>{`
        .neon-glow {
          text-shadow: 0 0 8px ${SQUID_PINK}, 0 0 16px ${SQUID_PINK};
          box-shadow: 0 0 16px 2px ${SQUID_PINK}, 0 0 32px 8px ${SQUID_PINK};
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 