import { useState, useEffect, useRef } from 'react'
import { useApiCache } from '../context/ApiCacheContext'

const API_URL = "https://script.google.com/macros/s/AKfycbxO0dXiimcDzRpscpbXY84AgB2EgbV1xezSgRQHV6oyYqkTcIvDJ7V3ABGRABSXebJQ/exec"

function formatDateForComparison(date) {
  const d = new Date(date)
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + "."
}

function getAdjustedToday() {
  const now = new Date()
  const adjusted = new Date(now)
  if (now.getHours() < 4) {
    adjusted.setDate(now.getDate() - 1)
  }
  return adjusted
}

export default function Events() {
  const { getCached, setCached } = useApiCache()
  const [allEvents, setAllEvents] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)
  const [dateString, setDateString] = useState('')
  const [datePickerValue, setDatePickerValue] = useState('')
  const datePickerRef = useRef(null)

  // Set initial date
  useEffect(() => {
    const today = getAdjustedToday()
    const formatted = formatDateForComparison(today)
    setDateString(formatted)
    setDatePickerValue(today.toLocaleDateString('sv-SE'))
  }, [])

  // Fetch events (uses cache if available)
  useEffect(() => {
    const cached = getCached(API_URL)
    if (cached) {
      setAllEvents(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then(events => {
        setCached(API_URL, events)
        setAllEvents(events)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [getCached, setCached])

  const handleToday = () => {
    const today = getAdjustedToday()
    const formatted = formatDateForComparison(today)
    setDateString(formatted)
    setDatePickerValue(today.toLocaleDateString('sv-SE'))
  }

  const handleTomorrow = () => {
    const tomorrow = getAdjustedToday()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const formatted = formatDateForComparison(tomorrow)
    setDateString(formatted)
    setDatePickerValue(tomorrow.toLocaleDateString('sv-SE'))
  }

  const handleDatePick = (e) => {
    const selected = e.target.value
    if (selected) {
      setDatePickerValue(selected)
      const formatted = formatDateForComparison(new Date(selected))
      setDateString(formatted)
    }
  }

  // Filter events for selected date
  const filteredEvents = allEvents ? allEvents.filter(e => {
    if (!e.Datum) return false
    const normalizedA = e.Datum.toString().replace(/\D/g, '')
    const normalizedB = dateString.toString().replace(/\D/g, '')
    return normalizedA === normalizedB
  }) : []

  // Parse date label for display
  const getDateDisplay = () => {
    if (!dateString) return { day: '', month: '', weekday: '' }
    const cleaned = dateString.replace(/\.$/, '')
    const [day, month] = cleaned.split('.')
    const year = new Date().getFullYear()
    const isoDateStr = `${year}-${month}-${day}`
    const dateObj = new Date(isoDateStr)
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    return { day, month, weekday }
  }

  const { day, month, weekday } = getDateDisplay()

  return (
    <div className="title-box">
      {loading && (
        <div className="loading-spinner-overlay">
          <span className="loader"></span>
        </div>
      )}

      <div className="date-selector" style={{ marginBottom: '0px', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2rem' }}>
        <button type="button" onClick={handleToday}>Today</button>
        <button type="button" onClick={handleTomorrow}>Tomorrow</button>
        <div className="date-picker-wrapper">
          <input
            type="date"
            id="date-picker"
            ref={datePickerRef}
            value={datePickerValue}
            onChange={handleDatePick}
          />
          {!datePickerValue && (
            <span className="date-placeholder">Pick date</span>
          )}
        </div>
      </div>

      <div id="event-feed" style={{ fontFamily: 'sans-serif', padding: '0px' }}>
        {error && <p>Fehler beim Laden der Events 😢 ({error})</p>}

        {!loading && !error && dateString && (
          <>
            <h2 style={{ marginTop: '2rem' }}>
              {day}.{month}. <span style={{ fontWeight: 'normal' }}>{weekday}</span>
            </h2>

            {filteredEvents.length === 0 ? (
              <p style={{ lineHeight: '30px' }}>
                No events found :( <br />
                You can check the{' '}
                <a href="https://docs.google.com/document/d/1xT5Ovg8pouKkpwHXKdU45J9vlyqEYD__ZGuKZErmhTU/" target="_blank" rel="noopener noreferrer">
                  Database
                </a>{' '}
                just in case.
              </p>
            ) : (
              filteredEvents.map((event, i) => (
                <div className="event-card" key={i}>
                  <h3>
                    <a href={event.Links ? event.Links.split(" | ")[0] : '#'} target="_blank" rel="noopener noreferrer">
                      {event.Titel}
                    </a>
                  </h3>
                  <p className="event-description">{event.Beschreibung}</p>
                  <p>{event.Uhrzeit}</p>
                  <p>{event.Ort}</p>
                  <p>{event.Preis}</p>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {!loading && (
        <div className="social-links" id="social-links">
          <a href="https://t.me/munichinartsandculture" target="_blank" rel="noopener noreferrer" className="tg-link">Telegram</a>
          <a href="https://www.instagram.com/munichartsandculture/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      )}
    </div>
  )
}
