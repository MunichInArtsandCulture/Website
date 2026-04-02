import { useState, useEffect, useRef } from 'react'
import { useApiCache, DATA_SOURCES } from '../context/ApiCacheContext'

const RESOURCES_URL = DATA_SOURCES.RESOURCES
const DYNAMIC_URL = DATA_SOURCES.OPEN_CALLS

const DEFAULT_CATEGORY = "Funding"

export default function Resources() {
  const { getCached, fetchWithPriority } = useApiCache()
  const [staticData, setStaticData] = useState(getCached(RESOURCES_URL) || null)
  const [dynamicData, setDynamicData] = useState(getCached(DYNAMIC_URL) || null)
  const [loading, setLoading] = useState(!getCached(RESOURCES_URL) || !getCached(DYNAMIC_URL))
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
    const cachedStatic = getCached(RESOURCES_URL)
    const cachedDynamic = getCached(DYNAMIC_URL)
    
    if (cachedStatic) setStaticData(cachedStatic)
    if (cachedDynamic) setDynamicData(cachedDynamic)
    
    if (cachedStatic && cachedDynamic) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Fetch both sources and wait for both to settle before hiding the loader
    Promise.allSettled([
      fetchWithPriority(RESOURCES_URL, true).then(json => { if (json) setStaticData(json) }),
      fetchWithPriority(DYNAMIC_URL, true).then(json => { if (json) setDynamicData(json) })
    ]).finally(() => {
      setLoading(false)
    })
  }, [getCached, fetchWithPriority])

  // Logic to show categories — we use the static ones mostly but ensure Funding is first
  const categories = staticData ? Object.keys(staticData).sort((a, b) => {
    if (a === 'Funding') return -1
    if (b === 'Funding') return 1
    return 0
  }) : []

  // If the selected category doesn't exist yet in the data, default to the first one available
  useEffect(() => {
    if (staticData && categories.length > 0 && !categories.includes(selectedCategory)) {
      // Logic for Funding is handled separately, but we ensure it's selectable
      if (selectedCategory !== 'Funding') {
         setSelectedCategory(categories[0])
      }
    }
  }, [staticData, categories, selectedCategory])

  // Get raw entries based on category source
  const entries = selectedCategory === 'Funding' 
    ? (dynamicData ? dynamicData.filter(e => e.main_category === 'Funding') : [])
    : (staticData ? staticData[selectedCategory] || [] : [])
    
  // Safety check to prevent "No resources found" from flashing during state transitions
  const isDataReady = selectedCategory === 'Funding' ? dynamicData !== null : staticData !== null
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
      <h1 className="mobile-page-title">Resources</h1>
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
                {[{ key: '_name', label: 'Name' }, { key: '_location', label: 'Location' }]
                  .filter(opt => !(opt.key === '_location' && selectedCategory.toLowerCase().includes('awareness')))
                  .flatMap(({ key, label }, idx, arr) => {
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
            {sortedEntries.length === 0 && isDataReady ? (
              <li><p>No resources found for this category.</p></li>
            ) : (
              sortedEntries.map((entry, i) => {
                const isExpanded = expandedRow === i
                const isTimeExpanded = expandedTimeRow === i

                const isSpecialMediaCategory = selectedCategory.toLowerCase().includes("soundsystem") ||
                  selectedCategory.toLowerCase().includes("dj") ||
                  selectedCategory.toLowerCase().includes("lights") ||
                  selectedCategory.toLowerCase().includes("awareness") ||
                  selectedCategory.toLowerCase().includes("tools") ||
                  selectedCategory.toLowerCase().includes("merch")

                if (isSpecialMediaCategory) {
                  const isTools = selectedCategory.toLowerCase().includes("tools") || selectedCategory.toLowerCase().includes("merch")
                  const isMerch = selectedCategory.toLowerCase().includes("merch")
                  const name = entry.Name || entry.name || entry.Title || entry.title || entry.Soundsystem || entry['DJ Equipment'] || entry.Equipment || 'Unnamed Resource'
                  const location = entry.Location || entry.location || entry.District || entry.district || entry.Ort || entry.ort || ''
                  const host = entry.Host || entry.host || ''
                  const specs = entry.Specs || entry.specs || entry.Equipment || entry.equipment || entry.System || entry.system || ''
                  const description = entry.Description || entry.description || entry.Decription || entry.decription || entry.About || entry.about || entry.Info || entry.info || entry.long_text || ''
                  const shortText = entry.short_text || entry.Short_text || entry.Short_Text || ''
                  const costs = (entry.Costs || entry.costs || entry.Price || entry.price || '').toString()
                  const linkUrl = entry.Link || entry.link || entry.Url || entry.url || ''
                  const href = linkUrl ? (linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`) : null
                  
                  const mapsKey = Object.keys(entry).find(k => 
                    k.toLowerCase() === 'loc_link' || 
                    k.toLowerCase() === 'maps' || 
                    k.toLowerCase().includes('google maps') || 
                    k.toLowerCase() === 'map_link' ||
                    k.toLowerCase() === 'address'
                  )
                  let mapsLink = mapsKey ? entry[mapsKey] : ''
                  if (mapsLink && !mapsLink.toString().startsWith('http') && mapsLink.toString().trim() !== '') {
                    mapsLink = `https://${mapsLink}`
                  }
                  if (!mapsLink && location) {
                    mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`
                  }
                  
                  // Opening time logic
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
                      if (entry[v] && entry[v].toString().toLowerCase() !== 'na' && entry[v].toString().trim() !== '') return entry[v].toString()
                    }
                    return 'closed'
                  }
                  
                  const jsDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  const todayStr = jsDays[new Date().getDay()]
                  const todayTime = getTimeForDay(todayStr)

                  return (
                    <li key={i} style={{ padding: '20px 0', borderTop: 'none', borderBottom: '1.6px solid #e0e0e0', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                      {/* Accordion Arrow Far Left */}
                      <div style={{ cursor: 'pointer', paddingRight: '12px', paddingTop: '6px' }} onClick={() => setExpandedRow(isExpanded ? null : i)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#685769" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: isTools ? '120px' : 'auto' }}>
                        {/* Title (Name) */}
                        <div style={{ fontWeight: 800, fontSize: '26px', fontFamily: 'Inter', color: '#252525', marginBottom: '2px', letterSpacing: '-0.02em', cursor: href ? 'auto' : 'pointer' }} onClick={() => { if (!href) setExpandedRow(isExpanded ? null : i) }}>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                              {name}
                            </a>
                          ) : name}
                        </div>
                        
                        {/* Host / Location */}
                        {(host || location) && (
                          <div style={{ fontFamily: 'Inter', fontWeight: 550, fontSize: '17.5px', color: '#685769', marginBottom: '6px' }}>
                            {host}{host && location ? ' • ' : ''}
                            {mapsLink ? (
                              <a 
                                href={mapsLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-bottom 0.2s' }}
                                onMouseEnter={(e) => e.target.style.borderBottom = '1px solid #685769'}
                                onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {location}
                              </a>
                            ) : location}
                          </div>
                        )}

                        {/* Description Section / Preview */}
                        <div 
                          onClick={() => setExpandedRow(isExpanded ? null : i)}
                          style={{ 
                            fontFamily: 'Inter', 
                            fontWeight: 400, 
                            fontSize: '17px', 
                            color: '#707070', 
                            lineHeight: '1.4', 
                            letterSpacing: '-0.3px', 
                            cursor: 'pointer'
                          }}
                        >
                          {isExpanded ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#3F3F3F' }}>{description || shortText}</p>
                              {specs && !isTools && (
                                <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc', color: '#685769', listStylePosition: 'outside' }}>
                                  {specs.split('\n').filter(s => s.trim() !== '').map((spec, idx) => (
                                    <li key={idx} style={{ paddingBottom: '4px', border: 'none', background: 'transparent', paddingTop: 0 }}>
                                      {spec.trim().replace(/^[-•*]\s*/, '')}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <p style={{ margin: 0 }}>
                              {isTools && shortText.includes('\n') 
                                ? shortText.split('\n')[0].trim() 
                                : (shortText || (description ? description.substring(0, 100) + '...' : ''))
                              }
                            </p>
                          )}
                        </div>

                        {/* Bottom Section: Hours & Costs Toggle Row */}
                        {isTools && (
                          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                              
                              {/* Opening Hours Column (Fixed width for consistent price alignment) */}
                              {!isMerch && (
                                <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div 
                                    onClick={() => setExpandedTimeRow(isTimeExpanded ? null : i)}
                                    style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, color: '#685769', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11m1-17.5h-2v6.914l4 4L16.414 15L13 11.586z" />
                                    </svg>
                                    <span>{todayStr} {todayTime}</span>
                                  </div>

                                  {/* Expanded Time Block (In between Toggle and Price) */}
                                  {isTimeExpanded && (
                                    <div 
                                      onClick={() => setExpandedTimeRow(null)}
                                      style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '26px', cursor: 'pointer' }}
                                    >
                                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const time = getTimeForDay(day)
                                        const isThisDay = day === todayStr
                                        return (
                                          <div key={day} style={{ display: 'flex', gap: '10px', fontFamily: 'Inter', fontSize: '18px', color: isThisDay ? '#1E7A62' : '#685769', fontWeight: isThisDay ? 700 : 400, letterSpacing: '-0.5px' }}>
                                            <span style={{ width: '40px' }}>{day}</span>
                                            <span style={{ whiteSpace: 'pre-line' }}>{time}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Costs Column (Starts at 240px/Drops below Hours block if no space) */}
                              {costs && costs.trim().toUpperCase() !== 'NA' && (
                                <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, color: '#685769', letterSpacing: '-0.5px', paddingTop: '1px' }}>
                                  <span style={{ fontSize: '20px', fontWeight: 750 }}>€</span>
                                  <span style={{ whiteSpace: 'nowrap' }}>{costs.replace(/€|EUR|€/gi, '').trim()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Costs fallback for non-tools */}
                        {!isTools && costs && costs.trim().toUpperCase() !== 'NA' && (
                          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'Inter', fontSize: '17px', fontWeight: 750, color: '#685769' }}>
                            <span style={{ fontSize: '20px', fontWeight: 800 }}>€</span>
                            <span>{costs.replace(/€|EUR|€/gi, '').trim()}</span>
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

        {(selectedCategory.toLowerCase().includes('tools') || selectedCategory.toLowerCase().includes('merch')) && (
          <div className="footnote-box" style={{ padding: '20px 10px', fontSize: '11px', color: '#888', fontStyle: 'inherit', marginTop: '20px' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              <i style={{ fontStyle: 'italic' }}>*Free:</i> Some venues funded by public institutions may offer free use for non-commercial events. Eligibility depends on specific requirements (e.g. event type, audience, and cultural relevance). This listing does not guarantee free access — please verify directly with the venue.
            </p>
            <p style={{ margin: 0 }}>
              <i style={{ fontStyle: 'italic' }}>*Content:</i> All details are provided without guarantee. They may be outdated, based on third-party sources, or affected by translation and processing. Please verify everything directly with the venue.
            </p>
          </div>
        )}

        {selectedCategory.toLowerCase().includes('funding') && (
          <div className="footnote-box" style={{ padding: '20px 10px', fontSize: '11px', color: '#888', fontStyle: 'inherit', marginTop: '20px' }}>
            <p style={{ margin: 0 }}>
              <i style={{ fontStyle: 'italic' }}>*Content:</i> All details are provided without guarantee. They may be outdated, based on third-party sources, or affected by translation and processing. Please verify everything directly with the venue. AI-generated content may be inaccurate. Content can be removed upon request.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
