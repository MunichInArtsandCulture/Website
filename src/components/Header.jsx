import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div id="header">
      <h1><Link to="/">MIAAC<span>Munich in Arts and Culture </span></Link></h1>
      <ul id="navigation">
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
  );
}
