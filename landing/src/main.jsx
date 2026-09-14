import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThankYou from './components/ThankYou.jsx'
import DocPage from './components/DocPage.jsx'
import TestKeys from './components/TestKeys.jsx'

const DOCS = ['terms', 'privacy', 'refunds', 'security', 'status']
const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '')
const page = path.replace(/^\//, '')

let node = <App />
if (page === 'thank-you') node = <ThankYou />
else if (page === 'test-keys') node = <TestKeys />
else if (DOCS.includes(page)) node = <DocPage slug={page} />

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {node}
  </StrictMode>,
)
