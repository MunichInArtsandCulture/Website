import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div id="header">
        <h1><Link to="/">MIAAC<span>Munich in Arts and Culture</span></Link></h1>

        {/* Mobile Toggle Button */}
        <span
          id="mobile-navigation"
          className="mobile-only"
          ref={toggleRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#363636" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>

        {/* Desktop Navigation */}
        <ul id="navigation" className="desktop-only">
          <li className={path === '/opencalls' ? 'current' : ''}>
            <Link to="/opencalls">How to Art</Link>
          </li>
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
        </ul>
      </div>

      {/* Mobile Overlay to catch clicks outside the menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay mobile-only"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.25)', // Subtle tint to show it's active
            zIndex: 999, // Below sidebar (1000) but above everything else
          }}
        />
      )}

      {/* Mobile Sidebar Navigation */}
      <div
        ref={sidebarRef}
        className={`mobile-sidebar mobile-only ${mobileMenuOpen ? 'open' : ''}`}
        style={{ zIndex: 1000 }} // Ensure it's above the overlay
      >
        <ul>
          <li className={path === '/opencalls' ? 'current' : ''}>
            <Link to="/opencalls" onClick={() => setMobileMenuOpen(false)}>How to Art</Link>
          </li>
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
        </ul>
      </div>
    </>
  );
}
