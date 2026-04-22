import { useState, useEffect, useRef } from 'react'
import { useApiCache, DATA_SOURCES } from '../context/ApiCacheContext'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

const API_URL = DATA_SOURCES.EVENTS

function formatDateForComparison(date) {
  const d = new Date(date)
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + "."
}

function getAdjustedToday() {
  const now = new Date()
  const cetString = now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  const adjusted = new Date(cetString)
  if (adjusted.getHours() < 3) {
    adjusted.setDate(adjusted.getDate() - 1)
  }
  return adjusted
}

function stripEmojis(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B50}]/gu, '').replace(/\uFE0F/g, '').trim();
}

const handleValueUpdate = (selectedDates, dateStr, instance) => {
  if (selectedDates.length === 2 && selectedDates[0].getTime() === selectedDates[1].getTime()) {
    instance.input.value = instance.formatDate(selectedDates[0], "d.m.y.");
  } else if (selectedDates.length === 1) {
    instance.input.value = instance.formatDate(selectedDates[0], "d.m.y.") + " - ...";
  } else if (selectedDates.length === 2) {
    instance.input.value = instance.formatDate(selectedDates[0], "d.m.y.") + " - " + instance.formatDate(selectedDates[1], "d.m.y.");
  }
}

const FLATPICKR_OPTIONS = {
  mode: 'range',
  dateFormat: 'd.m.y.',
  locale: {
    rangeSeparator: " - "
  },
  onValueUpdate: handleValueUpdate
}

