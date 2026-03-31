import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

const JOBS_API_URL = "https://script.google.com/macros/s/AKfycbyKnfmzqe_o7PiiAlTeciaImwOmOqrRBeHLV1SL_jvl-fPIBiwuLkIhGlDW0ZymcPArtQ/exec"

const OPEN_CALLS_API_URL = "https://script.google.com/macros/s/AKfycbyPOcGDPmoRNgdIpZqOMBccIXacwUKWEpN5NftDlfeQ0FRZmttFW2PuJMtZyce_X2Nk/exec"

const JOB_CATEGORY_LIST = [
  "All",
  "Art, Support, & Event Management",
  "Musicians and Singers",
  "Education, Pedagogical and Social",
  "Stage and Event Technology",
  "Costume, Makeup and Fashion",
  "Acting, Theater and Directing",
  "Legal and Financial",
  "Communication, PR and Press",
  "IT and Digital",
  "Customer Service, Catering and Cash Register",
  "Other"
]

const CALL_CATEGORY_LIST = [
  "All",
  "Visual_Arts",
  "Music",
  "Theater",
  "Dance",
  "Performance",
  "Interdisciplinary",
  "Cultural_Education",
  "General_Culture"
]

// Display labels — underlying sheet category names stay unchanged
const CATEGORY_LABELS = {
  "Musicians and Singers": "Musicians & Singers",
  "Education, Pedagogical and Social": "Education & Social",
  "Stage and Event Technology": "Stage & Event Technology",
  "Costume, Makeup and Fashion": "Costume, Makeup & Fashion",
  "Acting, Theater and Directing": "Acting, Theater & Directing",
  "Legal and Financial": "Legal & Financial",
  "Communication, PR and Press": "Communication & Press",
  "IT and Digital": "IT & Digital",
  "Customer Service, Catering and Cash Register": "Customer Service & Service",
}

const DEFAULT_CATEGORY = "All"

// Mode toggle button style — matches ArtSpaces category buttons exactly
const modeBtn = (active) => ({
  padding: '10px 20px',
  fontSize: '16px',
  fontFamily: 'Inter',
  border: '1px solid #b6d8cf',
  background: active ? '#1E7A62' : 'white',
  color: active ? 'white' : '#363636',
  cursor: 'pointer',
  borderRadius: '20px',
  transition: 'all 0.2s ease',
  width: '180px',
})

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}

const formatDeadlineDisplay = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[d.getUTCMonth()]; // Using UTC to avoid timezone shifts
    const day = d.getUTCDate();
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  } catch (e) {
    return dateStr;
  }
}

