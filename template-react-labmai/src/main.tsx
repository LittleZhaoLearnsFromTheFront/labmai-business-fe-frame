import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initVars } from '@labmai.dev/labmai-element'
import '@labmai.dev/labmai-element/lib/labmai.css'
import './index.css'
initVars()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
