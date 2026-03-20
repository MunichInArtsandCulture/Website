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

function stripEmojis(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B50}]/gu, '').replace(/\uFE0F/g, '').trim();
}

export default function Events() {
  const { getCached, setCached } = useApiCache()
  const [allEvents, setAllEvents] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)
  const [dateString, setDateString] = useState('')
  const [datePickerValue, setDatePickerValue] = useState('')
  const datePickerRef = useRef(null)

  useEffect(() => {
    const today = getAdjustedToday()
    const formatted = formatDateForComparison(today)
    setDateString(formatted)
    setDatePickerValue(today.toLocaleDateString('sv-SE'))
  }, [])

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

  const filteredEvents = allEvents ? allEvents.filter(e => {
    if (!e.Datum) return false
    const normalizedA = e.Datum.toString().replace(/\D/g, '')
    const normalizedB = dateString.toString().replace(/\D/g, '')
    return normalizedA === normalizedB
  }) : []

  const getDateDisplay = () => {
    if (!dateString) return { day: '', month: '', weekday: '' }
    const cleaned = dateString.replace(/\.$/, '')
    const [day, month] = cleaned.split('.')
    const year = new Date().getFullYear()
    const isoDateStr = `${year}-${month}-${day}`
    const dateObj = new Date(isoDateStr)
    let weekday = ''
    if (!isNaN(dateObj)) {
      weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    }
    return { day, month, weekday }
  }

  const { day, month, weekday } = getDateDisplay()

  return (
    <>
      <div className="date-selector" style={{ marginBottom: '0px', display: 'flex', gap: '6px', alignItems: 'center', paddingBottom: '2rem' }}>
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

      <div id="event-feed" style={{ position: 'relative', minHeight: loading ? '300px' : undefined }}>
        {loading && (
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <span className="loader"></span>
          </div>
        )}

        {error && <p>Fehler beim Laden der Events 😢 ({error})</p>}

        {!loading && !error && dateString && (
          <>
            <h2>
              {day}.{month}. {weekday}
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
              <ul className="blog">
                {filteredEvents.map((event, i) => (
                  <li key={i}>
                    <h3>
                      <a href={event.Links ? event.Links.split(" | ")[0] : '#'} target="_blank" rel="noopener noreferrer">
                        {stripEmojis(event.Titel)}
                      </a>
                    </h3>
                    <p className="event-description">
                      {stripEmojis(event.Beschreibung)}
                    </p>
                    <div className="eventdetails">
                      <div className="item_time">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" style={{marginInline: 'auto', verticalAlign: 'middle', marginRight: '5px'}} viewBox="0 0 24 24"><path fill="currentColor" d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11m1-17.5h-2v6.914l4 4L16.414 15L13 11.586z"/></svg> 
                        {stripEmojis(event.Uhrzeit) || 'N/A'}
                      </div>
                      <div className="item_loc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" style={{verticalAlign: 'middle', marginRight: '5px'}} viewBox="0 0 24 24"><path fill="currentColor" d="M19 9A7 7 0 1 0 5 9c0 1.387.409 2.677 1.105 3.765h-.008L12 22l5.903-9.235h-.007A6.97 6.97 0 0 0 19 9m-7 3a3 3 0 1 1 0-6a3 3 0 0 1 0 6"/></svg> 
                        {stripEmojis(event.Ort) || 'N/A'}
                      </div>
                      <div className="item_price">
                        {stripEmojis(event.Preis) || 'N/A'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  )
}
