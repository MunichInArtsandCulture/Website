import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useApiCache } from './context/ApiCacheContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import ArtSpaces from './pages/ArtSpaces'
import Jobs from './pages/Jobs'
import Resources from './pages/Resources'
import HowToArt from './pages/HowToArt'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  const { startBackgroundPreload } = useApiCache()
  const location = useLocation()

  useEffect(() => {
    // Do not start preload if the user specifically enters via the Privacy Policy
    if (location.pathname === '/privacy') {
      return
    }
    
    // Start preloading the queue in background after initial render
    startBackgroundPreload()
  }, [startBackgroundPreload, location.pathname])

  return (
    <>
      <Header />
      <div id="body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/artspaces" element={<ArtSpaces />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/opencalls" element={<HowToArt />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
