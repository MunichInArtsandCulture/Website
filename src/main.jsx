import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ApiCacheProvider } from './context/ApiCacheContext'
import App from './App'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ApiCacheProvider>
        <App />
      </ApiCacheProvider>
    </HashRouter>
  </React.StrictMode>
)
