import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

const API_URL = "https://script.google.com/macros/s/AKfycbw6_uXNglWnCbAr7_XvdLiVMfxjSGGyHVBE0lISkOay3Jt2A9gnAYwH90-a-KbUXdDO2A/exec"

const DEFAULT_CATEGORY = "Funding"

export default function Resources() {
  const { getCached, setCached } = useApiCache()
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
    if (API_URL === "HIER_DEINEN_APPSRIPT_LINK_EINFÜGEN") {
      setError("Bitte füge deinen Google Apps Script Link in der Datei Resources.jsx ein (Zeile 4)!")
      setLoading(false)
      return
    }

    const cached = getCached(API_URL)
    if (cached) {
      setData(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setCached(API_URL, json)
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
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

  // Display label overrides — sheet key stays unchanged, only UI label changes
  const LABEL_OVERRIDES = {
    'Tools/Workspaces': 'Tools/Maker Spaces',
  }

  // Build dynamic CATEGORIES from data keys (preserving original labels)
  const CATEGORIES = categories.map(key => ({
    id: key,
    label: LABEL_OVERRIDES[key] || key.replace(/_/g, ' ')
  }))

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
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ width: '180px' }}>
            <div className="custom-dropdown" ref={sortDropdownRef} style={{ zIndex: sortDropdownOpen ? 1001 : 999, width: '100%' }}>
              <button
                id="dropdown-button"
                className="no-triangle"
                style={{ width: '100%', fontSize: '15px', border: '1px solid #b6d8cf', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '10px 15px' }}
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
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '10px', borderBottom: '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
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
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '10px', borderBottom: (idx === arr.length - 1) ? 'none' : '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
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

                const isSoundsystemOrDJCategory = selectedCategory.toLowerCase().includes("soundsystem") || selectedCategory.toLowerCase().includes("dj")

                if (isSoundsystemOrDJCategory) {
                  const name = entry.Name || entry.name || entry.Title || entry.title || entry.Soundsystem || entry['DJ Equipment'] || entry.Equipment || 'Unnamed Resource'
                  const location = entry.Location || entry.location || entry.District || entry.district || entry.Ort || entry.ort || ''
                  const specs = entry.Specs || entry.specs || entry.Equipment || entry.equipment || entry.System || entry.system || ''
                  const description = entry.Description || entry.description || entry.Decription || entry.decription || entry.About || entry.about || entry.Info || entry.info || entry.long_text || ''
                  const linkUrl = entry.Link || entry.link || entry.Url || entry.url || ''
                  const href = linkUrl ? (linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`) : null

                  return (
                    <li key={i} style={{ padding: '24px 0', borderTop: 'none', borderBottom: '1.6px solid #c7c7c7', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ cursor: 'pointer', paddingRight: '12px', paddingTop: '2px' }} onClick={() => setExpandedRow(isExpanded ? null : i)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F3F3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontWeight: 700, fontSize: '24px', fontFamily: 'Inter', color: '#3F3F3F', marginBottom: '4px', letterSpacing: '-0.02em', cursor: href ? 'auto' : 'pointer' }} onClick={() => { if (!href) setExpandedRow(isExpanded ? null : i) }}>
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                              {name}
                            </a>
                          ) : name}
                        </div>
                        {location && (
                          <div style={{ fontFamily: 'Inter', fontWeight: 650, fontSize: '16px', color: '#6D6D6D', marginBottom: isExpanded ? '16px' : '0' }}>
                            {location}
                          </div>
                        )}
                        {isExpanded && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {specs && (
                              <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc', fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#685769', lineHeight: '1.5' }}>
                                {specs.split('\n').filter(s => s.trim() !== '').map((spec, idx) => {
                                  let text = spec.trim()
                                  if (text.startsWith('-') || text.startsWith('•') || text.startsWith('*')) text = text.substring(1).trim()
                                  return <li key={idx} style={{ paddingBottom: '4px', paddingTop: 0, borderTop: 'none', background: 'transparent' }}>{text}</li>
                                })}
                              </ul>
                            )}
                            {description && (
                              <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '16px', color: '#646464', lineHeight: '1.6', letterSpacing: '-0.01em' }}>
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{description}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  )
                }

                if (isToolsCategory) {
                  const name = entry.Name || entry.name || entry.Title || entry.title || 'Unnamed Workspace'
                  const linkUrl = entry.Link || entry.link || entry.Url || entry.url
                  const host = entry.Host || entry.host
                  const location = entry.Location || entry.location
                  const locLink = entry.Loc_link || entry.loc_link || entry.loc_url
                  const costs = entry.Costs || entry.costs || entry.Price || entry.price
                  const shortText = entry.short_text || entry.Short_text || entry.Short_Text || entry['short_text'] || entry.Short || entry.short || ''
                  const longText = entry.long_text || entry.Long_text || entry.Long_Text || entry['long_text'] || entry.Description || entry.description || ''

                  const daysArr = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
                  const jsDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
                  const todayStr = jsDays[new Date().getDay()]
                  const todayTime = entry[`opening_${todayStr.toLowerCase()}`] || entry[todayStr] || entry[todayStr.toLowerCase()] || 'closed'

                  return (
                    <li key={i} style={{ padding: '24px 0 24px 0', borderTop: 'none', borderBottom: '1.6px solid #c7c7c7' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ cursor: 'pointer', paddingRight: '8px' }} onClick={() => setExpandedRow(isExpanded ? null : i)}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F3F3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', marginTop: '3px', flexShrink: 0 }}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontWeight: 700, fontSize: '22px', fontFamily: 'Inter', color: '#3F3F3F', marginBottom: '8px' }}>
                            {linkUrl ? <a href={linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#3F3F3F', textDecoration: 'none' }}>{name}</a> : name}
                          </div>
                          <div style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '15px', color: '#6D6D6D', marginBottom: '8px' }}>
                            {host && <>{host} <span style={{ padding: '0 4px' }}>•</span> </>}
                            {locLink ? <a href={locLink.startsWith('http') ? locLink : `https://${locLink}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6D6D6D' }}>{location}</a> : <span style={{ color: '#6D6D6D' }}>{location}</span>}
                          </div>
                          {(shortText || longText) && (
                            <div style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', color: '#707070', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: '1.5' }}>
                              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{isExpanded ? longText : shortText}</p>
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px', fontFamily: 'Inter', fontWeight: 700, fontSize: '15px', color: '#685769' }}>
                            <div
                              style={{ display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedTimeRow(isTimeExpanded ? null : i)
                              }}
                            >
                              {(isTimeExpanded ? daysArr : [todayStr]).map((day, dIdx) => {
                                const dayText = isTimeExpanded ? (entry[`opening_${day.toLowerCase()}`] || entry[day] || entry[day.toLowerCase()] || 'closed') : todayTime
                                const isBold = day === todayStr
                                return (
                                  <div key={day} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {dIdx === 0 ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                        <path fill="currentColor" d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11m1-17.5h-2v6.914l4 4L16.414 15L13 11.586z" />
                                      </svg>
                                    ) : (
                                      <div style={{ width: '17px', flexShrink: 0 }} />
                                    )}
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                      <span style={{ width: '25px', color: isBold ? '#685769' : '#888', fontWeight: isBold ? 700 : 400 }}>{day}</span>
                                      <span style={{ color: isBold ? '#685769' : '#888', fontWeight: isBold ? 700 : 400 }}>{dayText}</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            {costs && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 17 24" style={{ flexShrink: 0 }}>
                                  <path fill="currentColor" d="m16.64 20.097l.597 2.71a.5.5 0 0 1-.053.385l.001-.002a.54.54 0 0 1-.286.246l-.004.001l-.086.017a.8.8 0 0 1-.174.059l-.005.001q-.11.026-.273.08t-.366.094q-.205.042-.434.086t-.511.086t-.571.08t-.622.051q-.333.017-.656.017a11.3 11.3 0 0 1-7.002-2.246l.03.021a11.04 11.04 0 0 1-4.039-5.914l-.018-.077H.549a.553.553 0 0 1-.546-.545V13.32a.553.553 0 0 1 .545-.546h1.125q-.034-.971.017-1.79H.527a.525.525 0 0 1-.525-.525v-.022v.001v-1.964c0-.29.235-.525.525-.525h.022h-.001h1.67a11.16 11.16 0 0 1 4.118-5.738l.033-.022A11.26 11.26 0 0 1 13.199 0h-.007h.066c1.151 0 2.268.143 3.335.412l-.094-.02c.142.046.26.136.339.254l.001.002a.56.56 0 0 1 .05.413l.001-.004l-.733 2.71a.5.5 0 0 1-.238.331l-.002.001a.49.49 0 0 1-.412.041l.003.001l-.068-.017q-.068-.017-.196-.042l-.298-.06l-.383-.06l-.443-.051l-.494-.042l-.503-.017l-.1-.001c-1.393 0-2.69.407-3.78 1.109l.028-.017A6.8 6.8 0 0 0 6.728 7.9l-.017.043h7.978a.56.56 0 0 1 .546.651v-.003l-.409 1.943a.5.5 0 0 1-.548.443h.002h-8.32a15 15 0 0 0 .002 1.832l-.002-.043h7.831c.17 0 .321.08.419.204l.001.001a.55.55 0 0 1 .102.464l.001-.004l-.409 1.909a.55.55 0 0 1-.527.443H6.784c1.036 2.558 3.5 4.33 6.378 4.33h.069h-.003q.307 0 .614-.026t.571-.06t.503-.08t.418-.086l.315-.08l.205-.051l.086-.034a.5.5 0 0 1 .445.036l-.002-.001c.134.077.23.208.258.362z" />
                                </svg>
                                <span>{costs}</span>
                              </div>
                            )}
                          </div>
                        </div>
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
