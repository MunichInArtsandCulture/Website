import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const path = location.pathname

  return (
    <div className="sidebar">
      <div className="sidebar-gradient-l2r"></div>
      <div className="sidebar-gradient-t2b"></div>
      <div className="sidebar-highlight-ellipse"></div>

      <Link to="/" className={`home-button${path === '/' ? ' active' : ''}`}>
        <img src="/logo.png" alt="Home" />
      </Link>

      {path === '/events' ? (
        <div className="button-wrapper btn-events active">
          <button>
            <p className="text-events">Events</p>
            <span className="ball"></span>
          </button>
        </div>
      ) : (
        <Link to="/events" className="button-wrapper btn-events">
          <button>
            <p className="text-events">Events</p>
            <span className="ball"></span>
          </button>
        </Link>
      )}

      {path === '/artspaces' ? (
        <div className="button-wrapper btn-artspaces active">
          <button>
            <p className="text-artspaces">Art<br />Spaces</p>
            <span className="ball"></span>
          </button>
        </div>
      ) : (
        <Link to="/artspaces" className="button-wrapper btn-artspaces">
          <button>
            <p className="text-artspaces">Art<br />Spaces</p>
            <span className="ball"></span>
          </button>
        </Link>
      )}

      {path === '/resources' ? (
        <div className="button-wrapper btn-artistwiki active">
          <button>
            <p className="text-artistwiki">Event<br />Resources</p>
            <span className="ball"></span>
          </button>
        </div>
      ) : (
        <Link to="/resources" className="button-wrapper btn-artistwiki">
          <button>
            <p className="text-artistwiki">Event<br />Resources</p>
            <span className="ball"></span>
          </button>
        </Link>
      )}

      {path === '/jobs' ? (
        <div className="button-wrapper btn-creativejobs active">
          <button>
            <p className="text-creativejobs">Creative<br />Jobs</p>
            <span className="ball"></span>
          </button>
        </div>
      ) : (
        <Link to="/jobs" className="button-wrapper btn-creativejobs">
          <button>
            <p className="text-creativejobs">Creative<br />Jobs</p>
            <span className="ball"></span>
          </button>
        </Link>
      )}

      <div className="button-wrapper btn-opencalls">
        <button>
          <p className="text-opencalls">Open&nbsp;Calls</p>
          <span className="ball"></span>
        </button>
      </div>
    </div>
  )
}
