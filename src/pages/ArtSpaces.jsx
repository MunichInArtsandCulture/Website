import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

// --- MAPPED GOOGLE APPS SCRIPT LINK ---
const API_URL = "https://script.google.com/macros/s/AKfycbyzC0yCB7JM8plmYvesa055gVbuuypu4vEDEbKSeZ6q7T624LMmf8y3KTsR60Db0et2/exec"

const CATEGORIES = [
  { id: 'Art_Studios', label: 'Art Studios' },
  { id: 'Sound_Studios', label: 'Sound Studios' },
  { id: 'Event_Locations', label: 'Event Locations' },
  { id: 'Residencies', label: 'Residencies' }
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

  const currentItems = data ? data[activeCategory] || [] : []

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

    const aVal = (a[sortConfig.key] || '').toString().toLowerCase();
    const bVal = (b[sortConfig.key] || '').toString().toLowerCase();

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '▼';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <>
      <div className="title-box">
        {/* Desktop View Tabs */}
        <div className="date-selector desktop-only" style={{ marginBottom: '2rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
                border: '1px solid #d1d3d4',
                background: activeCategory === cat.id ? '#1E7A62' : 'white',
                color: activeCategory === cat.id ? 'white' : '#363636',
                cursor: 'pointer',
                borderRadius: '2px',
                transition: 'all 0.2sease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile View Dropdowns */}
        <div className="filter mobile-only" style={{ marginBottom: '2rem', display: 'flex', gap: '15px' }}>

          <div style={{ flex: '0 1 auto' }}>
            <div style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '5px' }}>Category</div>
            <div className="custom-dropdown" ref={dropdownRef}>
              <button
                id="dropdown-button"
                style={{ width: '100%' }}
                onClick={() => {
                  setDropdownOpen(!dropdownOpen)
                  setSortDropdownOpen(false)
                }}
              >
                {CATEGORIES.find(c => c.id === activeCategory)?.label || 'Select Category'}
              </button>
              <ul id="dropdown-options" className={dropdownOpen ? '' : 'hidden'}>
                {CATEGORIES.map(cat => (
                  <li
                    key={cat.id}
                    data-value={cat.id}
                    className={activeCategory === cat.id ? 'active' : ''}
                    onClick={() => {
                      setActiveCategory(cat.id)
                      setExpandedRow(null)
                      setSortConfig({ key: null, direction: 'asc' }) // Reset sorting on category jump
                      setDropdownOpen(false)
                    }}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ flex: '0 1 auto' }}>
            <div style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '5px' }}>Sort by</div>
            <div className="custom-dropdown" ref={sortDropdownRef}>
              <button
                id="dropdown-button"
                style={{ width: '100%' }}
                onClick={() => {
                  setSortDropdownOpen(!sortDropdownOpen)
                  setDropdownOpen(false)
                }}
              >
                {sortConfig.key ? (sortConfig.key === 'transit' ? 'reachability' : sortConfig.key === 'name' ? 'Name' : sortConfig.key === 'location' ? 'Location' : 'size') : 'Name'}
              </button>
              <ul id="dropdown-options" className={sortDropdownOpen ? '' : 'hidden'}>
                {['name', 'location', 'transit', 'size'].map(key => {
                  const label = key === 'transit' ? 'reachability' : key === 'name' ? 'Name' : key === 'location' ? 'Location' : 'size';
                  return (
                    <li
                      key={key}
                      onClick={() => {
                        handleSort(key);
                        setSortDropdownOpen(false);
                      }}
                    >
                      {label}
                    </li>
                  );
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
              <div onClick={() => handleSort('transit')} style={{ flex: '1.5', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', userSelect: 'none' }}>infrastructure <span style={{ fontSize: '12px' }}>{getSortIcon('transit')}</span></div>
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
                          <div style={{ flex: '1.5' }}>{item.transit}</div>
                          <div style={{ flex: '1' }}>{item.size}</div>
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
                            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                              <div style={{ fontWeight: '600', fontSize: '21px', color: '#252525', letterSpacing: '-0.01em' }}>
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

                            {/* Stats Columns */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px, 6vw, 60px)' }}>
                              <div style={{ flex: '0 0 auto', minWidth: '110px' }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>reachability</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap' }}>{item.transit || 'NA'}</div>
                              </div>
                              <div style={{ flex: '0 0 auto', minWidth: '80px' }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>price</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap' }}>{item.price || 'NA'}</div>
                              </div>
                              <div style={{ flex: '1', minWidth: '80px' }}>
                                <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>size</div>
                                <div style={{ fontSize: '16px', color: '#252525', fontWeight: '400', whiteSpace: 'pre-wrap' }}>{item.size || 'NA'}</div>
                              </div>
                            </div>

                            {/* Expanded Content Mobile */}
                            {isExpanded && (
                              <div className="expanded-content" style={{ marginTop: '20px', color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{item.description}</p>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>

                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
