import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand-link">
          <span className="font-extrabold text-2xl tracking-widest">H△CKSYNERGY</span>
        </Link>
      </div>

      <div className="nav-center">
        <Link to="/features" className="nav-link">Features</Link>
        <Link to="/pricing" className="nav-link">Pricing</Link>
        <Link to="/company" className="nav-link">Company</Link>
        <Link to="/resources" className="nav-link">Resources</Link>
      </div>

      <div className="nav-right">
        <Link to="/login" className="nav-link login">Login</Link>
        <Link to="/signup" className="signup-button">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar; 