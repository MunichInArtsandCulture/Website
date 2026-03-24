import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

const API_URL = "https://script.google.com/macros/s/AKfycbyKnfmzqe_o7PiiAlTeciaImwOmOqrRBeHLV1SL_jvl-fPIBiwuLkIhGlDW0ZymcPArtQ/exec"

const CATEGORY_LIST = [
  "Art, Artist Support and Event Management",
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

const DEFAULT_CATEGORY = "Art, Artist Support and Event Management"

export default function Jobs() {
  const { getCached, setCached } = useApiCache()
  const [allJobs, setAllJobs] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch jobs
  useEffect(() => {
    const cached = getCached(API_URL)
    if (cached) {
      setAllJobs(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setCached(API_URL, data)
        setAllJobs(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [getCached, setCached])

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

  const filteredJobs = allJobs ? allJobs.filter(job => job.category === selectedCategory) : []

  return (
    <>
      <div className="title-box">
        <div className="filter" style={{ marginBottom: '2rem' }}>
          <div style={{ flex: '0 1 auto' }}>
            <div style={{ fontSize: '13px', color: '#6B6B6B', marginBottom: '5px' }}>Category</div>
            <div className="custom-dropdown" ref={dropdownRef}>
              <button
                id="dropdown-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ width: '100%' }}
              >
                {selectedCategory}
              </button>
            <ul id="dropdown-options" className={dropdownOpen ? '' : 'hidden'}>
              {CATEGORY_LIST.map(cat => (
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
      </div>

      <div id="event-feed" style={{ fontFamily: 'sans-serif', padding: '0px', minHeight: loading ? '300px' : undefined }}>
        {loading && (
          <div className="loading-spinner-overlay">
            <span className="loader"></span>
          </div>
        )}

        {error && <p>Error loading jobs.</p>}

        {!loading && !error && (
          <ul className="blog">
            {filteredJobs.length === 0 ? (
              <li><p className="no-jobs">No jobs available in this category.</p></li>
            ) : (
              filteredJobs.map((job, i) => (
                <li key={i}>
                  <h3><a href={job.link} target="_blank" rel="noopener noreferrer">{job.title && job.title.length > 80 ? job.title.substring(0, 80) + '...' : job.title}</a></h3>
                  <p className="event-description"><strong>{job.employer}</strong></p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </>
  )
}
