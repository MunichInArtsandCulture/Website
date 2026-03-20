import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <div id="header">
        <h1><Link to="/">MIAAC<span>Munich in Arts and Culture </span></Link></h1>
        
        {/* Mobile Toggle Button */}
        <span 
          id="mobile-navigation" 
          className="mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer' 
          }}
        >
          {mobileMenuOpen ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </span>

        {/* Desktop Navigation */}
        <ul id="navigation" className="desktop-only">
          <li className={path === '/events' ? 'current' : ''}>
            <Link to="/events">Events</Link>
          </li>
          <li className={path === '/artspaces' ? 'current' : ''}>
            <Link to="/artspaces">Art Spaces</Link>
          </li>
          <li className={path === '/resources' ? 'current' : ''}>
            <Link to="/resources">Resources</Link>
          </li>
          <li className={path === '/jobs' ? 'current' : ''}>
            <Link to="/jobs">Creative Jobs</Link>
          </li>
          <li className={path === '/opencalls' ? 'current' : ''}>
            <Link to="/opencalls">Open Calls</Link>
          </li>
        </ul>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`mobile-sidebar mobile-only ${mobileMenuOpen ? 'open' : ''}`}>
        <ul>
          <li className={path === '/events' ? 'current' : ''}>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link>
          </li>
          <li className={path === '/artspaces' ? 'current' : ''}>
            <Link to="/artspaces" onClick={() => setMobileMenuOpen(false)}>Art Spaces</Link>
          </li>
          <li className={path === '/resources' ? 'current' : ''}>
            <Link to="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
          </li>
          <li className={path === '/jobs' ? 'current' : ''}>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Creative Jobs</Link>
          </li>
          <li className={path === '/opencalls' ? 'current' : ''}>
            <Link to="/opencalls" onClick={() => setMobileMenuOpen(false)}>Open Calls</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
