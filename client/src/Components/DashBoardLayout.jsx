import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/DashboardLayout.css';

// Squid Game + Modern SaaS Colors
const SQUID_PINK = '#FF357A';
const SQUID_GREEN = '#00FFB0';
const SQUID_BLACK = '#18181B';
const SQUID_WHITE = '#fff';
const SQUID_PURPLE = '#2a0036';
const SQUID_BLUE = '#23234b';

// Animated Squid Game Shapes for Sidebar
function SidebarBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <svg className="absolute top-6 left-6 w-16 h-16 opacity-60 animate-spin-slow" viewBox="0 0 100 100">
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
      <svg className="absolute bottom-10 right-8 w-12 h-12 opacity-50 animate-pulse" viewBox="0 0 100 100">
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
      <svg className="absolute top-1/2 left-1/2 w-10 h-10 opacity-40 animate-bounce" style={{transform: 'translate(-50%, -50%)'}} viewBox="0 0 100 100">
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

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    // { path: '/hackathons', label: 'Hackathons', icon: (
    //   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
    //   </svg>
    // )},
    { path: '/teams', label: 'Teams', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { path: '/project-board', label: 'Project Board', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { path: '/find-teammates', label: 'Find Teammates', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { path: '/events', label: 'Hackathons', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { path: '/video-call', label: 'Video Call', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        <path d="M16 10l6-3v10l-6-3" />
        <circle cx="8.5" cy="12" r="2.5" />
        <path d="M14 12h-2" />
      </svg>
    )},
    { path: '/joined-teams', label: 'Joined Teams', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
      </svg>
    )}
  ];

  const bottomNavItems = [
    { path: '/profile', label: 'Profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { path: '/settings', label: 'Settings', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { path: '/feedback', label: 'Feedback', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )},
    { path: '/help', label: 'Help', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
  ];

  return (
    <div className={`dashboard ${theme}`} style={{ minHeight: '100vh', background: `radial-gradient(ellipse at 60% 10%, #2a0036 0%, #18181B 100%)`, position: 'relative' }}>
      {/* Animated, blurred, gradient background shapes */}
      <div style={{
        position: 'fixed',
        zIndex: 0,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 80% 20%, #FF357A33 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #00FFB033 0%, transparent 60%)',
        filter: 'blur(60px)',
        opacity: 0.7,
      }} />
      <motion.div
        className={`sidebar glass-card ${isSidebarCollapsed ? 'collapsed' : ''} relative`}
        initial={false}
        animate={{ width: isSidebarCollapsed ? '72px' : '260px' }}
        style={{
          background: `rgba(24,24,27,0.85)`,
          borderRight: `2px solid #2a0036`,
          boxShadow: '0 8px 32px 0 #18181B88',
          overflow: 'hidden',
          paddingTop: 0,
          paddingBottom: 0,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRadius: '32px',
          margin: '18px 0 18px 18px',
          minHeight: 'calc(100vh - 36px)',
          zIndex: 10,
        }}
      >
        {/* Animated gradient bar behind sidebar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(120deg, #FF357A22 0%, #00FFB022 100%)',
          opacity: 0.25,
          pointerEvents: 'none',
        }} />
        <div className="sidebar-toggle" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'64px'}}>
          <button
            className="menu-toggle magnetic-button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{background:'none',border:'none',padding:0,margin:0}}
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="sidebar-header" style={{paddingTop: 24, paddingBottom: 24}}>
          <Link to="/" className="brand-logo" style={{color: SQUID_PINK, fontWeight: 800, fontSize: 22, letterSpacing: '0.12em', textShadow: `0 0 8px ${SQUID_PINK}33`}}>
            <svg viewBox="0 0 24 24" width="32" height="32" stroke={SQUID_PINK} fill="none" style={{marginRight: 10, filter: `drop-shadow(0 0 8px ${SQUID_PINK}99)`}}>
              <circle cx="12" cy="12" r="10" stroke={SQUID_PINK} strokeWidth="2" fill="none" />
              <polygon points="12,6 18,18 6,18" stroke={SQUID_GREEN} strokeWidth="2" fill="none" />
              <rect x="7" y="7" width="10" height="10" rx="2" stroke={SQUID_WHITE} strokeWidth="2" fill="none" />
            </svg>
            {!isSidebarCollapsed && <span className="brand-text">HackSynergy</span>}
          </Link>
        </div>
        <nav className="nav-items" style={{gap: 18, paddingTop: 18, paddingBottom: 18}}>
          {navItems.map((item, idx) => {
            const active = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.06, backgroundColor: '#23232b' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{marginBottom: 8, borderRadius: 16, position: 'relative'}}
              >
                <Link
                  to={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{
                    background: active ? `rgba(255,53,122,0.16)` : 'rgba(255,255,255,0.02)',
                    color: active ? SQUID_PINK : SQUID_WHITE,
                    fontWeight: 600,
                    borderLeft: active ? `4px solid ${SQUID_PINK}` : '4px solid transparent',
                    boxShadow: active ? `0 2px 16px 0 ${SQUID_PINK}33` : '0 1.5px 6px 0 #23234b22',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: isSidebarCollapsed ? '14px 0' : '14px 22px',
                    position: 'relative',
                    minHeight: 48,
                    borderRadius: 14,
                    fontSize: 16,
                    letterSpacing: '0.04em',
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon" style={{ color: active ? SQUID_PINK : SQUID_GREEN, filter: `drop-shadow(0 0 8px ${active ? SQUID_PINK : SQUID_GREEN}99)`, marginRight: isSidebarCollapsed ? 0 : 16 }}>{item.icon}</span>
                  {!isSidebarCollapsed && <span className="nav-item-label">{item.label}</span>}
                  {active && <span style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:7,height:36,borderRadius:8,background:SQUID_PINK,boxShadow:`0 0 16px 2px ${SQUID_PINK}99`,opacity:0.7}}></span>}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="bottom-nav" style={{gap: 14, paddingTop: 16, paddingBottom: 16}}>
          {bottomNavItems.map((item, idx) => {
            const active = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.06, backgroundColor: '#23232b' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{marginBottom: 6, borderRadius: 14, position: 'relative'}}
              >
                <Link
                  to={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{
                    background: active ? `rgba(0,255,176,0.13)` : 'rgba(255,255,255,0.02)',
                    color: active ? SQUID_GREEN : SQUID_WHITE,
                    fontWeight: 600,
                    borderLeft: active ? `4px solid ${SQUID_GREEN}` : '4px solid transparent',
                    boxShadow: active ? `0 2px 16px 0 ${SQUID_GREEN}33` : '0 1.5px 6px 0 #23234b22',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: isSidebarCollapsed ? '14px 0' : '14px 22px',
                    position: 'relative',
                    minHeight: 48,
                    borderRadius: 14,
                    fontSize: 16,
                    letterSpacing: '0.04em',
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)',
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon" style={{ color: active ? SQUID_GREEN : SQUID_PINK, filter: `drop-shadow(0 0 8px ${active ? SQUID_GREEN : SQUID_PINK}99)`, marginRight: isSidebarCollapsed ? 0 : 16 }}>{item.icon}</span>
                  {!isSidebarCollapsed && <span className="nav-item-label">{item.label}</span>}
                  {active && <span style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:7,height:36,borderRadius:8,background:SQUID_GREEN,boxShadow:`0 0 16px 2px ${SQUID_GREEN}99`,opacity:0.7}}></span>}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {/* Main Content Area with blurred, gradient background and a Welcome Card */}
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{
        background: 'rgba(24,24,27,0.85)',
        minHeight: '100vh',
        borderRadius: '32px',
        margin: '18px 18px 18px 0',
        boxShadow: '0 8px 32px 0 #18181B88',
        padding: '48px 36px 36px 36px',
        position: 'relative',
        zIndex: 2,
        overflow: 'visible',
      }}>
        {/* Example Welcome Card */}
        <div style={{
          background: 'linear-gradient(120deg, #FF357A22 0%, #00FFB022 100%)',
          borderRadius: 24,
          boxShadow: '0 4px 32px 0 #FF357A22',
          padding: '32px 32px',
          marginBottom: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          <div style={{flex: 1}}>
            <h2 style={{fontSize: 32, fontWeight: 800, color: SQUID_PINK, marginBottom: 8, letterSpacing: '0.04em'}}>Welcome to HackSynergy!</h2>
            <p style={{fontSize: 18, color: SQUID_WHITE, opacity: 0.85, marginBottom: 0}}>Find teammates, manage projects, and build your network in style. Explore the dashboard and get started!</p>
          </div>
          <div style={{flexShrink: 0}}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" stroke={SQUID_PINK} strokeWidth="6" fill="none" />
              <polygon points="40,18 62,62 18,62" stroke={SQUID_GREEN} strokeWidth="6" fill="none" />
              <rect x="24" y="24" width="32" height="32" rx="8" stroke={SQUID_WHITE} strokeWidth="6" fill="none" />
            </svg>
          </div>
        </div>
        {/* Main children content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout; 