export default function Events() {
  const { getCached, fetchWithPriority } = useApiCache()
  const [allEvents, setAllEvents] = useState(getCached(API_URL) || null)
  const [loading, setLoading] = useState(!getCached(API_URL))
  const [error, setError] = useState(null)

  const [startDateIso, setStartDateIso] = useState('')
  const [endDateIso, setEndDateIso] = useState('')
  const fpRef = useRef(null)

  useEffect(() => {
    const today = getAdjustedToday()
    const iso = today.toLocaleDateString('sv-SE')
    setStartDateIso(iso)
    setEndDateIso(iso)
    // Initialize date picker firmly on first load
    if (fpRef.current?.flatpickr) {
      fpRef.current.flatpickr.setDate([today, today], false);
    }
  }, [])

  useEffect(() => {
    const cached = getCached(API_URL)
    if (cached) {
      setAllEvents(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    fetchWithPriority(API_URL, true)
      .then(events => {
        if (!events) throw new Error("Could not retrieve events");
        setAllEvents(events)
        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message)
        setLoading(false)
      })
  }, [getCached, fetchWithPriority])

  const todayIso = getAdjustedToday().toLocaleDateString('sv-SE')
  const tomorrow = getAdjustedToday()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowIso = tomorrow.toLocaleDateString('sv-SE')

  const handleToday = () => {
    const adjToday = getAdjustedToday()
    setStartDateIso(adjToday.toLocaleDateString('sv-SE'))
    setEndDateIso(adjToday.toLocaleDateString('sv-SE'))
    if (fpRef.current && fpRef.current.flatpickr) {
      fpRef.current.flatpickr.setDate([adjToday, adjToday], false)
    }
  }

  const handleTomorrow = () => {
    const adjTom = getAdjustedToday()
    adjTom.setDate(adjTom.getDate() + 1)
    setStartDateIso(adjTom.toLocaleDateString('sv-SE'))
    setEndDateIso(adjTom.toLocaleDateString('sv-SE'))
    if (fpRef.current && fpRef.current.flatpickr) {
      fpRef.current.flatpickr.setDate([adjTom, adjTom], false)
    }
  }

  const handleDatePick = (selectedDates, dateStr, instance) => {
    if (selectedDates.length === 2) {
      let [start, end] = selectedDates;
      let adjusted = false;
      // enforce 1 week maximum range
      if ((end.getTime() - start.getTime()) / 86400000 > 6) {
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        adjusted = true;
      }
      setStartDateIso(start.toLocaleDateString('sv-SE'))
      setEndDateIso(end.toLocaleDateString('sv-SE'))
      // Ensure the picker visually snaps to 1 week!
      if (adjusted) {
        setTimeout(() => {
          if (instance) instance.setDate([start, end], false);
        }, 10);
      }
    } else if (selectedDates.length === 1) {
      const [start] = selectedDates;
      setStartDateIso(start.toLocaleDateString('sv-SE'))
      setEndDateIso('') // Waiting for second click
    } else {
      setStartDateIso('')
      setEndDateIso('')
    }
  }

  // Extracted handleValueUpdate outside of the component

  // Generate range of days
  const daysInRange = []
  if (startDateIso && endDateIso) {
    let curr = new Date(startDateIso)
    const end = new Date(endDateIso)
    while (curr <= end) {
      daysInRange.push(new Date(curr))
      curr.setDate(curr.getDate() + 1)
      if (daysInRange.length >= 7) break; // Limit to maximum 7 days visually
    }
  }

  const groupedEvents = daysInRange.map(dateObj => {
    const dateStr = formatDateForComparison(dateObj)
    const targetNorm = dateStr.replace(/\D/g, '')

    const dayEvents = allEvents ? allEvents.filter(e => {
      if (!e.Datum) return false
      const eventDateStr = formatDateForComparison(e.Datum)
      const normA = eventDateStr.replace(/\D/g, '')
      return normA === targetNorm || normA.includes(targetNorm)
    }) : []

    const cleaned = dateStr.replace(/\.$/, '')
    const [day, month] = cleaned.split('.')
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' })

    return {
      dateObj,
      dateStr,
      day,
      month,
      weekday,
      events: dayEvents
    }
  })

  const isTodayActive = startDateIso === todayIso && endDateIso === todayIso
  const isTomorrowActive = startDateIso === tomorrowIso && endDateIso === tomorrowIso

  return (
    <>
      <h1 className="mobile-page-title">Events</h1>
      <div className="date-selector" style={{ marginBottom: '0px', display: 'flex', gap: '6px', alignItems: 'center', paddingBottom: '2rem', flexWrap: 'wrap' }}>
        <button type="button" className={isTodayActive ? 'active' : ''} onClick={handleToday}>Today</button>
        <button type="button" className={isTomorrowActive ? 'active' : ''} onClick={handleTomorrow}>Tomorrow</button>

        <div className="date-picker-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flatpickr
            ref={fpRef}
            onChange={handleDatePick}
            options={FLATPICKR_OPTIONS}
            placeholder="Select date range..."
            className="custom-flatpickr-input"
          />
        </div>
      </div>

      <div id="event-feed" style={{ position: 'relative', minHeight: loading ? '300px' : undefined }}>
        {loading && (
          <div className="loading-spinner-overlay">
            <span className="loader"></span>
          </div>
        )}

        {error && <p>Fehler beim Laden der Events 😢 ({error})</p>}

        {!loading && !error && groupedEvents.length > 0 && (
          <>
            {groupedEvents.map((group, idx) => (
              <div key={idx} style={{ marginBottom: '3rem' }}>
                <h2 style={{
                  color: '#26544a',
                  fontFamily: 'Inter',
                  fontSize: '24px',
                  fontWeight: 500,
                  marginBottom: '15px',
                  letterSpacing: '-0.3px'
                }}>
                  {group.day}.{group.month}. {group.weekday}
                </h2>

                {group.events.length === 0 ? (
                  <ul className="blog">
                    <li style={{ borderTop: 'none', paddingTop: '10px' }}>
                      <p className="event-description" style={{ lineHeight: '30px', margin: 0 }}>
                        No events found :( <br />
                        You can check the{' '}
                        <a href="https://docs.google.com/document/d/1xT5Ovg8pouKkpwHXKdU45J9vlyqEYD__ZGuKZErmhTU/" target="_blank" rel="noopener noreferrer">
                          Database
                        </a>{' '}
                        just in case.
                      </p>
                    </li>
                  </ul>
                ) : (
                  <ul className="blog">
                    {group.events.map((event, i) => (
                      <li key={i}>
                        <h3>
                          <a href={(event.Link || event.Links) ? (event.Link || event.Links).split(" | ")[0] : '#'} target="_blank" rel="noopener noreferrer">
                            {stripEmojis(event.Titel)}
                          </a>
                        </h3>
                        <p className="event-description">
                          {stripEmojis(event.Beschreibung)}
                        </p>
                        <div className="eventdetails">
                          <div className="item_time">
                            <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 23C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11s-4.925 11-11 11m1-17.5h-2v6.914l4 4L16.414 15L13 11.586z" /></svg>
                            </div>
                            <div className="text">
                              {stripEmojis(event.Uhrzeit) || 'N/A'}
                            </div>
                          </div>
                          <div className="item_loc">
                            <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M19 9A7 7 0 1 0 5 9c0 1.387.409 2.677 1.105 3.765h-.008L12 22l5.903-9.235h-.007A6.97 6.97 0 0 0 19 9m-7 3a3 3 0 1 1 0-6a3 3 0 0 1 0 6" /></svg>
                            </div>
                            <div className="text">
                              {stripEmojis(event.Ort) || 'N/A'}
                            </div>
                          </div>
                          <div className="item_price">
                            <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="17" viewBox="0 0 17 24">
                                <path fill="currentColor" d="m16.64 20.097l.597 2.71a.5.5 0 0 1-.053.385l.001-.002a.54.54 0 0 1-.286.246l-.004.001l-.086.017a.8.8 0 0 1-.174.059l-.005.001q-.11.026-.273.08t-.366.094q-.205.042-.434.086t-.511.086t-.571.08t-.622.051q-.333.017-.656.017a11.3 11.3 0 0 1-7.002-2.246l.03.021a11.04 11.04 0 0 1-4.039-5.914l-.018-.077H.549a.553.553 0 0 1-.546-.545V13.32a.553.553 0 0 1 .545-.546h1.125q-.034-.971.017-1.79H.527a.525.525 0 0 1-.525-.525v-.022v.001v-1.964c0-.29.235-.525.525-.525h.022h-.001h1.67a11.16 11.16 0 0 1 4.118-5.738l.033-.022A11.26 11.26 0 0 1 13.199 0h-.007h.066c1.151 0 2.268.143 3.335.412l-.094-.02c.142.046.26.136.339.254l.001.002a.56.56 0 0 1 .05.413l.001-.004l-.733 2.71a.5.5 0 0 1-.238.331l-.002.001a.49.49 0 0 1-.412.041l.003.001l-.068-.017q-.068-.017-.196-.042l-.298-.06l-.383-.06l-.443-.051l-.494-.042l-.503-.017l-.1-.001c-1.393 0-2.69.407-3.78 1.109l.028-.017A6.8 6.8 0 0 0 6.728 7.9l-.017.043h7.978a.56.56 0 0 1 .546.651v-.003l-.409 1.943a.5.5 0 0 1-.548.443h.002h-8.32a15 15 0 0 0 .002 1.832l-.002-.043h7.831c.17 0 .321.08.419.204l.001.001a.55.55 0 0 1 .102.464l.001-.004l-.409 1.909a.55.55 0 0 1-.527.443H6.784c1.036 2.558 3.5 4.33 6.378 4.33h.069h-.003q.307 0 .614-.026t.571-.06t.503-.08t.418-.086l.315-.08l.205-.051l.086-.034a.5.5 0 0 1 .445.036l-.002-.001c.134.077.23.208.258.362z" />
                              </svg>
                            </div>
                            <div className="text">
                              {(typeof event.Preis === 'string' ? stripEmojis(event.Preis).replace(/€/g, '').trim() : stripEmojis(event.Preis)) || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        )}

        <div className="footnote-box" style={{ padding: '20px 10px', fontSize: '11px', color: '#888', fontStyle: 'inherit', marginTop: '20px' }}>
          <p style={{ margin: 0 }}>
            <i style={{ fontStyle: 'italic' }}>*Content:</i> All details are provided without guarantee. They may be outdated, based on third-party sources, or affected by translation and processing. Please verify everything directly with the venue. AI-generated content may be inaccurate. Content can be removed upon request.
          </p>
        </div>
      </div >
    </>
  )
}
