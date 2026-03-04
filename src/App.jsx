import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Events from './pages/Events'
import ArtSpaces from './pages/ArtSpaces'
import Jobs from './pages/Jobs'
import Resources from './pages/Resources'
import { useLocation } from 'react-router-dom'

const homeTextMap = {
  '/': { letters: ['h', 'o', 'm', 'e'], className: 'home-page' },
  '/events': { letters: ['e', 'v', 'e', 'n', 't', 's'], className: '' },
  '/artspaces': { letters: ['a', 'r', 't', null, 's', 'p', 'a', 'c', 'e', 's'], className: '' },
  '/jobs': { letters: ['c', 'r', 'e', 'a', 't', 'i', 'v', 'e', null, 'j', 'o', 'b', 's'], className: '' },
  '/resources': { letters: ['r', 'e', 's', 'o', 'u', 'r', 'c', 'e', 's'], className: '' },
}

function HomeText() {
  const location = useLocation()
  const config = homeTextMap[location.pathname] || homeTextMap['/']
  const isHome = location.pathname === '/'

  return (
    <div className={`home-text ${config.className}`}>
      {config.letters.map((letter, i) => {
        if (letter === null) {
          return <span key={i} style={{ display: 'block', marginTop: i === 0 ? undefined : '-55px' }}><br /></span>
        }
        const style = {}
        if (isHome) {
          if (i === 0) style.marginTop = '-20px'
        } else {
          if (i === 0 && location.pathname === '/events') {
            style.marginTop = '-20px'
          } else if (i > 0) {
            style.display = 'block'
            style.marginTop = '-55px'
          }
        }
        return <span key={i} style={style}>{letter}</span>
      })}
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isResources = location.pathname === '/resources'

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <HomeText />
        <div className={`main-content${isResources ? ' resources-page' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/artspaces" element={<ArtSpaces />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
