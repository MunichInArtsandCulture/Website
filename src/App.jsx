import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  const { startBackgroundPreload } = useApiCache()

  useEffect(() => {
    // Start preloading the queue in background after initial render
    startBackgroundPreload()
  }, [startBackgroundPreload])

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
        </Routes>
      </div>
      <Footer />
    </>
  )
}
