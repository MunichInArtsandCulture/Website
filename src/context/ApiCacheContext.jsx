import { createContext, useContext, useState, useCallback } from 'react'

const ApiCacheContext = createContext()

export function ApiCacheProvider({ children }) {
  const [cache, setCache] = useState({})

  const fetchWithCache = useCallback(async (url) => {
    if (cache[url]) {
      return { data: cache[url], loading: false, error: null }
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      setCache(prev => ({ ...prev, [url]: data }))
      return { data, loading: false, error: null }
    } catch (error) {
      return { data: null, loading: false, error: error.message }
    }
  }, [cache])

  const getCached = useCallback((url) => {
    return cache[url] || null
  }, [cache])

  const setCached = useCallback((url, data) => {
    setCache(prev => ({ ...prev, [url]: data }))
  }, [])

  return (
    <ApiCacheContext.Provider value={{ fetchWithCache, getCached, setCached }}>
      {children}
    </ApiCacheContext.Provider>
  )
}

export function useApiCache() {
  return useContext(ApiCacheContext)
}