export default function Jobs() {
  const { getCached, setCached } = useApiCache()

  // Mode: 'jobs' | 'opencalls'
  const [mode, setMode] = useState('jobs')

  // Jobs state
  const [allJobs, setAllJobs] = useState(getCached(JOBS_API_URL) || null)
  const [jobsLoading, setJobsLoading] = useState(!getCached(JOBS_API_URL))
  const [jobsError, setJobsError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)

  // Open Calls state
  const [openCalls, setOpenCalls] = useState(getCached(OPEN_CALLS_API_URL) || null)
  const [callsLoading, setCallsLoading] = useState(false)
  const [callsError, setCallsError] = useState(null)

  // Dropdown (mobile)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const dropdownRef = useRef(null)

  // Open Calls "show more" state
  const [expandedSummaries, setExpandedSummaries] = useState({})

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Reset category when mode switches
  useEffect(() => {
    setSelectedCategory("All")
    setDropdownOpen(false)
  }, [mode])

  // Fetch jobs
  useEffect(() => {
    const cached = getCached(JOBS_API_URL)
    if (cached) { setAllJobs(cached); setJobsLoading(false); return }
    setJobsLoading(true)
    fetch(JOBS_API_URL)
      .then(res => res.json())
      .then(data => { setCached(JOBS_API_URL, data); setAllJobs(data); setJobsLoading(false) })
      .catch(err => { setJobsError(err.message); setJobsLoading(false) })
  }, [getCached, setCached])

  // Fetch open calls when mode switches to 'opencalls'
  useEffect(() => {
    if (mode !== 'opencalls') return
    if (openCalls) return
    if (OPEN_CALLS_API_URL === 'REPLACE_WITH_OPEN_CALLS_APPS_SCRIPT_URL') return
    const cached = getCached(OPEN_CALLS_API_URL)
    if (cached) { setOpenCalls(cached); return }
    setCallsLoading(true)
    fetch(OPEN_CALLS_API_URL)
      .then(res => res.json())
      .then(data => { setCached(OPEN_CALLS_API_URL, data); setOpenCalls(data); setCallsLoading(false) })
      .catch(err => { setCallsError(err.message); setCallsLoading(false) })
  }, [mode, getCached, setCached, openCalls])

  const filteredJobs = allJobs ? (
    selectedCategory === 'All'
      ? allJobs
      : allJobs.filter(job => {
        if (selectedCategory === "Art, Support, & Event Management" && job.category === "Art, Artist Support and Event Management") return true
        return job.category === selectedCategory
      })
  ) : []

  const filteredCalls = openCalls ? openCalls.filter(call => {
    const isMode = call.main_category === "Open_Call"
    if (!isMode) return false
    if (selectedCategory === "All") return true
    return call.type === selectedCategory
  }) : []

  const currentCategoryList = mode === 'jobs' ? JOB_CATEGORY_LIST : CALL_CATEGORY_LIST

  return (
    <>
      {/* ── Mode toggle ── */}
      <div className="filter" style={{ display: 'flex', gap: '6px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button style={modeBtn(mode === 'jobs')} onClick={() => setMode('jobs')}>Positions</button>
        <button style={modeBtn(mode === 'opencalls')} onClick={() => setMode('opencalls')}>Open Calls</button>
      </div>

      {/* ── Category Selectors ── */}
      <div className="title-box">
        {/* Desktop: pill tab buttons */}
        <div className="date-selector desktop-only" style={{ marginBottom: '2rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {currentCategoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontFamily: 'Inter',
                border: '1px solid #b6d8cf',
                background: selectedCategory === cat ? '#1E7A62' : 'white',
                color: selectedCategory === cat ? 'white' : '#363636',
                cursor: 'pointer',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
                width: 'auto'
              }}
            >
              {CATEGORY_LABELS[cat] || cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Mobile: dropdown */}
        <div className="filter mobile-only" style={{ marginBottom: '2rem' }}>
          <div className="custom-dropdown" ref={dropdownRef} style={{ zIndex: dropdownOpen ? 1001 : 999, width: '220px' }}>
            <button
              id="dropdown-button"
              className="no-triangle"
              style={{ width: '100%', fontSize: '16px', border: '1px solid #b6d8cf', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '10px 15px', background: 'white', color: '#363636', transition: 'background 0.2s ease' }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 12 12"><path fill="currentColor" d="M1 2.75A.75.75 0 0 1 1.75 2h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 1 2.75m2 3A.75.75 0 0 1 3.75 5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 3 5.75M5.25 8a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5z"></path></svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(CATEGORY_LABELS[selectedCategory] || selectedCategory).replace(/_/g, ' ')}</span>
            </button>
            <ul id="dropdown-options" className={dropdownOpen ? '' : 'hidden'} style={{ background: 'white', border: '1px solid rgb(182, 216, 207)', borderRadius: '20px', marginTop: '2px', padding: '0px', overflowY: 'auto', overflowX: 'hidden', maxHeight: '300px', WebkitOverflowScrolling: 'touch', width: '100%' }}>
              {currentCategoryList.map((cat, idx) => (
                <li
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setDropdownOpen(false) }}
                  className={selectedCategory === cat ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', margin: '0 10px', borderBottom: idx === currentCategoryList.length - 1 ? 'none' : '1px solid #b6d8cf', color: '#363636', fontSize: '15px', cursor: 'pointer' }}
                >
                  {CATEGORY_LABELS[cat] || cat.replace(/_/g, ' ')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ════════════ JOBS MODE ════════════ */}
      {mode === 'jobs' && (
        <div id="event-feed" style={{ fontFamily: 'sans-serif', padding: '0px', minHeight: jobsLoading ? '300px' : undefined }}>
          {jobsLoading && <div className="loading-spinner-overlay"><span className="loader"></span></div>}
          {jobsError && <p>Error loading jobs.</p>}
          {!jobsLoading && !jobsError && (
            <ul className="blog">
              {filteredJobs.length === 0 ? (
                <li><p className="no-jobs">No jobs available in this category.</p></li>
              ) : (
                filteredJobs.map((job, i) => (
                  <li key={i} style={{ paddingTop: '18px', paddingBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {job.category && selectedCategory === 'All' && (
                        <span
                          onClick={() => setSelectedCategory(job.category)}
                          title={`Filter by: ${job.category}`}
                          style={{ display: 'inline-block', background: 'rgba(104, 87, 105, 0.88)', color: 'white', fontSize: '13px', fontWeight: 350, padding: '0px 11px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'background 0.2s ease' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#685769'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(104, 87, 105, 0.88)'}
                        >
                          {job.category ? job.category.replace(/_/g, ' ') : ''}
                        </span>
                      )}
                    </div>
                    <h3 style={{ color: '#252525', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px', fontSize: '22px', lineHeight: '1.3', fontFamily: 'Inter, sans-serif' }}>
                      {job.title && job.title.length > 100 ? job.title.substring(0, 100) + '...' : job.title}
                    </h3>
                    <div style={{ color: 'rgb(104, 104, 104)', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', marginBottom: '10px' }}>
                      {job.employer}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="apply-now-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#685769', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14">
                          <path fill="currentColor" fillRule="evenodd" d="M13.854.146a.5.5 0 0 1 .113.534l-5 13a.5.5 0 0 1-.922.027l-2.091-4.6L9.03 6.03a.75.75 0 0 0-1.06-1.06L4.893 8.046l-4.6-2.09a.5.5 0 0 1 .028-.923l13-5a.5.5 0 0 1 .533.113" clipRule="evenodd" />
                        </svg>
                        Apply now
                      </a>
                      <button
                        onClick={() => {
                          const shareText = `Discovered via MIAAC.de:\n\n${job.title}\nat ${job.employer}\n\n${job.link}`
                          if (navigator.share) { navigator.share({ text: shareText }) } else { navigator.clipboard.writeText(shareText) }
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#685769', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} viewBox="0 0 24 24">
                          <path fill="currentColor" d="M17 22q-1.25 0-2.125-.875T14 19q0-.15.075-.7L7.05 14.2q-.4.375-.925.588T5 15q-1.25 0-2.125-.875T2 12t.875-2.125T5 9q.6 0 1.125.213t.925.587l7.025-4.1q-.05-.175-.062-.337T14 5q0-1.25.875-2.125T17 2t2.125.875T20 5t-.875 2.125T17 8q-.6 0-1.125-.213T14.95 7.2l-7.025 4.1q.05.175.063.338T8 12t-.012.363t-.063.337l7.025 4.1q.4-.375.925-.587T17 16q1.25 0 2.125.875T20 19t-.875 2.125T17 22" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {/* ════════════ OPEN CALLS MODE ════════════ */}
      {mode === 'opencalls' && (
        <div id="event-feed" style={{ fontFamily: 'sans-serif', padding: '0px', minHeight: callsLoading ? '300px' : undefined }}>
          {OPEN_CALLS_API_URL === 'REPLACE_WITH_OPEN_CALLS_APPS_SCRIPT_URL' && (
            <p style={{ color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
              Open Calls data source not yet connected. Please deploy the Apps Script for the Open Calls sheet and update <code>OPEN_CALLS_API_URL</code>.
            </p>
          )}
          {callsLoading && <div className="loading-spinner-overlay"><span className="loader"></span></div>}
          {callsError && <p>Error loading open calls.</p>}
          {!callsLoading && !callsError && openCalls && (
            <ul className="blog">
              {filteredCalls.length === 0 ? (
                <li><p className="no-jobs">No open calls available at the moment.</p></li>
              ) : (
                filteredCalls.map((call, i) => {
                  const isExpanded = expandedSummaries[i]
                  const summaryText = call.short_summary || ""
                  const displaySummary = isExpanded ? summaryText : summaryText.substring(0, 40).trim()
                  const hasMore = summaryText.length > 40

                  let deadlineLabel = ""
                  if (call.deadline) {
                    deadlineLabel = formatDeadlineDisplay(call.deadline)
                  }

                  return (
                    <li key={i} style={{ paddingTop: '18px', paddingBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        {call.type && selectedCategory === 'All' && (
                          <span
                            onClick={() => setSelectedCategory(call.type)}
                            title={`Filter by: ${call.type}`}
                            style={{ display: 'inline-block', background: 'rgba(104, 87, 105, 0.88)', color: 'white', fontSize: '13px', fontWeight: 350, padding: '0px 11px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'background 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#685769'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(104, 87, 105, 0.88)'}
                          >
                            {call.type ? call.type.replace(/_/g, ' ') : ''}
                          </span>
                        )}
                      </div>
                      <h3 style={{ color: '#252525', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px', fontSize: '22px', lineHeight: '1.3', fontFamily: 'Inter, sans-serif' }}>
                        {call.title && call.title.length > 150 ? call.title.substring(0, 150) + '...' : call.title}
                      </h3>
                      <div style={{ color: '#888', fontWeight: 500, fontSize: '16px', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                        <span style={{ color: '#6A6868', display: 'inline-block' }}>{(call.organizer || "").trim()}{call.location ? ',' : ''}</span>
                        {" "}
                        <span style={{ display: 'inline-block' }}>{(call.location || "").trim()}</span>
                      </div>

                      {deadlineLabel && (
                        <div style={{ color: '#707070', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V1h-2v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z" />
                          </svg>
                          <span style={{ fontWeight: 400, color: '#707070' }}>Deadline:</span> {deadlineLabel}
                        </div>
                      )}

                      <p style={{ color: '#444', fontSize: '16px', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {displaySummary}{!isExpanded && hasMore && "... "}
                        {hasMore && !isExpanded && (
                          <button
                            onClick={() => setExpandedSummaries(prev => ({ ...prev, [i]: !prev[i] }))}
                            style={{ background: 'none', border: 'none', color: '#685769', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                          >
                            {" "}show more
                          </button>
                        )}
                      </p>

                      {isExpanded && call.eligibility && (
                        <p style={{ color: '#444', fontSize: '16px', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                          <strong>Eligibility:</strong> {call.eligibility}
                        </p>
                      )}

                      {isExpanded && hasMore && (
                        <div style={{ marginBottom: '12px' }}>
                          <button
                            onClick={() => setExpandedSummaries(prev => ({ ...prev, [i]: !prev[i] }))}
                            style={{ background: 'none', border: 'none', color: '#685769', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                          >
                            show less
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <a href={call.url} target="_blank" rel="noopener noreferrer" className="apply-now-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#685769', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14">
                            <path fill="currentColor" fillRule="evenodd" d="M13.854.146a.5.5 0 0 1 .113.534l-5 13a.5.5 0 0 1-.922.027l-2.091-4.6L9.03 6.03a.75.75 0 0 0-1.06-1.06L4.893 8.046l-4.6-2.09a.5.5 0 0 1 .028-.923l13-5a.5.5 0 0 1 .533.113" clipRule="evenodd" />
                          </svg>
                          Apply now
                        </a>
                        <button
                          onClick={() => {
                            const shareText = `Discovered via MIAAC.de:\n\n${call.title}\nat ${call.organizer}\n\n${call.url}`
                            if (navigator.share) { navigator.share({ text: shareText }) } else { navigator.clipboard.writeText(shareText) }
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#685769', fontWeight: 600, fontSize: '16px', fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17 22q-1.25 0-2.125-.875T14 19q0-.15.075-.7L7.05 14.2q-.4.375-.925.588T5 15q-1.25 0-2.125-.875T2 12t.875-2.125T5 9q.6 0 1.125.213t.925.587l7.025-4.1q-.05-.175-.062-.337T14 5q0-1.25.875-2.125T17 2t2.125.875T20 5t-.875 2.125T17 8q-.6 0-1.125-.213T14.95 7.2l-7.025 4.1q.05.175.063.338T8 12t-.012.363t-.063.337l7.025 4.1q.4-.375.925-.587T17 16q1.25 0 2.125.875T20 19t-.875 2.125T17 22" />
                          </svg>
                          Share
                        </button>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          )}
        </div>
      )}
    </>
  )
}
