import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  return (
    <div id="header">
      <h1><Link to="/">MIAAC<span>Munich in Arts and Culture </span></Link></h1>
      
      {/* Mobile Toggle Button */}
      <span 
        id="mobile-navigation" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer' 
        }}
      >
        <span 
          className="iconify" 
          data-icon={mobileMenuOpen ? "carbon:close" : "carbon:menu"}
          style={{ fontSize: '30px', color: '#363636' }}
        ></span>
      </span>

      <ul id="navigation" className={mobileMenuOpen ? 'mobile-open' : ''}>
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
  );
}
