import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

// --- MAPPED GOOGLE APPS SCRIPT LINK ---
const API_URL = "https://script.google.com/macros/s/AKfycbyzC0yCB7JM8plmYvesa055gVbuuypu4vEDEbKSeZ6q7T624LMmf8y3KTsR60Db0et2/exec"

const CATEGORIES = [
  { id: 'Art_Studios', label: 'Art Studios' },
  { id: 'Event_Locations', label: 'Event Locations' },
  { id: 'Residencies', label: 'Residencies' },
  { id: 'Sound_Studios', label: 'Sound Studios' }
]

export default function ArtSpaces() {
  const { getCached, setCached } = useApiCache()
  const [data, setData] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)

  const [activeCategory, setActiveCategory] = useState('Art_Studios')
  const [expandedRow, setExpandedRow] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const sortDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (API_URL === "HIER_DEINEN_APPSRIPT_LINK_EINFÜGEN") {
      setError("Bitte füge deinen Google Apps Script Link in der Datei ArtSpaces.jsx ein (Zeile 5)!")
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

  const currentItems = data ? (data[activeCategory] || []).map(item => ({
    ...item,
    name: item.name || item.Name || item.Title || item.title || 'Unnamed Space',
    location: item.location || item.Location || item.Ort || item.ort,
    loc_link: item.loc_link || item.Loc_link || item.loc_url || item.Loc_url || '',
    link: item.link || item.Link || item.Url || item.url || '',
    type: item.type || item.Type || item.TYPE || item.Typ || item.typ || item['type '] || item['Type '] || '',
    size: item.size || item.Size || item.SIZE || item.Größe || item.größe || '',
    price: item.price || item.Price || item.costs || item.Costs || item.Preis || item.preis || '',
    description: item.description || item.Description || item.long_text || item.Long_text || item.Beschreibung || item.beschreibung || ''
  })) : []

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setExpandedRow(null);
  };

  const sortedItems = [...currentItems].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = (a[sortConfig.key] || '').toString().trim();
    const bVal = (b[sortConfig.key] || '').toString().trim();

    const compare = aVal.localeCompare(bVal, 'de', { sensitivity: 'base' });
    return sortConfig.direction === 'asc' ? compare : -compare;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '▼';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <>
      <div className="title-box">
        {/* Desktop View Tabs */}
        <div className="date-selector desktop-only" style={{ marginBottom: '2rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setExpandedRow(null)
                setSortConfig({ key: null, direction: 'asc' }) // Reset sorting on tab change!
              }}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontFamily: 'Inter',
                border: '1px solid #b6d8cf',
                background: activeCategory === cat.id ? '#1E7A62' : 'white',
                color: activeCategory === cat.id ? 'white' : '#363636',
                cursor: 'pointer',
                borderRadius: '20px',
                transition: 'all 0.2sease'
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
                  setActiveCategory(cat.id)
                  setExpandedRow(null)
                  setSortConfig({ key: null, direction: 'asc' })
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  border: '1px solid #b6d8cf',
                  background: activeCategory === cat.id ? '#1E7A62' : 'white',
                  color: activeCategory === cat.id ? 'white' : '#363636',
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
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen)
                  setDropdownOpen(false)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 12 12"><path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 2.75m2 3A.75.75 0 0 1 3.75 5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 3 5.75M5.25 8a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5z"></path></svg>
                  <span>Sort by</span>
                </div>
              </button>
              <ul id="dropdown-options" className={sortDropdownOpen ? '' : 'hidden'} style={{ background: 'white', border: '1px solid rgb(182, 216, 207)', borderRadius: '20px', marginTop: '2px', padding: '0px', overflowY: 'auto', overflowX: 'hidden', maxHeight: '250px', WebkitOverflowScrolling: 'touch' }}>
                {['name', 'location', 'type', 'size'].flatMap((key, idx, arr) => {
                  const label = key === 'type' ? 'Type' : key === 'name' ? 'Name' : key === 'location' ? 'Location' : 'Size';
                  
                  return [
                    <li
                      key={`${key}-asc`}
                      onClick={() => {
                        setSortConfig({ key, direction: 'asc' });
                        setExpandedRow(null);
                        setSortDropdownOpen(false);
                      }}
                      className={sortConfig.key === key && sortConfig.direction === 'asc' ? 'active' : ''}
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '10px', borderBottom: '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
                    >
                      <span style={{ fontSize: '10px', color: '#444' }}>▲</span> <span>{label}</span>
                    </li>,
                    <li
                      key={`${key}-desc`}
                      onClick={() => {
                        setSortConfig({ key, direction: 'desc' });
                        setExpandedRow(null);
                        setSortDropdownOpen(false);
                      }}
                      className={sortConfig.key === key && sortConfig.direction === 'desc' ? 'active' : ''}
                      style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', margin: '10px', borderBottom: (idx === arr.length - 1) ? 'none' : '1px solid #b6d8cf', color: '#363636', fontSize: '15px' }}
                    >
                      <span style={{ fontSize: '10px', color: '#444' }}>▼</span> <span>{label}</span>
                    </li>
                  ];
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div id="art-spaces-feed" style={{ fontFamily: 'Inter', padding: '0px' }}>
        {loading && (
          <div className="loading-spinner-overlay" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="loader"></span>
          </div>
        )}

        {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

        {!loading && !error && (
          <div className="table-container" style={{ maxWidth: '100%', overflowX: 'auto' }}>
            {/* Table Header (Desktop) */}
            <div className="table-header desktop-only" style={{
              display: 'flex',
              borderBottom: '1px solid #c7c7c7',
              padding: '12px 0 12px 10px',
              color: '#6B6B6B',
              fontSize: '18px',
              fontFamily: 'Inter',
              minWidth: '600px'
            }}>
              <div style={{ flex: '0 0 40px' }}></div>
              <div onClick={() => handleSort('name')} style={{ flex: '2', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>Name <span style={{ fontSize: '12px' }}>{getSortIcon('name')}</span></div>
              <div onClick={() => handleSort('location')} style={{ flex: '1.5', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>Location <span style={{ fontSize: '12px' }}>{getSortIcon('location')}</span></div>
              <div onClick={() => handleSort('type')} style={{ flex: '1.5', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>Type <span style={{ fontSize: '12px' }}>{getSortIcon('type')}</span></div>
              <div onClick={() => handleSort('size')} style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>size <span style={{ fontSize: '12px' }}>{getSortIcon('size')}</span></div>
            </div>

            {/* Table Rows */}
            <div className="table-body">
              {sortedItems.length === 0 ? (
                <p style={{ padding: '20px 0' }}>Keine Einträge gefunden.</p>
              ) : (
                sortedItems.map((item, i) => {
                  const isExpanded = expandedRow === i;
                  return (
                    <div key={i} className="table-row-group" style={{ borderBottom: '1px solid #d1d3d4' }}>

                      {/* --- DESKTOP VIEW --- */}
                      <div className="desktop-only">
                        <div
                          className="table-row"
                          style={{
                            display: 'flex',
                            padding: '18px 0 18px 10px',
                            alignItems: 'center',
                            color: '#363636',
                            fontSize: '18px',
                            minWidth: '600px'
                          }}
                        >
                          <div
                            onClick={() => setExpandedRow(isExpanded ? null : i)}
                            style={{ flex: '0 0 40px', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 0' }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                          <div style={{ flex: '2', fontWeight: '500' }}>
                            {item.link ? (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1E7A62', textDecoration: 'none' }}>
                                {item.name}
                              </a>
                            ) : item.name}
                          </div>
                          <div style={{ flex: '1.5' }}>
                            {item.loc_link ? (
                              <a href={item.loc_link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                {item.location}
                              </a>
                            ) : item.location}
                          </div>
                          <div style={{ flex: '1.5' }}>{item.type || 'NA'}</div>
                          <div style={{ flex: '1' }}>{item.size || 'NA'}</div>
                        </div>

                        {/* Expanded Content Desktop */}
                        {isExpanded && (
                          <div className="expanded-content" style={{ padding: '0 20px 24px 50px', color: '#6B6B6B', fontSize: '18px', lineHeight: '1.5' }}>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{item.description}</p>
                          </div>
                        )}
                      </div>

                      {/* --- MOBILE VIEW --- */}
                      <div className="mobile-only" style={{ padding: '20px 0', flexDirection: 'column' }}>

                        {/* Row 1: Caret, Name, Location */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '5px' }}>

                          {/* Caret */}
                          <div
                            onClick={() => setExpandedRow(isExpanded ? null : i)}
                            style={{ flex: '0 0 32px', display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '2px' }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: '#363636' }}>
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>

                          {/* Content Container */}
                          <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>

                            {/* Title & Location */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                              <div style={{ fontWeight: '600', fontSize: '23px', color: '#252525', letterSpacing: '-0.01em' }}>
                                {item.link ? (
                                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#252525', textDecoration: 'none' }}>
                                    {item.name}
                                  </a>
                                ) : item.name}
                              </div>
                              <div style={{ fontSize: '16px', color: '#252525' }}>
                                {item.loc_link ? (
                                  <a href={item.loc_link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {item.location}
                                  </a>
                                ) : item.location}
                              </div>
                            </div>

                            {/* Expanded Content Mobile */}
                            {isExpanded && (
                              <div className="expanded-content" style={{ marginBottom: '15px', color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{item.description}</p>
                              </div>
                            )}

                            {/* Stats Columns */}
                            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px' }}>
                              <div style={{ flex: '1 1 0', minWidth: '0' }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>type</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{item.type || 'NA'}</div>
                              </div>
                              <div style={{ flex: '1 1 0', minWidth: '0' }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>size</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{item.size || 'NA'}</div>
                              </div>
                              <div style={{ flex: '1 1 0', minWidth: '0', opacity: (!item.price || item.price === 'NA' || item.price === 'N/A') ? 0 : 1 }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>price</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{item.price || 'NA'}</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  )
                })
              )}
            </div>
            
            <div className="footnote-box" style={{ padding: '20px 10px', fontSize: '11px', color: '#888', fontStyle: 'inherit', marginTop: '10px' }}>
              <p style={{ margin: '0 0 10px 0' }}><i style={{ fontStyle: 'italic' }}>*Free:</i> Some venues funded by public institutions may offer free use for non-commercial events. Eligibility depends on specific requirements (e.g. event type, audience, and cultural relevance). This listing does not guarantee free access - please verify directly with the venue.</p>
              <p style={{ margin: 0 }}><i style={{ fontStyle: 'italic' }}>*Content:</i> All details are provided without guarantee. They may be outdated, based on third-party sources, or affected by translation and processing. Please verify everything directly with the venue.</p>
            </div>
            
          </div>
        )}
      </div>
    </>
  )
}
