import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { AppProviders } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
    
  </StrictMode>,
)
