import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import ArtSpaces from './pages/ArtSpaces'
import Jobs from './pages/Jobs'
import Resources from './pages/Resources'

export default function App() {
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
          <Route path="/opencalls" element={<div>Open Calls</div>} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
