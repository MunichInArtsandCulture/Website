import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const ApiCacheContext = createContext()

// Centralized URLs for preloading
export const DATA_SOURCES = {
  EVENTS: "https://script.google.com/macros/s/AKfycbxO0dXiimcDzRpscpbXY84AgB2EgbV1xezSgRQHV6oyYqkTcIvDJ7V3ABGRABSXebJQ/exec",
  JOBS: "https://script.google.com/macros/s/AKfycbyKnfmzqe_o7PiiAlTeciaImwOmOqrRBeHLV1SL_jvl-fPIBiwuLkIhGlDW0ZymcPArtQ/exec",
  OPEN_CALLS: "https://script.google.com/macros/s/AKfycbyPOcGDPmoRNgdIpZqOMBccIXacwUKWEpN5NftDlfeQ0FRZmttFW2PuJMtZyce_X2Nk/exec",
  ART_SPACES: "/data/art_spaces.json",
  RESOURCES: "/data/resources.json"
}

export function ApiCacheProvider({ children }) {
  const [cache, setCache] = useState({})
  const controllers = useRef({}) // For AbortControllers

  const setCached = useCallback((url, data) => {
    setCache(prev => ({ ...prev, [url]: data }))
  }, [])

  const getCached = useCallback((url) => {
    return cache[url] || null
  }, [cache])

  /**
   * Aborts any OTHER pending fetches to prioritize the new one
   */
  const abortOtherFetches = (activeUrl) => {
    Object.keys(controllers.current).forEach(url => {
      if (url !== activeUrl && controllers.current[url]) {
        controllers.current[url].abort()
        controllers.current[url] = null
      }
    })
  }

  /**
   * Main fetcher with priority support
   */
  const fetchWithPriority = useCallback(async (url, isPriority = false) => {
    // 1. Check Cache
    if (cache[url]) return cache[url]

    // 2. Handle Priority: Abort others if this is a user action
    if (isPriority) {
      abortOtherFetches(url)
    }

    // 3. Create AbortController for this request
    if (!controllers.current[url]) {
      controllers.current[url] = new AbortController()
    }

    try {
      const response = await fetch(url, { signal: controllers.current[url].signal })
      if (!response.ok) throw new Error("Fetch failed")
      const data = await response.json()
      
      setCached(url, data)
      controllers.current[url] = null
      return data
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Preload for ${url} was aborted to favor user navigation.`)
      } else {
        console.error(`Error fetching ${url}:`, error)
      }
      return null
    }
  }, [cache, setCached])

  /**
   * Starts the background preloading queue
   */
  const startBackgroundPreload = useCallback(async () => {
    const queue = [
      DATA_SOURCES.EVENTS,
      DATA_SOURCES.JOBS,
      DATA_SOURCES.OPEN_CALLS,
      DATA_SOURCES.ART_SPACES,
      DATA_SOURCES.RESOURCES
    ]

    for (const url of queue) {
      if (!cache[url]) {
        // We fetch sequentially in background
        await fetchWithPriority(url, false)
      }
    }
  }, [cache, fetchWithPriority])

  return (
    <ApiCacheContext.Provider value={{ getCached, setCached, fetchWithPriority, startBackgroundPreload }}>
      {children}
    </ApiCacheContext.Provider>
  )
}

export function useApiCache() {
  return useContext(ApiCacheContext)
}
