import { useState, useEffect, useRef } from 'react'

const data = {
  "Awareness Teams": [
    { title: "Aware & Care", link: "https://www.instagram.com/aware.andcare" },
    { title: "Awareness Medical Team", link: "https://www.instagram.com/awareness_medical_team" },
    { title: "Mindzone München", link: "https://www.instagram.com/mindzone.muenchen" }
  ],
  "Sound systems": [
    { title: "AVL", link: "https://www.instagram.com/avl_veranstaltungstechnik" },
    { title: "DNS/Funktion One", link: "https://funktion-one-bayern.de/" },
    { title: "Midas Touch Soundsystem", link: "https://www.instagram.com/midastouchsoundsystem" },
    { title: "Oktagon", link: "https://www.oktagon-kollektiv.de/soundsystem" },
    { title: "PA DOMI", link: "https://www.instagram.com/pa_domi_" },
    { title: "PA Light & Sound", link: "https://1pa.de/" },
    { title: "Schallfabrik Audio", link: "https://www.instagram.com/schallfabrikaudio" },
    { title: "SPA", link: "https://www.spa-audiolight.de/" },
    { title: "Sound Manufactory", link: "https://www.soundmanufactory.de/" },
    { title: "TukTuk Soundsystem", link: "https://www.instagram.com/tuktuk_soundsystem" },
    { title: "CORE//NELIUS (Available on Request)", link: "https://www.instagram.com/love.corenelius/" },
    { title: "isarbass (Available on Request)", link: "https://www.instagram.com/isarbass" },
    { title: "Nighttekk (Available on Request)", link: "https://www.instagram.com/nighttekk_" },
    { title: "Nuketekk (Available on Request)", link: "https://www.instagram.com/nuketekk.rave" },
    { title: "Tanzwut Kollektiv (Available on Request)", link: "https://www.instagram.com/tanzwut.kollektiv/" }
  ],
  "Tools, Materials, Workspaces": [
    { title: "AWM", link: "https://www.awm-muenchen.de/abfall-vermeiden/reparieren-statt-wegwerfen/repair-cafes" },
    { title: "Erfindergarden", link: "https://erfindergarden.de/" },
    { title: "Fablab", link: "https://www.fablab-muenchen.de/ueber-uns/" },
    { title: "H.Alle", link: "https://imalrepaircafe.wordpress.com/samstag/" },
    { title: "Hau der Eigenarbeit", link: "https://www.hei-muenchen.de/werkstaetten-und-selber-machen/" },
    { title: "Treibgut", link: "https://material-initiativen.org/treibgut-muenchen/" },
    { title: "Werkzeugbibliothek", link: "https://erfinder.myturn.com/library/" }
  ],
  "Lights": [
    { title: "AVL", link: "https://www.instagram.com/avl_veranstaltungstechnik" },
    { title: "Collective Lights", link: "https://www.instagram.com/collective_lights" },
    { title: "Hekktik", link: "https://www.instagram.com/hekktik.lights" },
    { title: "PA Light & Sound", link: "https://1pa.de/" },
    { title: "Ravestream Radio", link: "https://www.instagram.com/ravestreamradio" },
    { title: "SchubSchamane", link: "https://www.instagram.com/schubschamanevisuals" },
    { title: "Sound Manufactory", link: "https://www.soundmanufactory.de/" }
  ],
  "DJ Equipment": [
    { title: "Ravestream Radio", link: "https://www.instagram.com/ravestreamradio" },
    { title: "Schallfabrik Audio", link: "https://www.instagram.com/schallfabrikaudio" },
    { title: "Sound Manufactory", link: "https://www.soundmanufactory.de/" }
  ]
}

const CATEGORIES = ["Awareness Teams", "Sound systems", "Tools, Materials, Workspaces", "Lights", "DJ Equipment"]
const DEFAULT_CATEGORY = "Sound systems"

export default function Resources() {
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const entries = data[selectedCategory] || []

  return (
    <>
      <div className="title-box">
        <div className="filter">
          <label htmlFor="categorySelect">Select category:</label>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button
              id="dropdown-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedCategory}
            </button>
            <ul id="dropdown-options" className={dropdownOpen ? '' : 'hidden'}>
              {CATEGORIES.map(cat => (
                <li
                  key={cat}
                  data-value={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setDropdownOpen(false)
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div id="event-feed" style={{ marginBottom: '30px' }}>
        <ul className="blog">
          {entries.map((entry, i) => (
            <li key={i}>
              <h3><a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.title}</a></h3>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
