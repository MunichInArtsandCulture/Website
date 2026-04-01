import { useState, useEffect, useRef } from 'react'
import { useApiCache, DATA_SOURCES } from '../context/ApiCacheContext'

const API_URL = DATA_SOURCES.RESOURCES

const DEFAULT_CATEGORY = "Funding"

export default function Resources() {
  const { getCached, fetchWithPriority } = useApiCache()
  const [data, setData] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [expandedRow, setExpandedRow] = useState(null)
  const [expandedTimeRow, setExpandedTimeRow] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const sortDropdownRef = useRef(null)

  // Reset expanded rows when category changes
  useEffect(() => {
    setExpandedRow(null)
    setExpandedTimeRow(null)
    setSortConfig({ key: null, direction: 'asc' })
  }, [selectedCategory])

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    const cached = getCached(API_URL)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchWithPriority(API_URL, true)
      .then(json => {
        if (!json) throw new Error("Could not load resources");
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Die Daten konnten nicht geladen werden. Bitte stelle sicher, dass die Datei resources.json (oder dein Google Sheet) erreichbar ist.")
        setLoading(false)
      })
  }, [getCached, setCached])

  const categories = data ? Object.keys(data).sort((a, b) => {
    if (a === 'Funding') return -1
    if (b === 'Funding') return 1
    return 0
  }) : []

  // If the selected category doesn't exist yet in the data, default to the first one available
  useEffect(() => {
    if (data && categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [data, categories, selectedCategory])

  const entries = data ? data[selectedCategory] || [] : []
  const isToolsCategory = selectedCategory.toLowerCase().includes("tools")

  // Normalize entries for sorting
  const normalizedEntries = entries.map(entry => ({
    ...entry,
    _name: entry.Name || entry.name || entry.Title || entry.title || entry.Soundsystem || entry['DJ Equipment'] || entry.Equipment || '',
    _location: entry.Location || entry.location || entry.District || entry.district || entry.Ort || entry.ort || '',
  }))

  const sortedEntries = [...normalizedEntries].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aVal = (a[sortConfig.key] || '').toString().trim()
    const bVal = (b[sortConfig.key] || '').toString().trim()
    const compare = aVal.localeCompare(bVal, 'de', { sensitivity: 'base' })
    return sortConfig.direction === 'asc' ? compare : -compare
  })

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '▼'
    return sortConfig.direction === 'asc' ? '▲' : '▼'
  }

  // Hardcoded CATEGORIES to ensure consistent labels during and after loading.
  // The 'id' must match the sheet name in the Google Spreadsheet.
  const CATEGORIES = [
    { id: 'Funding', label: 'Funding' },
    { id: 'Tools/Workspaces', label: 'Tools/Makerspaces' },
    { id: 'Soundsystems', label: 'Soundsystems' },
    { id: 'DJ Equipment', label: 'DJ Equipment' },
    { id: 'Lights', label: 'Lights' },
    { id: 'Merch production', label: 'Merch production' },
    { id: 'Awareness Teams', label: 'Awareness teams' }
  ]

  return (
    <>
      <div className="title-box">
        {/* Desktop View Tabs */}
        <div className="date-selector desktop-only" style={{ marginBottom: '2rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setExpandedRow(null)
                setExpandedTimeRow(null)
                setSortConfig({ key: null, direction: 'asc' })
              }}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontFamily: 'Inter',
                border: '1px solid #b6d8cf',
                background: selectedCategory === cat.id ? '#1E7A62' : 'white',
                color: selectedCategory === cat.id ? 'white' : '#363636',
                cursor: 'pointer',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
                width: 'auto'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile View Filters */}
        <div className="filter mobile-only" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>

          {/* Horizontally scrolling category buttons */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '6px', paddingBottom: '5px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setExpandedRow(null)
                  setExpandedTimeRow(null)
                  setSortConfig({ key: null, direction: 'asc' })
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  border: '1px solid #b6d8cf',
                  background: selectedCategory === cat.id ? '#1E7A62' : 'white',
                  color: selectedCategory === cat.id ? 'white' : '#363636',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  maxWidth: 'fit-content',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ width: 'auto', alignSelf: 'flex-start' }}>
            <div className="custom-dropdown" ref={sortDropdownRef} style={{ zIndex: sortDropdownOpen ? 1001 : 999, width: '100%' }}>
              <button
                id="dropdown-button"
                className="no-triangle"
                style={{ width: 'auto', flex: 'initial', maxWidth: 'fit-content', fontSize: '15px', border: '1px solid #b6d8cf', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '10px 15px' }}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 12 12"><path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 2.75m2 3A.75.75 0 0 1 3.75 5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 3 5.75M5.25 8a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5z"></path></svg>
                  <span>Sort by</span>
                </div>
              </button>
              <ul id="dropdown-options" className={sortDropdownOpen ? '' : 'hidden'} style={{ background: 'white', border: '1px solid rgb(182, 216, 207)', borderRadius: '20px', marginTop: '2px', padding: '0px', overflowY: 'auto', overflowX: 'hidden', maxHeight: '250px', WebkitOverflowScrolling: 'touch' }}>
                {['_name', '_location'].flatMap((key, idx, arr) => {
                  const label = key === '_name' ? 'Name' : 'Location'
                  return [
                    <li
                      key={`${key}-asc`}
                      onClick={() => {
                        setSortConfig({ key, direction: 'asc' })
                        setExpandedRow(null)
                        setSortDropdownOpen(false)
                      }}
                      className={sortConfig.key === key && sortConfig.direction === 'asc' ? 'active' : ''}
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '0 10px', borderBottom: '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
                    >
                      <span style={{ fontSize: '10px', color: '#444' }}>▲</span> <span>{label}</span>
                    </li>,
                    <li
                      key={`${key}-desc`}
                      onClick={() => {
                        setSortConfig({ key, direction: 'desc' })
                        setExpandedRow(null)
                        setSortDropdownOpen(false)
                      }}
                      className={sortConfig.key === key && sortConfig.direction === 'desc' ? 'active' : ''}
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '0 10px', borderBottom: (idx === arr.length - 1) ? 'none' : '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
                    >
                      <span style={{ fontSize: '10px', color: '#444' }}>▼</span> <span>{label}</span>
                    </li>
                  ]
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="event-feed" style={{ marginBottom: '30px' }}>
        {loading && (
          <div className="loading-spinner-overlay">
            <span className="loader"></span>
          </div>
        )}

        {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

        {!loading && !error && (
          <ul className="blog">
            {sortedEntries.length === 0 ? (
              <li><p>No resources found for this category.</p></li>
            ) : (
              sortedEntries.map((entry, i) => {
                const isExpanded = expandedRow === i
                const isTimeExpanded = expandedTimeRow === i

                const isSpecialMediaCategory = selectedCategory.toLowerCase().includes("soundsystem") ||
                  selectedCategory.toLowerCase().includes("dj") ||
                  selectedCategory.toLowerCase().includes("lights") ||
                  selectedCategory.toLowerCase().includes("awareness") ||
                  selectedCategory.toLowerCase().includes("tools")

                if (isSpecialMediaCategory) {
                  const isTools = selectedCategory.toLowerCase().includes("tools")
                  const name = entry.Name || entry.name || entry.Title || entry.title || entry.Soundsystem || entry['DJ Equipment'] || entry.Equipment || 'Unnamed Resource'
                  const location = entry.Location || entry.location || entry.District || entry.district || entry.Ort || entry.ort || ''
                  const host = entry.Host || entry.host || ''
                  const specs = entry.Specs || entry.specs || entry.Equipment || entry.equipment || entry.System || entry.system || ''
                  const description = entry.Description || entry.description || entry.Decription || entry.decription || entry.About || entry.about || entry.Info || entry.info || entry.long_text || ''
                  const shortText = entry.short_text || entry.Short_text || entry.Short_Text || ''
                  const costs = entry.Costs || entry.costs || entry.Price || entry.price || ''
                  const linkUrl = entry.Link || entry.link || entry.Url || entry.url || ''
                  const href = linkUrl ? (linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`) : null
                  
                  // Today's opening time for tools
                  let todayTime = ''
                  if (isTools) {
                    const jsDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                    const todayStr = jsDays[new Date().getDay()]
                    
                    const getTimeForDay = (day) => {
                      const d = day.toLowerCase()
                      const d2 = d.substring(0, 2)
                      const g = d === 'mon' ? 'mo' : d === 'tue' ? 'di' : d === 'wed' ? 'mi' : d === 'thu' ? 'do' : d === 'fri' ? 'fr' : d === 'sat' ? 'sa' : 'so'
                      const variations = [
                        `opening_${d}`, d, day, 
                        `opening_${d2}`, d2, day.substring(0, 2),
                        `opening_${g}`, g, g.charAt(0).toUpperCase() + g.charAt(1),
                        d === 'mon' ? 'monday' : d === 'tue' ? 'tuesday' : d === 'wed' ? 'wednesday' : d === 'thu' ? 'thursday' : d === 'fri' ? 'friday' : d === 'sat' ? 'saturday' : 'sunday'
                      ]
                      for (const v of variations) {
                        if (entry[v] && entry[v].toString().toLowerCase() !== 'na' && entry[v].toString().trim() !== '') return entry[v]
                      }
                      return 'closed'
                    }
                    todayTime = getTimeForDay(todayStr)
                  }

                  return (
                    <li key={i} style={{ padding: '24px 0', borderTop: 'none', borderBottom: '1.6px solid #c7c7c7', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ cursor: 'pointer', paddingRight: '12px', paddingTop: '2px' }} onClick={() => setExpandedRow(isExpanded ? null : i)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F3F3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 700, fontSize: '24px', fontFamily: 'Inter', color: '#3F3F3F', marginBottom: '2px', letterSpacing: '-0.02em', cursor: href ? 'auto' : 'pointer' }} onClick={() => { if (!href) setExpandedRow(isExpanded ? null : i) }}>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                              {name}
                            </a>
                          ) : name}
                        </div>
                        
                        {(host || location) && (
                          <div style={{ fontFamily: 'Inter', fontWeight: 650, fontSize: '16px', color: '#6D6D6D', marginBottom: '2px' }}>
                            {host}{host && location ? ' • ' : ''}{location}
                          </div>
                        )}

                        {shortText && (
                          <div
                            onClick={() => setExpandedRow(isExpanded ? null : i)}
                            style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#707070', lineHeight: '1.4', letterSpacing: '-0.3px', cursor: 'pointer', marginBottom: isTools ? '4px' : (isExpanded ? '16px' : '8px') }}
                          >
                            {shortText}
                          </div>
                        )}

                        {isTools && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', fontFamily: 'Inter', fontSize: '16px', fontWeight: 650, color: '#685769', marginBottom: isExpanded ? '16px' : '4px' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11m1-17.5h-2v6.914l4 4L16.414 15L13 11.586z" />
                              </svg>
                              <span>{todayTime}</span>
                            </div>
                            {costs && costs.trim().toUpperCase() !== 'NA' && (
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 17 24" fill="currentColor">
                                  <path d="m16.64 20.097l.597 2.71a.5.5 0 0 1-.053.385l.001-.002a.54.54 0 0 1-.286.246l-.004.001l-.086.017a.8.8 0 0 1-.174.059l-.005.001q-.11.026-.273.08t-.366.094q-.205.042-.434.086t-.511.086t-.571.08t-.622.051q-.333.017-.656.017a11.3 11.3 0 0 1-7.002-2.246l.03.021a11.04 11.04 0 0 1-4.039-5.914l-.018-.077H.549a.553.553 0 0 1-.546-.545V13.32a.553.553 0 0 1 .545-.546h1.125q-.034-.971.017-1.79H.527a.525.525 0 0 1-.525-.525v-.022v.001v-1.964c0-.29.235-.525.525-.525h.022h-.001h1.67a11.16 11.16 0 0 1 4.118-5.738l.033-.022A11.26 11.26 0 0 1 13.199 0h-.007h.066c1.151 0 2.268.143 3.335.412l-.094-.02c.142.046.26.136.339.254l.001.002a.56.56 0 0 1 .05.413l.001-.004l-.733 2.71a.5.5 0 0 1-.238.331l-.002.001a.49.49 0 0 1-.412.041l.003.001l-.068-.017q-.068-.017-.196-.042l-.298-.06l-.383-.06l-.443-.051l-.494-.042l-.503-.017l-.1-.001c-1.393 0-2.69.407-3.78 1.109l.028-.017A6.8 6.8 0 0 0 6.728 7.9l-.017.043h7.978a.56.56 0 0 1 .546.651v-.003l-.409 1.943a.5.5 0 0 1-.548.443h.002h-8.32a15 15 0 0 0 .002 1.832l-.002-.043h7.831c.17 0 .321.08.419.204l.001.001a.55.55 0 0 1 .102.464l.001-.004l-.409 1.909a.55.55 0 0 1-.527.443H6.784c1.036 2.558 3.5 4.33 6.378 4.33h.069h-.003q.307 0 .614-.026t.571-.06t.503-.08t.418-.086l.315-.08l.205-.051l.086-.034a.5.5 0 0 1 .445.036l-.002-.001c.134.077.23.208.258.362z" />
                                </svg>
                                <span>{costs.replace(/€|EUR|€/gi, '').trim()}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {!isExpanded && description && description.trim().toUpperCase() !== 'NA' && !isTools && (
                          <div
                            onClick={() => setExpandedRow(i)}
                            style={{ 
                              fontFamily: 'Inter', 
                              fontWeight: 400, 
                              fontSize: '15.5px', 
                              color: '#9E9E9E', 
                              lineHeight: '1.45', 
                              cursor: 'pointer', 
                              marginTop: (host || location || shortText) ? '2px' : '0px',
                              letterSpacing: '-0.3px'
                            }}
                          >
                            {description.length > 80 ? `${description.substring(0, 80).trim()} ...` : description}
                          </div>
                        )}

                        {isExpanded && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {description && (
                              <div
                                onClick={() => setExpandedRow(null)}
                                style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#3F3F3F', lineHeight: '1.6', letterSpacing: '-0.01em', cursor: 'pointer' }}
                              >
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{description}</p>
                              </div>
                            )}
                            {specs && (
                              <div style={{ marginTop: description ? '0px' : '0px' }}>
                                <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc', fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#685769', lineHeight: '1.5' }}>
                                  {specs.split('\n').filter(s => s.trim() !== '').map((spec, idx) => {
                                    let text = spec.trim()
                                    if (text.startsWith('-') || text.startsWith('•') || text.startsWith('*')) text = text.substring(1).trim()
                                    return <li key={idx} style={{ paddingBottom: '4px', paddingTop: 0, borderTop: 'none', background: 'transparent' }}>{text}</li>
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                }



                // Default logic for other categories
                const titleKey = Object.keys(entry).find(k => ['name', 'anbieter', 'title'].includes(k.toLowerCase()))
                const title = titleKey ? entry[titleKey] : 'Unnamed Resource'

                const linkKey = Object.keys(entry).find(k => ['link', 'url'].includes(k.toLowerCase()))
                let link = linkKey ? entry[linkKey] : null

                if (link && !link.startsWith('http') && link.includes('@') && !link.startsWith('mailto:')) {
                  link = `mailto:${link}`
                } else if (link && !link.startsWith('http') && !link.startsWith('mailto:')) {
                  link = `https://${link}`
                }

                const otherKeys = Object.keys(entry).filter(k => k !== titleKey && k !== linkKey && k !== '_name' && k !== '_location' && entry[k] && entry[k].toString().trim() !== '')

                const longTextKeys = otherKeys.filter(k => ['description', 'requirements', 'specs', 'short'].some(word => k.toLowerCase().includes(word)))
                const shortPropsKeys = otherKeys.filter(k => !longTextKeys.includes(k))

                return (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '18px 0', borderTop: 'none', borderBottom: '1.6px solid #c7c7c7' }}>
                    <h3 style={{ margin: 0, padding: 0 }}>
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
                      ) : title}
                    </h3>

                    {shortPropsKeys.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: '#685769', fontSize: '16px' }}>
                        {shortPropsKeys.map(key => (
                          <div key={key} style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                            <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                            <div style={{ fontWeight: 400, color: '#252525', whiteSpace: 'pre-wrap' }}>{entry[key]}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {longTextKeys.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {longTextKeys.map(key => {
                          const hideLabel = selectedCategory.toLowerCase().includes('awareness') && key.toLowerCase().includes('description')
                          return (
                            <div key={key} style={{ color: '#5E5E5E', fontSize: '16px', lineHeight: '1.5' }}>
                              {!hideLabel && (
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</div>
                              )}
                              <p style={hideLabel ? { margin: 0, whiteSpace: 'pre-wrap', color: '#5E5E5E', fontSize: '18px', fontWeight: 420, letterSpacing: '-0.03em' } : { margin: 0, whiteSpace: 'pre-wrap', color: '#252525' }}>{entry[key]}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        )}
      </div>
    </>
  )
}
